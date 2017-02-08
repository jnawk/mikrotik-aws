'use strict';

console.log('Loading function');

var AWS = require('aws-sdk');
var route53 = new AWS.Route53();

var localHalf = 'localIPv6AddredsPortion';
var ourZoneId = 'Route53ZoneId';
var hostname = 'hostname';

exports.handler = (event, context, callback) => {
    const message = event.Records[0].Sns.Message;
    var data = JSON.parse(message);
    var ipv6Address = data.ipv6poolCidr.replace('/64', localHalf);
    var params = {
      HostedZoneId: ourZoneId,
      ChangeBatch: { 
        Changes: [ 
          {
            Action: 'UPSERT', 
            ResourceRecordSet: { 
              Name: hostname, 
              Type: 'AAAA', 
              ResourceRecords: [
                {
                  Value: ipv6Address
                }
              ],
              TTL: 60
            }
          }
        ]
      }
    };
    route53.changeResourceRecordSets(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  
};
