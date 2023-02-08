# Cost Explorer charts

## Pre-requisites

 - AWS CLI v2x
 - Python3 3.9x
 - NPM v8.x
 - Node v18.x
 - AWS CDK v2.x
 - Docker service v20.x (optional)

## Testing the function locally (optional)

### Create a docker image with the lambda function code:

```
docker build -t costexplorercharts ./lib/CostExplorerChartsFunction/
```

### Add the AWS credential details on the ```lib/CostExplorerChartsFunction/env.txt``` file:
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SESSION_TOKEN=
```

### Launch the test container
```
docker run -p 9000:8080 --rm --env-file ./env.txt docker run -p 9000:8080 --rm --env-file ./env.txt lamda_function:latest
```
### Invoke the function using the ```curl``` command
```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"period":"Weekly"}'
```

