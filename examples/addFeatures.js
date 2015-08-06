var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config),
    ArcJSON = require('arcgis-json-objects'),
    serviceName = "Test service",
    fields, layer, serviceURL, data;


fields = [
    ArcJSON.field({
        "name": "OBJECTID",
        "type": "esriFieldTypeOID",
        "nullable": false,
        "editable": false
    }),
    ArcJSON.field({
        "name": "name",
        "type": "esriFieldTypeString"
    })
];

layer = ArcJSON.featureLayer({
    layerName: "My new layer",
    fields: fields
});

data = [
    {
        "attributes":{
            name: "Santiago Bernabeu"
        },
        "geometry": {
            "x": -3.688360,
            "y": 40.453039,
            "spatialReference": {"wkid" : 4326}
        }
    },
    {
        "attributes":{
            name: "Esri Spain"
        },
        "geometry": {
            "x": -3.627030,
            "y": 40.432506,
            "spatialReference": {"wkid" : 4326}
        }
    }
];


service.checkIfFSExists( { serviceName: serviceName } ).then(function(response){
    if(response.available){

        service.createFeatureService({name: serviceName}).then(function(response){
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
        service.addFeatures({
            serviceName: serviceName,
            layer: response.layers[0].id,
            features: data
        }).then(function(response){
            console.log("Features added\nresponse = ", JSON.stringify(response, null, "\t"));
        },function(e){
            console.log("Error: ", e);
        });
    },function(e){
        console.log("Error: ", e);
    });
};