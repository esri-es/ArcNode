var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config);

service.updateToken().then(function(token){
    console.log("New token: ", token);
});