"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CevoMsCostexplorerchartsStack = void 0;
const cdk = require("aws-cdk-lib");
// import * as sqs from 'aws-cdk-lib/aws-sqs';
const awsLambda = require("aws-cdk-lib/aws-lambda");
const path = require("path");
const awsIam = require("aws-cdk-lib/aws-iam");
class CevoMsCostexplorerchartsStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new awsLambda.DockerImageFunction(this, 'AssetFunction', {
            code: awsLambda.DockerImageCode.fromImageAsset(path.join(__dirname, 'CostExplorerChartsFunction')),
        });
        const CostExplorerChartsRole = new awsIam.Role(this, 'CostExplorerChartsRole', {
            assumedBy: new awsIam.ServicePrincipal('lambda.amazonaws.com'),
        });
        CostExplorerChartsRole.addManagedPolicy(awsIam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));
        // CostExplorerChartsRole.addManagedPolicy(awsIam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"));
        // CostExplorerChartsRole.addToPolicy()
        // const CostExplorerChartsFunction = new awsLambda.Function(this, 'CostExploreCharts', {
        //   runtime: awsLambda.Runtime.PYTHON_3_9,
        //   handler: 'lambda_function.handler',
        //   role: CostExplorerChartsRole,
        //   timeout: cdk.Duration.minutes(15),
        //   code: awsLambda.Code.fromAsset(path.join(__dirname, 'CostExplorerChartsFunction')) //, {
        // bundling:{
        //   image: awsLambda.Runtime.PYTHON_3_9.bundlingImage,
        //   command: [
        //     '/bin/bash', '-c', 'pip install -r requirements.txt -t /asset-output && cp -au . /asset-output'
        //   ],
        // },
        // })
        // });
    }
}
exports.CevoMsCostexplorerchartsStack = CevoMsCostexplorerchartsStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2V2by1tcy1jb3N0ZXhwbG9yZXJjaGFydHMtc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZXZvLW1zLWNvc3RleHBsb3JlcmNoYXJ0cy1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFFbkMsOENBQThDO0FBQzlDLG9EQUFvRDtBQUNwRCw2QkFBNkI7QUFDN0IsOENBQThDO0FBRTlDLE1BQWEsNkJBQThCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDMUQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ3ZELElBQUksRUFBRSxTQUFTLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1NBQ25HLENBQUMsQ0FBQztRQUVILE1BQU0sc0JBQXNCLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBQztZQUM1RSxTQUFTLEVBQUUsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUM7U0FDL0QsQ0FBQyxDQUFDO1FBRUgsc0JBQXNCLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDLENBQUM7UUFDbkksMElBQTBJO1FBQzFJLHVDQUF1QztRQUV2Qyx5RkFBeUY7UUFDekYsMkNBQTJDO1FBQzNDLHdDQUF3QztRQUN4QyxrQ0FBa0M7UUFDbEMsdUNBQXVDO1FBQ3ZDLDZGQUE2RjtRQUN6RixhQUFhO1FBQ2IsdURBQXVEO1FBQ3ZELGVBQWU7UUFDZixzR0FBc0c7UUFDdEcsT0FBTztRQUNQLEtBQUs7UUFDUCxLQUFLO1FBQ1AsTUFBTTtJQUNSLENBQUM7Q0FDRjtBQS9CRCxzRUErQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG4vLyBpbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XG5pbXBvcnQgKiBhcyBhd3NMYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgYXdzSWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuXG5leHBvcnQgY2xhc3MgQ2V2b01zQ29zdGV4cGxvcmVyY2hhcnRzU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBuZXcgYXdzTGFtYmRhLkRvY2tlckltYWdlRnVuY3Rpb24odGhpcywgJ0Fzc2V0RnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBhd3NMYW1iZGEuRG9ja2VySW1hZ2VDb2RlLmZyb21JbWFnZUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdDb3N0RXhwbG9yZXJDaGFydHNGdW5jdGlvbicpKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IENvc3RFeHBsb3JlckNoYXJ0c1JvbGUgPSBuZXcgYXdzSWFtLlJvbGUodGhpcywgJ0Nvc3RFeHBsb3JlckNoYXJ0c1JvbGUnLHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGF3c0lhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgQ29zdEV4cGxvcmVyQ2hhcnRzUm9sZS5hZGRNYW5hZ2VkUG9saWN5KGF3c0lhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZShcInNlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGVcIikpO1xuICAgIC8vIENvc3RFeHBsb3JlckNoYXJ0c1JvbGUuYWRkTWFuYWdlZFBvbGljeShhd3NJYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoXCJzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhVlBDQWNjZXNzRXhlY3V0aW9uUm9sZVwiKSk7XG4gICAgLy8gQ29zdEV4cGxvcmVyQ2hhcnRzUm9sZS5hZGRUb1BvbGljeSgpXG5cbiAgICAvLyBjb25zdCBDb3N0RXhwbG9yZXJDaGFydHNGdW5jdGlvbiA9IG5ldyBhd3NMYW1iZGEuRnVuY3Rpb24odGhpcywgJ0Nvc3RFeHBsb3JlQ2hhcnRzJywge1xuICAgIC8vICAgcnVudGltZTogYXdzTGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAvLyAgIGhhbmRsZXI6ICdsYW1iZGFfZnVuY3Rpb24uaGFuZGxlcicsXG4gICAgLy8gICByb2xlOiBDb3N0RXhwbG9yZXJDaGFydHNSb2xlLFxuICAgIC8vICAgdGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMTUpLFxuICAgIC8vICAgY29kZTogYXdzTGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdDb3N0RXhwbG9yZXJDaGFydHNGdW5jdGlvbicpKSAvLywge1xuICAgICAgICAvLyBidW5kbGluZzp7XG4gICAgICAgIC8vICAgaW1hZ2U6IGF3c0xhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzkuYnVuZGxpbmdJbWFnZSxcbiAgICAgICAgLy8gICBjb21tYW5kOiBbXG4gICAgICAgIC8vICAgICAnL2Jpbi9iYXNoJywgJy1jJywgJ3BpcCBpbnN0YWxsIC1yIHJlcXVpcmVtZW50cy50eHQgLXQgL2Fzc2V0LW91dHB1dCAmJiBjcCAtYXUgLiAvYXNzZXQtb3V0cHV0J1xuICAgICAgICAvLyAgIF0sXG4gICAgICAgIC8vIH0sXG4gICAgICAvLyB9KVxuICAgIC8vIH0pO1xuICB9XG59XG4iXX0=