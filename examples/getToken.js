var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config);

//Get a token valid for 60 minutes
service.getToken({
    expiration: 60
}).then(function(response){
    console.log("response: ", response);
});