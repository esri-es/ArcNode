var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config);

service.findAddressCandidates({
    address: "Emilio muñoz 35, madrid"
}).then(function(response){
    console.log("response: ", JSON.stringify(response, null, "\t"));
});