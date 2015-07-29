var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config);

service.getToken().then(function(response){
    console.log("response: ", response);
});