# mikrotik-aws
Quick 'n' dirty scripts for sending a notification of one's IPv4 address &amp; IPv6 prefix to a SNS topic via API Gateway / Lambda

## Usage
* Create a SNS to publish to
* Create a lambda with the content of `receiveFromMikrotik.js`. (fill out the variables)
    * Base64 encode username:password and put that in the check against `event.headers.Authorization`
    * Put the ARN of the SNS in the SNS `params` variable
* Create a lambda with the content of `updateSg.js`.  (fill out the security group)
    * Subscribe this Lambda to the SNS
* Create an API gateway resource called `json` with a path parameter value of `{json+}`
    * This will create an ANY method.  Configure this method to proxy to your lambda function above
* Install the Mikrotik script (`invokeApiGateway.script`) (filling out the variables)
    * Update `inetInterface`, `un` (username), `pw` (password)
    * Update `baseUrl` - replace with the URL to your API Gateway

## TODO
* Serverless? 
* Cloudformation?
* Config variables?
* Routerboard installation?
