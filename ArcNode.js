/**
 * Created by Raul.Jimenez on 17/07/2015.
 */
'use strict';

var defer = require("node-promise").defer;
var querystring = require('querystring');
var ArcJSON = require('arcgis-json-objects');
var https = require('https');
var http = require('http');
var StringDecoder = require('string_decoder').StringDecoder;

module.exports = function ArcNode(options) {
    options = options || {};
    this.username =     options.username || "";
    this.password =     options.password || "";
    this.account_id =   options.account_id || "";
    this.root_url =     options.root_url || "";
    this.services_url = options.services_url || "";
    this.port =         options.port || 443;
    this.arcgisPath =   options.arcgisPath || "";
    this.portalPath =   options.portalPath || "";
    this.allowSelfSigned = options.allowSelfSigned || false;
    
    this.print_service = options.print_service || "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
    this.find_address_candidates_service = options.find_address_candidates_service || "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";
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

        if(that.allowSelfSigned){
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        }
        
        var req = {
            hostname: that.root_url,
            port: that.port,
            path: "/" + that.arcgisPath + "/sharing/rest/generateToken",
            method: 'POST',
            body: postData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': postData.length
            }
        };
        //console.log('req = ', req);
        var req = https.request(req, function(response) {
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
     *   This function gets user info, if admin token is passed
     *   it will return private user info as email, groups, etc
     *
     ************************************************************/
    this.getUserInfo = function(options){
        var deferred = defer(),
            req, obj="", decoder, textChunk;

        options = options || {};
        options.token = options.token || that.token;
        options.username = options.username || that.username;

        var url = "https://" + that.root_url+"/"+that.portalPath+"/sharing/rest/community/users/" + options.username + "?f=json&token=" + that.token;
        //console.log('url = ', url);
        req = https.get(url, function(res) {
            res.on("data", function(chunk) {
                
                res.setEncoding('utf8');    

                decoder = new StringDecoder('utf8');
                textChunk = decoder.write(chunk);

                obj += textChunk;

                if(chunk.error && chunk.error.code == 498){
                    that.getToken().then(function(response){
                        that.getUserInfo(options).then(function(user){
                            deferred.resolve(user);
                        });
                    }, function(e) {
                        deferred.reject(e.message);
                    });
                }
            });
            res.on("end", function(chunk) {
              obj = JSON.parse(obj);
              deferred.resolve(obj);
            });
        }).on('error', function(e) {
            deferred.reject(e.message);
        });
        req.end();
        return deferred;
    };

    /************************************************************
     *
     *   This function checks if s feature service exists
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
        var fs = ArcJSON.featureService(options);

        var postData = querystring.stringify({
            createParameters: JSON.stringify(fs),
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
            path: encodeURI(path),
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
     *   This methods gets some features to a given layer in a
     *   feature service.
     *
     ************************************************************/
    this.getFeatures = function (options) {

        var req, deferred, path, requestOptions, postData, decoder, textChunk, obj, query;

        deferred = defer();

        query = options.query;

        if(!query.hasOwnProperty('token')){
          query.token = that.token;
        }

        query = Object.keys(query).map(function(k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(query[k])
        }).join('&');

        if(options.serviceName && options.layer){
            path = 'https://'+that.services_url+'/' + that.account_id + '/arcgis/rest/services/'+ options.serviceName + '/FeatureServer/' + options.layer;    
        }else if(options.serviceUrl){
            path = options.serviceUrl;
        }
        path += '/query?' + query;
        
        obj = '';
        //console.log('path=',path);
        req = https.get(path, function (res) {
            res.on('data', function (chunk) {
                res.setEncoding('utf8');    

                decoder = new StringDecoder('utf8');
                textChunk = decoder.write(chunk);

                obj += textChunk;
                //console.log("Recibida trama, textChunk=",textChunk);

                if (chunk.error && chunk.error.code == 498) {
                    //console.log("Error: invalid token");
                    that.getToken().then(function(){
                        that.getFeatures(options);
                    });
                }
            });
            res.on('end', function (chunk) {
              //console.log("terminado, chunk=",chunk);
              obj = JSON.parse(obj);
              deferred.resolve(obj);
            });
        }).on('error', function (e) {
            console.log('Problem with request: ', e.message);
            deferred.reject(e);
        });

        req.end();

        return deferred.promise;
        
    },

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

        if(options.serviceName && options.layer){
            path = "/" + that.account_id + "/arcgis/rest/services/"+ options.serviceName + "/FeatureServer/" + options.layer;
        }else if(options.serviceUrl){
            path = options.serviceUrl;
        }
        path += "/addFeatures?token=" + that.token;

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
    },

    /************************************************************
     *
     *   This methods update some features to a given layer in a
     *   feature service.
     *
     ************************************************************/
    this.updateFeatures = function (options) {

        var req, deferred, path, requestOptions, postData;

        deferred = defer();

        postData = querystring.stringify({
            f: 'json',
            features: JSON.stringify(options.features),
            token: that.token
        });

        if(options.serviceName && options.layer){
            path = "/" + that.account_id + "/arcgis/rest/services/"+ options.serviceName + "/FeatureServer/" + options.layer;    
        }else if(options.serviceUrl){
            //path = options.serviceUrl;
            path = options.serviceUrl.split("/");
            path = path.splice(3);
            path = '/' + path.join("/");
        }
        path += "/updateFeatures?token=" + that.token;

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
        
        //console.log('requestOptions = ',requestOptions);

        req = http.request(requestOptions, function (response) {
            response.setEncoding('utf8');

            response.on('data', function (chunk) {
                chunk = JSON.parse(chunk);
                if(typeof chunk === "string"){

                }

                if (chunk.error && chunk.error.code == 498) {
                    //console.log("Error: invalid token");
                    that.getToken().then(function(){
                        that.updateFeatures(options);
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
    },

    /************************************************************
     *
     *   This methods returns candidates for an address using
     *   find_address_candidates_service
     *
     ************************************************************/
    this.findAddressCandidates = function (options) {
        var xy, deferred, path, query;

        if(options.x && options.y) {
            xy = [options.x, options.y];
            return {
                then: function(callback){
                    callback(xy);
                }
            };

        }else if(options.address){
            deferred = defer();
            query = {
                SingleLine: options.address,
                f: "json",
                outSR: '{"wkid":102100}',
                outFields: "Match_addr",
                Addr_type: "StAddr,City",
                maxLocations:1
            };

            query = Object.keys(query).map(function(k) {
                return encodeURIComponent(k) + '=' + encodeURIComponent(query[k])
            }).join('&');

            path = this.find_address_candidates_service + "?" + query;
            https.get(path, function(response) {

                response.setEncoding('utf8');
                response.on('data', function (chunk) {
                    chunk = JSON.parse(chunk);
                    deferred.resolve(chunk);
                });

            }).on('error', function(e) {
                console.log("Got error: " + e.message);
                deferred.reject(e);
            });

            return deferred.promise;

        }else{
            return {error: "You should specify a longitude & latitude or an address"};
        }
    },

    /************************************************************
     *
     *   This methods execute print_service, by default the
     *   Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task
     *
     ************************************************************/
    this.ExportWebMapTask = function (options) {
        var postData, deferred, requestOptions, req;

        deferred = defer();

        postData = querystring.stringify({
            f: options.f || "json",
            format: options.format || "PNG32",
            Layout_Template: options.layoutTemplate || "MAP_ONLY",
            Web_Map_as_JSON: JSON.stringify(options.webmap)
        });

        requestOptions = {
            host: this.getLocation(this.print_service).host,
            path: this.getLocation(this.print_service).pathname + '/execute',
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
                deferred.resolve(chunk);

            });
        });

        req.on('error', function (e) {
            console.log('Problem with request: ', e.message);
            deferred.reject(e);
        });

        req.write(postData);

        req.end();

        return deferred;
    },

    /************************************************************
     *
     *   This methods returns a JSON object with the different
     *   parts of the URL (host, pathname, etc.)
     *
     ************************************************************/
    this.getLocation = function(url){

        var match = url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
        return match && {
            protocol: match[1],
            host: match[2],
            hostname: match[3],
            port: match[4],
            pathname: match[5],
            search: match[6],
            hash: match[7]
        }
    }


};
