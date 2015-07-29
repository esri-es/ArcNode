var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config),
    types = [
        "esriFieldTypeString",
        "esriFieldTypeDouble",
        "esriFieldTypeInteger"
    ], i;

for(i = 0; i < types.length; i++){
    console.log( types[i] + " = " + service.esriTypeToSqlType(types[i]));
}
