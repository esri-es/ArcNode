var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config),
    serviceName = "Test service",
    fields, layer, serviceURL;


fields = [
    service.createField({
        "name": "OBJECTID",
        "type": "esriFieldTypeOID",
        "nullable": false,
        "editable": false
    }),
    service.createField({
        "name": "name",
        "type": "esriFieldTypeString"
    })
];

layer = service.createLayer({
    layerName: "My new layer",
    fields: fields
});

service.checkIfFSExists( { serviceName: serviceName } ).then(function(response){
    if(response.available){

        service.createFeatureService({serviceName: serviceName}).then(function(response){
          addLayers(response.encodedServiceURL, [layer]);
        },function(e){
            console.log("Error: ", e);
        });

    }else{

      console.log("Service already exists: ", response);
      serviceURL = "http://" + config.services_url + "/" + config.account_id + "/arcgis/rest/services/" + encodeURIComponent(serviceName)+ "/FeatureServer"
      addLayers(serviceURL, [layer]);

    }

},function(e){
    console.log("Error: ", e);
});


var addLayers = function(serviceURL, layers){
    service.addLayersToFS({
        service: serviceURL,
        layers: layers
    }).then(function(response){
        console.log("Service initialized.\nResponse:\n", response);
    },function(e){
        console.log("Error: ", e);
    });
};