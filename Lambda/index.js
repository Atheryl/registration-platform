var AWS = require('aws-sdk');
var pinpoint = new AWS.Pinpoint({region: process.env.region}); 
var firehose = new AWS.Firehose({region: process.env.region});
var projectId = process.env.projectId;

exports.handler = (event, context, callback) => {
  console.log('Received event:', event.body);
  var jsonBody = JSON.parse(event.body);
  console.log(jsonBody);
  createEndpoint(jsonBody);
  streamJson(jsonBody);
  callback(null, {
    "isBase64Encoded": false,
    "statusCode": 200,
    "headers": {
      'access-control-allow-origin': '*'
    },
    "body": '{ "Message": "<p>Congratulations from Singapore! You have successfully registered for the Beta.</p><p>We will contact you shortly.</p>"}',
   });
};

function createEndpoint(jsonBody) {
  var endpointId = jsonBody.email + '-' + jsonBody.country + '-' + jsonBody.source;
  var params = {
    ApplicationId: projectId,
    EndpointId: endpointId,
    EndpointRequest: {
      ChannelType: 'EMAIL',
      Address: jsonBody.email,
      OptOut: 'NONE',
      Attributes: {
        Source: [
          jsonBody.source
        ],
        RegisteredOn: [
          jsonBody.simpleDate
        ],
        RegisteredOnOptTimestamp: [
          jsonBody.optTimestamp
        ]
      },
      User: {
        UserAttributes: {
          Nickname: [
            jsonBody.nickname
          ],
          Email: [
            jsonBody.email
          ],
          Country: [
            jsonBody.country
          ],
          CountryISO: [
            jsonBody.countryIso
          ],
          Age: [
            jsonBody.age
          ],
          Platform: [
            jsonBody.platform
          ]
        }
      }
    }
  };
  pinpoint.updateEndpoint(params, function(err,data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      console.log(data);
    }
  });
}  
  
function streamJson(jsonBody) {
  firehose.putRecord(
  {
    DeliveryStreamName:'Datalake', 
    Record: {Data: Buffer.from(JSON.stringify(jsonBody)) }
  }, 
  function(err, data) {
    if (err) { 
      console.log(err, err.stack);
    } else {
      console.log(data); 
    }
  });
}