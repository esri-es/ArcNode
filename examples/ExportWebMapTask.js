var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config);

service.ExportWebMapTask({
    webmap: {
        "mapOptions": {
            "showAttribution": true,
            "extent": {
                "xmin": -10212866.663781697,
                "ymin": 3600493.212559925,
                "xmax": -9987836.052510148,
                "ymax": 3829804.2974154423,
                "spatialReference": {
                    "wkid": 102100,
                    "latestWkid": 3857
                }
            },
            "spatialReference": {
                "wkid": 102100,
                "latestWkid": 3857
            }
        },
        "operationalLayers": [
            {
                "id": "Ocean",
                "title": "Ocean",
                "opacity": 1,
                "minScale": 591657527.591555,
                "maxScale": 9027.977411,
                "url": "http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer"
            }
        ],
        "exportOptions": {
            "outputSize": [
                800,
                1100
            ],
            "dpi": 96
        }
    }
}).then(function(response){
    console.log("response: ", JSON.stringify(response, null, "\t"));
});