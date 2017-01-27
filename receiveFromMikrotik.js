'use strict';

console.log('Loading function');
var AWS = require('aws-sdk');
var sns = new AWS.SNS();
exports.handler = (event, context, callback) => {
    if(event.headers.Authorization !== "Basic base64 username:password") {
        callback(null, {
            statusCode: 403,
            body: ""
        });  
        return;
    }
    
    var jsonText = decodeURI(event.pathParameters.json);
    
    console.log(jsonText);
    
    var params = {
        Message: jsonText,
        TopicArn: 'arn:aws:sns:region:account:topic'
    };
    sns.publish(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred

        callback(null, {
            statusCode: 200,
            body: ""
        });  
    }
}
