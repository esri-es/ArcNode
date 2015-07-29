var config = require('./config'),
    ArcNode = require('arc-node'),
    service = new ArcNode(config);

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
    }),
    service.createField({
        "name": "name",
        "type": "esriFieldTypeString",
        "domain": {
            type: "codedValue",
            name: "HouseType",
            codedValues: [
                { name: "Flat", code: "flat" },
                { name: "Appartment", code: "appartment" }
            ]
        }
    })
];

console.log("fields = ", JSON.stringify(fields, null, "\t"));