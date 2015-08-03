/**
 * Created by Raul.Jimenez on 17/07/2015.
 */
'use strict';

var defer = require("node-promise").defer;
var querystring = require('querystring');
var https = require('https');
var http = require('http');
//var StringDecoder = require('string_decoder').StringDecoder;

module.exports = function ArcNode(options) {
    this.username =     options.username;
    this.password =     options.password;
    this.account_id =   options.account_id;
    this.root_url =     options.root_url;
    this.services_url = options.services_url;
    var that = this;


    /************************************************************
     *
     *   This function renews the instance token for 15 days
     *
     ************************************************************/
    this.getToken = function(options){
        var deferred = defer(),
            postData;

        options = options || {};
        options.client = options.client || 'referer';
        options.referrer = options.expiration || 'arcgis.com';
        options.expiration = options.expiration || 21600;

        postData = querystring.stringify({
            f: 'json',
            username: that.username,
            password: that.password,
            client: options.client,
            referer: options.referrer,
            expiration: options.expiration
        });


        var req = https.request({
            hostname: that.root_url,
            path: "/sharing/rest/generateToken",
            method: 'POST',
            body: postData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        }, function(response) {
            response.setEncoding('utf8');
            response.on('data', function (chunk) {
                chunk = JSON.parse(chunk);
                that.token = chunk.token;
                deferred.resolve(chunk);
            }).on('error', function(e) {
                deferred.reject(e.message);
            });
        });

        req.write(postData);
        req.end();

        return deferred;
    };

    /************************************************************
     *
     *   This function gets a new token valid for 15 days
     *
     ************************************************************/
    this.checkIfFSExists = function(options){
        var deferred = defer();
        var req;
        var url = "https://" + that.root_url+"/sharing/rest/portals/" + that.account_id+"/isServiceNameAvailable?name=" + options.serviceName+"&f=json&type=Feature Service&token=" + that.token;

        req = https.get(url, function(res) {
            res.on("data", function(chunk) {
                chunk = JSON.parse(chunk);
                if(chunk.error && chunk.error.code == 498){
                    that.getToken().then(function(response){
                        that.checkIfFSExists(options).then(function(available){
                            deferred.resolve(available);
                        });
                    }, function(e) {
                        deferred.reject(e.message);
                    });
                }else{
                    deferred.resolve(chunk);
                }
            });
        }).on('error', function(e) {
            deferred.reject(e.message);
        });
        req.end();
        return deferred;
    };

    /************************************************************
     *
     *   This function create an empty Feature Service
     *
     ************************************************************/
    this.createFeatureService = function(options){

        var deferred = defer();
        var defaultFeature = {
            "maxRecordCount": 2000,
            "supportedQueryFormats": "JSON",
            "capabilities": "Query,Editing,Create,Update,Delete",
            "description": "",
            "allowGeometryUpdates": "true",
            "units": "esriMeters",
            "syncEnabled": "false",
            "editorTrackingInfo": {
                "enableEditorTracking": "false",
                "enableOwnershipAccessControl": "false",
                "allowOthersToUpdate": "true",
                "allowOthersToDelete": "true"
            },
            "xssPreventionInfo": {
                "xssPreventionEnabled": "true",
                "xssPreventionRule": "InputOnly",
                "xssInputRule": "rejectInvalid"
            },
            "tables": [],
            "name": "Set service name"
        };

        if(options.serviceName){
            defaultFeature.name = options.serviceName;
        }

        var postData = querystring.stringify({
            createParameters: JSON.stringify(defaultFeature),
            targetType: "featureService",
            token: that.token,
            f: "json"
        });

        var optionsReq = {
            host: that.root_url,
            path: "/sharing/rest/content/users/"+that.username+"/createService",
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                'Content-Length': postData.length
            }
        };

        var req = http.request(optionsReq, function(res) {
            //var decoder = new StringDecoder('utf8');

            res.on("data", function(chunk) {
                //var textChunk = decoder.write(chunk);
                chunk = JSON.parse(chunk);
                //console.log("chunk=",textChunk)
                deferred.resolve(chunk);
            });
        }).on('error', function(e) {
            deferred.reject(e.message);
        });

        req.write(postData);
        req.end();

        return deferred
    };

    /************************************************************
     *
     *   This function adds a Layer to a Feature service
     *
     ************************************************************/
    this.addLayersToFS = function(options){

        var host, path, postData, deferred, optionsReq, req, aux;

        deferred = defer();

        aux = options.service.split("/");
        host = aux[2];
        aux.shift(); aux.shift(); aux.shift(); aux.pop();
        aux = "/" + aux.join("/");
        path = aux.replace("/rest/","/admin/") + ".FeatureServer/addToDefinition";

        postData = querystring.stringify({
            addToDefinition: JSON.stringify({layers: options.layers}),
            token: that.token,
            f: "json"
        });

        optionsReq = {
            host: host,
            path: path,
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                'Content-Length': postData.length
            }
        };

        req = http.request(optionsReq, function(res) {
            res.on("data", function(chunk) {
                chunk = JSON.parse(chunk);
                if(chunk.code == 400){
                    console.log("Error:=",chunk)
                }
                deferred.resolve(chunk);
            });
        }).on('error', function(e) {
            deferred.reject(e.message);
        });

        req.write(postData);
        req.end();
        return deferred

    };

    /************************************************************
     *
     *   This generates a JSON object
     *   More info: http://resources.arcgis.com/en/help/sds/rest/index.html?featureServiceObject.html
     *
     ************************************************************/
    this.createLayer = function(options){
        var attributes, key, defaultLayer = {
            "adminLayerInfo": {
                "geometryField": {
                    "name": "Shape",
                    "srid": 4326
                }
            },
            "name": "Set_a_Layer_Name",
            "type": "Feature Layer",
            "geometryType": "esriGeometryPoint",
            "extent": {
                "type": "extent",
                "xmin": -17.70518418985952,
                "ymin": 29.007108442849102,
                "xmax": 3.871964247634747,
                "ymax": 42.65733404196801,
                "spatialReference": {
                    "wkid": 4326
                }
            },
            "drawingInfo": {
                "renderer": {
                    "type": "simple",
                    "symbol": {
                        "type": "esriPMS",
                        "url": "blue_small_dot.png",
                        "contentType": "image/png",
                        "width": 9.75,
                        "height": 9.75,
                        "xoffset": 0,
                        "yoffset": 0,
                        "angle": 0,
                        "imageData": "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAA9UlEQVQYV42QQU7DMBBFx3aCnRSJBomuuvAGwZLehNyA3qBX6Ak4Qk9QpTcp+2686AoqGiSa2MQeozhNJSoWnYWtsb7/n3kEjiWL/VCgewbwsnsiSlO2UnlWhq497ov3pxhYcZtyOeBRkB2Mhc/KqAZcvslHb6R1SgHX4+FA8oj1AeE21sG2PKgK6IQ8LncvN8nVIkv5H1Hf7CsDX/XPlDwsP17vrpPZuVsvbF133/U8CLOEz+KI/uvYWISyNvMQLWK2EGfz9b+0daAbNw3LCO/WImKSkgDhVOg9aOuUJmxywsOQFpQSSTtigOAB0StHscNzKfBfZkltaaUCjW0AAAAASUVORK5CYII="
                    },
                    "label": "",
                    "description": ""
                },
                "transparency": 0,
                "labelingInfo": null
            },
            "objectIdField": "OBJECTID",
            "fields": [
                {
                    "name": "OBJECTID",
                    "type": "esriFieldTypeOID",
                    "alias": "OBJECTID",
                    "sqlType": "sqlTypeOther",
                    "nullable": false,
                    "editable": false,
                    "domain": null,
                    "defaultValue": null
                },
                {
                    "name": "Speed",
                    "type": "esriFieldTypeDouble",
                    "alias": "Speed",
                    "sqlType": "sqlTypeNVarchar",
                    "nullable": true,
                    "editable": true,
                    "domain": null,
                    "defaultValue": null,
                    "length": 256
                },
                {
                    "name": "Date",
                    "type": "esriFieldTypeDate",
                    "alias": "Date of the fine",
                    "sqlType": "sqlTypeNVarchar",
                    "nullable": true,
                    "editable": true,
                    "domain": null,
                    "defaultValue": null,
                    "length": 256
                },
                {
                    "name": "License",
                    "type": "esriFieldTypeString",
                    "alias": "License number",
                    "sqlType": "sqlTypeNVarchar",
                    "nullable": true,
                    "editable": true,
                    "domain": null,
                    "defaultValue": null,
                    "length": 256
                }
            ],
            "templates": [
                {
                    "name": "New Feature",
                    "description": "",
                    "drawingTool": "esriFeatureEditToolPoint",
                    "prototype": {
                        "attributes": {
                            "Speed": null,
                            "Date": null,
                            "License": null
                        }
                    }
                }
            ],
            "supportedQueryFormats": "JSON",
            "hasStaticData": false,
            "maxRecordCount": 10000,
            "capabilities": "Query,Editing,Create,Update,Delete"
        };

        if(options.layerName){
            defaultLayer.name = options.layerName;
        }

        if(options.fields){
            defaultLayer.fields = options.fields;

            attributes = {};
            for (key in options.fields) {
                if (options.fields.hasOwnProperty(key)) {
                    attributes[options.fields[key].name] = null;
                }
            }
            defaultLayer.templates.prototype = attributes
        }

        return defaultLayer;
    };

    /************************************************************
     *
     *   This function returns the SQLType for a given EsriType
     *
     ************************************************************/
    this.esriTypeToSqlType = function(esriType){
        // Perhaps some matches are missing: http://arcg.is/1H1wsUk
        switch (esriType){
            case "esriFieldTypeString": return "sqlTypeNVarchar";
            case "esriFieldTypeDouble": return "sqlTypeDecimal";
            case "esriFieldTypeInteger": return "sqlTypeInteger";
            default: return "sqlTypeOther";
        }

    };

    /************************************************************
     *
     *   This function returns a JSON object with a layer definition field
     *
     ************************************************************/
    this.createField = function(o){
        var f = {
            "name": "name",
            "type": "esriFieldTypeString",
            "alias": "name",
            "sqlType": that.esriTypeToSqlType('esriFieldTypeString'),
            "nullable": true,
            "editable": true,
            "domain": null,
            "defaultValue": null
        };

        if(f.type === "esriFieldTypeString"){
            f.length = 255
        }

        if(o.name){ f.name = o.name; f.alias = o.name;}
        if(o.type){ f.type = o.type; f.sqlType = that.esriTypeToSqlType(o.type)}
        if(o.alias){f.alias = o.alias;}
        if(o.nullable){f.nullable= o.nullable;}
        if(o.editable){f.editable= o.editable;}
        if(o.domain){f.domain= o.domain;}
        if(o.defaultValue){f.defaultValue= o.defaultValue;}
        if(o.length){f.length = o.length;}
        if(o.domain){f.domain = o.domain;}

        return f;

    };

    /************************************************************
     *
     *   This methods adds some features to a given layer in a
     *   feature service.
     *
     ************************************************************/
    this.addFeatures = function (options) {

        var req, deferred, path, requestOptions, postData;

        deferred = defer();

        postData = querystring.stringify({
            f: 'json',
            features: JSON.stringify(options.features),
            token: that.token
        });

        path = "/" + that.account_id + "/arcgis/rest/services/"+ options.serviceName + "/FeatureServer/" + options.layer+"/addFeatures?token=" + that.token;

        requestOptions = {
            host: that.services_url,
            path: encodeURI(path),
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                'Content-Length': postData.length
            }
        };

        req = http.request(requestOptions, function (response) {
            response.setEncoding('utf8');

            response.on('data', function (chunk) {
                chunk = JSON.parse(chunk);
                if(typeof chunk === "string"){

                }

                if (chunk.error && chunk.error.code == 498) {
                    //console.log("Error: invalid token");
                    that.getToken().then(function(){
                        that.addFeatures(options);
                    });
                } else {
                    deferred.resolve(chunk);
                }
            });
        });

        req.on('error', function (e) {
            console.log('Problem with request: ', e.message);
            deferred.reject(e);
        });

        req.write(postData);

        req.end();

        return deferred;
    };
}
