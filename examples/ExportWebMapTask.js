var config = require('./config'),
    ArcNode = require('arc-node'),
    ArcJSON = require('arcgis-json-objects'),
    service = new ArcNode(config);

var webmap = ArcJSON.exportableWebmap({
    "mapOptions": {
        "extent": {
            "xmin": -422228.3214312691,
            "ymin": 4921137.768125086,
            "xmax": -396125.07627191657,
            "ymax": 4928896.126496022
        }
    },
    "operationalLayers": [
        {
            "opacity": 1,
            "url": "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
        }
    ],
    "exportOptions": {
        "outputSize": [
            600,
            300
        ],
        "dpi": 192
    }
});

service.ExportWebMapTask({
    webmap: webmap
}).then(function(response){
    console.log("response: ", JSON.stringify(response, null, "\t"));
});