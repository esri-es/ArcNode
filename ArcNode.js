/**
 * Created by Raul.Jimenez on 17/07/2015.
 */

var defer = require("node-promise").defer;
var querystring = require('querystring');
var https = require('https');
var http = require('http');
var StringDecoder = require('string_decoder').StringDecoder;

module.exports = function ArcNode(options) {
    this.username =     options.username;
    this.password =     options.password;
    this.account_id =   options.account_id;
    this.root_url =     options.root_url;
    this.services_url = options.services_url;
    that = this;


    /************************************************************
     *
     *   This function renews the instance token for 15 days
     *
     ************************************************************/
    this.getToken = function(){
        var deferred = defer();
        var postData = querystring.stringify({
            f: 'json',
            username: that.username,
            password: that.password,
            client: 'referer',
            ip: '46.24.6.63',
            referer: 'arcgis.com',
            expiration: 21600
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
        var url = "https://"+that.root_url+"/sharing/rest/portals/"+that.account_id+"/isServiceNameAvailable?name="+options.serviceName+"&f=json&type=Feature Service&token="+this.token;

        req = https.get(url, function(res) {
            res.on("data", function(chunk) {
                chunk = JSON.parse(chunk);
                if(chunk.error && chunk.error.code == 498){
                    that.getToken().then(function(token){
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
        req = req.end();
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
        var attributes, defaultLayer = {
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
                        "url": "gray_large_blank.png",
                        "contentType": "image/png",
                        "width": 29.25,
                        "height": 37.5,
                        "xoffset": 0,
                        "yoffset": 11.75,
                        "angle": 0,
                        "imageData": "iVBORw0KGgoAAAANSUhEUgAAACEAAAAvCAYAAABt7qMfAAAEEElEQVRYR8VY21HjWBDt1svYBkpQBODJYMjAZMBmMP6x8NfORsAQwc5+GenHk8GQAWQAGUAAFHbxsLEe924draSSbdm6NjKrL5cl3Xt0+nT36cu0xtXv91uapv3JzF+llO35V5n5Rkp5J4T4p9frPaguzSoP9vv9tq7r59hY13Xa2dkhy7JI07TsdSEE+b5P7+/vFEURAVAURRe9Xu+mbI+VIAaDge37/jkRfceme3t78eZlF4C8vb3FoIjop2VZF51OZ7TsvaUgPM8D5QNN077u7u5So9Eo23vh/ng8ptfXVxJC3DFzp9vt3hUtUggiAXBtmqZt2zYhBJteCM1oNKIgCEbMfFIEZAFECsAwDPvw8BCx3XT/7D0pJT09PVEYhoVAZnZINHBrGEbr4OBgRngfRQLhDodDAHmwLOs4r5EZEJ7nXRNR++joqBIG5oGDkcfHR/x90+12T9L7GQjXdb8T0d/QgEoGbMoMMgYaIaK/HMf5iR8xiCQM9/V63UYmbPtCxkwmk5FlWV8QlhiE67o/mPm8KiGWfUQqVCnlheM4PzhlodFo2JvUgrINl91HDRmPxzEb7HneN0QE2VBFOqqCAhvIFiLqsOu6v2u12ulnaGEeILQxnU6vAGLYbDbtWq2m+hGVPTedTtFjRgAh0ZhM06xscdWFgiCgl5cXykAYhqH6bmXPhWGYgRgiM/6vcCBDYmGapnnabDYr+0LVheA5giC4ilMUvmF/f//TU/T5+Rl7dtKKOUTJ3mbPmGcHPQSl23GcgxjE5eXlwDCMb58ZEoQiDMNfZ2dn/zGRGJlblO3PyBJkBco2Mx/DaWWtHF7CMIw2nPS2LxjhMAwzT5EHEQsUIclb+aoBwWEhFInx/ZX5iXQj13XvTdNsbbNmoFQHQfDgOM6XBWeVaCNjo2oG0vXmWVhgIjE495ZltbbRS9ArfN+fYWEZiNhl1ev1ysmYTCaUuqn84gtDReq0MPhUyQZYwACU+sqVIJKQxGxAoFW4LbgoCLKIhcJw4M/8EFQFGyjRURQtDD2F2ZGnKG1sH2UjZSFfF+bFtnLQRN3Qdb31kVKOEg0W8nVhLRApG+ium2gDLCAUq1hYqom5sFwzc3sTNsCClHJm7izK+9K5H0dFmqbhrGItNsAC0lIIcVJ2ZFQKIknZ38x8ug4bCQtXjuP8UVb1lEAkp3a3mqbZKqc2OJ0RQoyEEMcqp3hKINICRkTnKmyABSKKh90yFpSEmS6SFjBmbq1iAyxIKZcWpo2EmX8pFSlMT1HKQowwLSpiLO0dqyjEnEJEp0XuCwCISEmMHwKRdllmtvNsgAUpZWGXLNOFsjCLwjIPYt0wlDawMvQ4YkK25J5Tzoa1ekcZEAxNzAxfGg8xZc8vu/8v7ylSk0iCl+sAAAAASUVORK5CYII="
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

        if(o.name){ f.name = o.name; f.alias = o.name;};
        if(o.type){ f.type = o.type; f.sqlType = that.esriTypeToSqlType(o.type)};
        if(o.alias){f.alias = o.alias;}
        if(o.nullable){f.nullable= o.nullable;}
        if(o.editable){f.editable= o.editable;}
        if(o.domain){f.domain= o.domain;}
        if(o.defaultValue){f.defaultValue= o.defaultValue;}
        if(o.length){f.length = o.length;}

        return f;

    };

    /************************************************************
     *
     *   This methods adds some features to a given layer in a
     *   feature service.
     *
     ************************************************************/
    this.addFeatures = function (options) {

        var req, deferred, path, requestOptions;

        deferred = defer();

        postData = querystring.stringify({
            f: 'json',
            features: JSON.stringify(options.features),
            token: that.token
        });

        path = "/" + that.account_id + "/arcgis/rest/services/"+ options.serviceName + "/FeatureServer/" + options.layer+"/addFeatures?token=" + that.token;

        requestOptions = {
            host: "127.0.0.1",
            port: "8888",
            path: "http://"+that.services_url+encodeURI(path),
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
