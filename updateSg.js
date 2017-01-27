'use strict';

console.log('Loading function');

var AWS = require('aws-sdk');
var ec2 = new AWS.EC2();

var ourSg = 'fixme';

function installNewRules(message, callback) {
    var data = JSON.parse(message);
    var params = {
        GroupId: ourSg,
        IpPermissions: [
            {
                FromPort: 22,
                ToPort: 22,
                IpProtocol: 'tcp',
                IpRanges: [ { CidrIp: data.ipv4cidr } ],
                Ipv6Ranges: [ { CidrIpv6: data.ipv6cidr } ]
            },
            {
                  FromPort: 3389,
                  ToPort: 3389,
                  IpProtocol: 'tcp',
                  IpRanges: [ { CidrIp: data.ipv4cidr } ],
                  Ipv6Ranges: [ { CidrIpv6: data.ipv6cidr } ]
            }
        ]
    };
    console.log(JSON.stringify(params, null, ' '));
    ec2.authorizeSecurityGroupIngress(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(err);
        } else {
            console.log("success");           // successful response
            callback(null, "");
        }
    });
}

exports.handler = (event, context, callback) => {
    const message = event.Records[0].Sns.Message;

    ec2.describeSecurityGroups({GroupIds: [ ourSg ]}, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
            callback(err);    
        } else{ 
            console.log(JSON.stringify(data, null, ' '));           // successful response
            
            var ipPermissions = data.SecurityGroups[0].IpPermissions;
            if(0 == ipPermissions.length) {
                installNewRules(message, callback);
                return;
            }
            
            var newIpPermissions = [];
            ipPermissions.map(function(ipPermission){
                delete ipPermission.UserIdGroupPairs;
                delete ipPermission.PrefixListIds;
                newIpPermissions.push(ipPermission);
            });
            var params = {
                GroupId: ourSg,
                IpPermissions: newIpPermissions
            };
            console.log(JSON.stringify(params, null, ' '));
            ec2.revokeSecurityGroupIngress(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack); // an error occurred
                    callback(err);
                } else {
                    console.log(data);           // successful response
                    installNewRules(message, callback);
                }
            });
        }
    });
};
