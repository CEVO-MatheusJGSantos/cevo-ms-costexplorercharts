import logging, json
import boto3
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import pandas as pd
from datetime import datetime, date, time, timedelta

# Log messages are managed by getLogger()
logger = logging.getLogger()

# Fetchs data from Cost Exporer 
def getUsageCostByService(period, granularity, startDate, endDate):
    # this.period = period
    # this.granularity = granularity
    # this.startDate = startDate
    # this.endDate = endDate
    CostExplorerClient = boto3.client('ce')
    UsageCost = CostExplorerClient.get_cost_and_usage(
            TimePeriod={
                'Start': startDate,
                'End': endDate
            },
            Granularity=granularity,
            Metrics=['UnblendedCost'],
            GroupBy=[
                {
                    'Type':'DIMENSION',
                    'Key': 'SERVICE'
                }
            ],
            Filter={
                "Not": {
                    'Dimensions':{
                        'Key': 'RECORD_TYPE',
                        'Values': [ 'Support', 'Tax' ]
                    }
                }
            }
        )
    CostExplorerClient.close()
    return UsageCost['ResultsByTime']

def plotLines(dataFrame,dataframeIndex, totalsArray):
     # Matplotlib Plot
    sns.set_theme()
    ax = dataFrame.plot(linewidth=2.5)
    handles,labels = ax.get_legend_handles_labels()
    ax.legend(handles, labels,loc='upper left', bbox_to_anchor=(-0.35,1), fancybox=True, shadow=True)
    totalsTable=plt.table(cellText=[["$%.2f" % number for number in totalsArray.values]], colLabels=list(dataframeIndex),cellLoc='center')
    ax.set_title('Usage cost by service')
    ax.set_ylabel('USD$')
    ax.add_table(totalsTable)
    ax.grid(color='w',axis='both')
    Size = plt.gcf().get_size_inches()
    plt.gcf().set_size_inches(Size[0]*3, Size[1]*2, forward=True) 
    plt.xticks([]) # remove the x_axys labels
    plt.figure(1).tight_layout()
    return plt

def plotPie(dataFrame):
    fig, ax = plt.subplots(figsize=(6, 3), subplot_kw=dict(aspect="equal"))
    bbox_props = dict(boxstyle="square,pad=0.3", fc="w", ec="k", lw=0.72)
    kw = dict(arrowprops=dict(arrowstyle="-"),bbox=bbox_props, zorder=0, va="center")
    def make_autopct(values):
        def my_autopct(pct):
            total = sum(values)
            val = float((pct*total/100.0))
            return '${v:.2f}\n({p:.2f}%)'.format(v=val,p=pct)
        return my_autopct
    wedges, texts, autotext = ax.pie(
        list(dataFrame.values[0]), 
        autopct=make_autopct(list(dataFrame.values[0])),
        pctdistance=0.9,
        wedgeprops=dict(width=0.6), 
        startangle=15, 
        textprops=dict(color="k"))
    for i, p in enumerate(wedges):
        ang = (p.theta2 - p.theta1)/2. + p.theta1
        y = np.sin(np.deg2rad(ang))
        x = np.cos(np.deg2rad(ang))
        horizontalalignment = {-1: "right", 1: "left"}[int(np.sign(x))]
        connectionstyle = "angle,angleA=0,angleB={}".format(ang)
        kw["arrowprops"].update({"connectionstyle": connectionstyle})
        ax.annotate(dataFrame.columns[i], xy=(x, y), xytext=(1.35*np.sign(x), 1.2*y),horizontalalignment=horizontalalignment, **kw)
    ax.set_title('Usage cost by service - '+(date.today()).strftime('%B %Y'))
    Size = plt.gcf().get_size_inches()
    plt.gcf().set_size_inches(Size[0]*3, Size[1]*4, forward=True) 
    plt.figure(1).tight_layout()
    return plt

def plotBars(dataFrame):
    sns.set_theme()
    ax = dataFrame.plot.bar(color = sns.color_palette())
    handles,labels = ax.get_legend_handles_labels()

    ax.legend(handles, labels,loc='upper left', bbox_to_anchor=(-0.35,1), fancybox=True, shadow=True)
    totalsTable=plt.table(cellText=[["$%.2f" % number for number in dataFrame.sum(axis=1)]], colLabels=list(dataFrame.index),cellLoc='center')
    ax.set_title('Usage cost by service')
    ax.set_ylabel('USD$')
    ax.add_table(totalsTable)

    Size = plt.gcf().get_size_inches()

    plt.gcf().set_size_inches(Size[0]*3, Size[1]*2, forward=True) 
    plt.xticks([]) # remove the x_axys labels
    plt.figure(1).tight_layout()

    return plt

def handler(event, context):

    if 'period' in event:
        period = event.get('period')
    # else:
    #     logger.error("Missing period info from event")

    if 'startDate' in event:
        startDate = event.get('startDate')
    else:
        startDate = None

    if 'endDate' in event:
        endDate = event.get('endDate')
    else:
        endDate = None

    if 'granularity' in event:
        granularity = event.get('granularity')
    else:
        granularity = None

    if startDate is None and endDate is None and granularity is None:
        if period == 'Weekly':
            startDate = str(date.today() - timedelta(8))
            endDate= str(date.today()- timedelta(1))
            granularity = 'DAILY'
        elif period == "Montly":
            firstDay = datetime.today().replace(day=1)
            previousMonthLastDay = ((firstDay - timedelta(days=1)).replace(hour=23,minute=59,second=59))
            previousMonthFirstDay = (previousMonthLastDay.replace(day=1,hour=0,minute=0,second=0))
            startDate = previousMonthFirstDay.strftime('%Y-%m-%d')
            endDate = previousMonthLastDay.strftime('%Y-%m-%d')
            granularity = 'MONTHLY'
        else:
            result = logger.error("Not enough parameters: period: {}, startDate: {}, endDate: {}, granularity: {}".format(period,startDate,endDate,granularity))
            return { result }
            

    # Get the usage cost by service from Cost Explorer
    UsageCost = getUsageCostByService(period=period, granularity=granularity, startDate=startDate, endDate=endDate)

    # Generate a numpy array with the index for the dataframe, which is the data points related to the granularity
    DataframeIndex=np.array([dict['TimePeriod']['Start'] for dict in UsageCost])

    # Generate a numpy array with the list of all services returned by the cost explorer API, and remove the duplicated values
    DataframeColumns=np.unique(np.array(pd.json_normalize(UsageCost, record_path=['Groups','Keys'])[0]))

    # Creates a dict with all service names, assigning zero for all datapoints per service
    UsageCostData={}
    [UsageCostData.update({item:[float(0)]*len(DataframeIndex)}) for item in DataframeColumns]

    # Generates the Pandas dataframe with all services as columns, datapoints as rows and zero for all values
    UsageCostDataframe=pd.DataFrame(UsageCostData, index=DataframeIndex)

    # Iterates through the data returned by the cost explorer API and updates the values for each service by datapoint
    for timeStamp in DataframeIndex:
        id=np.where(DataframeIndex==timeStamp)[0][0]
        for value in UsageCost[id]['Groups']:
            for ServiceName in value['Keys']:
                UsageCostDataframe[ServiceName][timeStamp]=float(value['Metrics']['UnblendedCost']['Amount'])


    # Summarize total values per period
    newTotalsArray=UsageCostDataframe.sum(axis=1)

    #Define the minimum value threshold for the services
    valueThreshold = (np.mean(newTotalsArray.values)*0.01) # Should be 0.01 for monthly report

    # Summarizes all values below the threshold into a single "Others" column
    UsageCostDataframe['Others']=UsageCostDataframe[UsageCostDataframe.columns[UsageCostDataframe.sum()<valueThreshold]].sum(axis=1).values

    # Creating a new dataframe with only values above the threshold
    TopUsageCostDataframe=UsageCostDataframe[UsageCostDataframe.columns[UsageCostDataframe.sum() > valueThreshold]]
    
    print("period: {}, startDate: {}, endDate: {}, granularity: {}".format(period,startDate,endDate,granularity))


    if 'chartType' in event:
        chartType = event.get('chartType')
    else:
        if period == 'Weekly':
            chartType = 'BarChart'
            costExplorerChart = plotLines(TopUsageCostDataframe, DataframeIndex, newTotalsArray)
        if period == 'Monthly':
            chartType = 'PieChart'
            costExplorerChart = plotPie(TopUsageCostDataframe)

    print("costExplorerChart: {}".format(costExplorerChart))
    if costExplorerChart:
        ### Send the file to S3 bucket
        import io
        piechartFigure=io.BytesIO()
        costExplorerChart.savefig(piechartFigure, format="png")

        chartFileName = datetime.today().strftime('%Y-%m-%d') + " - CostExplorer - " + chartType + " - " + str(datetime.today().strftime('%Y%m%d%H%M%S'))

        s3 = boto3.resource('s3')
        fileUpload = s3.Object('cevo-ms-reporting-test',chartFileName).put(Body=piechartFigure.getvalue(),ContentType='image/png')
        print(fileUpload)
        #s3.ObjectAcl('cevo-ms-reporting-test','picture.png').put(ACL='public-read')

        if fileUpload['ResponseMetadata']['HTTPStatusCode'] == 200:
        #Generates a pre-signed UP to access the object
            s3Client = boto3.client('s3')
            shareUrl = s3Client.generate_presigned_url('get_object',Params={'Bucket': 'cevo-ms-reporting-test','Key':chartFileName})
            print(shareUrl)

            return shareUrl

