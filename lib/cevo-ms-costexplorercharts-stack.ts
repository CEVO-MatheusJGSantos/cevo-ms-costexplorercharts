import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as awsLambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as awsIam from 'aws-cdk-lib/aws-iam';

export class CevoMsCostexplorerchartsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const CostExplorerChartsRole = new awsIam.Role(this, 'CostExplorerChartsRole'{
      assumedBy: new awsIam.ServicePrincipal('lambda.amazonaws.com'),
    });

    CostExplorerChartsRole.addManagedPolicy(awsIam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
    // CostExplorerChartsRole.addManagedPolicy(awsIam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"));
    CostExplorerChartsRole.addToPolicy()

    const CostExplorerChartsFunction = new awsLambda.Function(this, 'CostExploreCharts', {
      runtime: awsLambda.Runtime.PYTHON_3_9,
      handler: 'lambda_function.handler',
      role: CostExplorerChartsRole,
      timeout: cdk.Duration.minutes(15),
      code: awsLambda.Code.fromAsset(path.join(__dirname, 'CostExplorerChartsFunction')) //, {
        // bundling:{
        //   image: awsLambda.Runtime.PYTHON_3_9.bundlingImage,
        //   command: [
        //     '/bin/bash', '-c', 'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output'
        //   ],
        // },
      // })
    });

    CostExplorerChartsFunction.addLayers()

    


  }
}
