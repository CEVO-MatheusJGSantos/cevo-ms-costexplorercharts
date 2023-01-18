import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as awsLambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class CevoMsCostexplorerchartsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const CostExplorerChartsFunction = new awsLambda.Function(this, 'CostExploreCharts', {
      runtime: awsLambda.Runtime.PYTHON_3_9,
      handler: 'lambda_function.handler',
      code: awsLambda.Code.fromAsset(path.join(__dirname, 'CostExplorerChartsFunction'), {
        bundling:{
          image: awsLambda.Runtime.PYTHON_3_9.bundlingImage,
          command: [
            'bash', '-c', 'pip install boto3;ls -l /asset*'
          //   '/bin/bash', '-c', 'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output'
          ],
        },
      })
    });
  }
}
