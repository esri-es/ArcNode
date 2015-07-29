var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config),
    serviceName = "Test service";

service.checkIfFSExists( { serviceName: serviceName } ).then(function(response) {
    if(response.available) {
        console.log("There is not a feature name called:", serviceName);
    }else{
        console.log("There is a feature name called:", serviceName);
    }
    console.log("response:", response);
});