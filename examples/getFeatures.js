var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config);

//Get a token valid for 60 minutes
service.getToken({
    expiration: 60
}).then(function(response){
    // Query features
    var fs = 'https://services1.arcgis.com/nCKYwcSONQTkPA4K/arcgis/rest/services/Playas_2015/FeatureServer/0',
        options = {
          serviceUrl: fs,
          query: {
            f: 'json',
            where:  'Provincia LIKE \'Almería\'',
            outFields: '*',
          }
        };

    service.getFeatures(options).then(function(res){
      console.log("res: ", JSON.stringify(res.features, null, "\t"));
    });
});