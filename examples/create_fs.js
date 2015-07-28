var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config),
    serviceName = "Test service",
    fields, layer;

service.checkIfFSExists( { serviceName: serviceName } ).then(function(available){
    if(available){
        service.createFeatureService({name: serviceName}).then(function(response){

        fields = [{
          "name": "OBJECTID",
          "type": "esriFieldTypeOID",
          "alias": "OBJECTID",
          "sqlType": "sqlTypeOther",
          "nullable": false,
          "editable": false,
          "domain": null,
          "defaultValue": null
        },{
          "name": "Name",
          "type": "esriFieldTypeString",
          "alias": "Your name",
          "sqlType": service.esriToSqlType('esriFieldTypeString'),
          "nullable": false,
          "editable": false,
          "domain": null,
          "defaultValue": null,
          "length": 255
      }];

      layer = service.createLayer({
          name: serviceName,
          fields: fields
      });

      service.addLayerToFS({
        service: response.encodedServiceURL,
        layer: layer
      }).then(function(response){
          console.log("Service initialized: ", serviceName);
      },function(e){
          console.log("Error: ", e);
      });

    },function(e){
        console.log("Error: ", e);
    });
  }else{
      console.log("Yes, service initialized: ", serviceName);
  }

},function(e){
    console.log("Error: ", e);
});