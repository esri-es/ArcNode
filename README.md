# ArcNode
Node module to work with ArcGIS Online and ArcGIS Server.

## How to install it

Just write this in your prompt:
```npm install --save arc-node```

And you are ready to go, just instantiate the object like this:
```javascript
var ArcNode = require('arc-node'),
    service = new ArcNode(<config object>);
```
Check here the description of the *[\<config object\>](/examples/config.json.sample)* parameter.

## Documentation
When you have instantiate the service you will have available methods to:
* [Get a new token](#get-a-new-token)
* [Check if a feature service exists](#check-if-a-feature-service-exists)
* [Create an empty feature service](#create-an-empty-feature-service)
* [Add layers to a feature service](#add-layers-to-a-feature-service)
* [Add features to a layer](#add-features-to-a-layer)
* [Find address candidates](#find-address-candidates)
* [Export a webmap](#export-a-webmap)

### Get a new token
**Description**: Gets a new valid token.<br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: it returns the [ArcGIS REST API response](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Generate_Token/02r3000000m5000000/#GUID-D63FBD54-1269-4A92-8AAB-BDE5B0393F28).<br> 
**Example**: [See full example](/examples/getToken.js)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>getToken(options)</td>
</tr>
<tr>
  <td><strong>Options</strong><br>(JSON object)</td>
  <td>
  <table>
    <tr>
      <td><strong>Name</strong></td>
      <td><strong>Type</strong></td>
      <td><strong>Required?</strong></td>
      <td><strong>Description</strong></td>
    </tr>
    <tr>
      <td>client</td>
      <td>String</td>
      <td>No</td>
      <td>The client type that will be granted access to the token. Only the referer value is supported.  In the Generate Token page, the referer is specified in the Webapp URL field, for example: referer=http://myserver/mywebapp</td>
    </tr>
    <tr>
      <td>referer</td>
      <td>String</td>
      <td>No</td>
      <td>Default value: arcgis.com | The base URL of the client application that will use the token to access the Portal for ArcGIS API. In the Generate Token page, the referer is specified in the Webapp URL field, for example: referer=http://myserver/mywebapp.</td>
    </tr>
    <tr>
      <td>expiration</td>
      <td>Integer</td>
      <td>No</td>
      <td>The token expiration time in minutes. The default and maximum is 15 days.</td>
    </tr>
    </table>
    </td>
</tr>
</table>

**How to use it**
```javascript
//Get a token valid for 60 minutes
service.getToken({
    expiration: 60
}).then(function(response){
    console.log("response: ", response);
});
```
----------------
### Check if a feature service exists
**Description**: Check if a feature service with a given name exists.<br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: it returns the [ArcGIS REST API response](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r300000076000000#GUID-916B5F3A-FCF7-49BE-BC01-5C8DB161F2EC).<br> 
**Example**: [See full example](/examples/checkIfFSExists.js)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>checkIfFSExists(options?)</td>
</tr>
<tr>
  <td><strong>Options</strong><br>(JSON object)</td>
  <td>
    <table>
    <tr>
      <td><strong>Name</strong></td>
      <td><strong>Type</strong></td>
      <td><strong>Required?</strong></td>
      <td><strong>Description</strong></td>
    </tr>
    <tr>
      <td>serviceName</td>
      <td>String</td>
      <td>Yes</td>
      <td>Name of the service</td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
service.checkIfFSExists( { serviceName: "Service name" } ).then(function(response){
  console.log("response = ", response);
}, function(e){
  console.log("Error: ", e);
});
```
----------------
### Create an empty feature service
**Description**:  it creates a feature service with no layers in it<br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: it returns the [ArcGIS REST API response](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r30000027r000000#GUID-0BC44A32-475E-4F30-A8DE-2812FA88A070).<br> 
**Example**: [See full example](/examples/createFeatureService.js)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>createFeatureService(options?)</td>
</tr>
<tr>
  <td><strong>Options</strong><br>(JSON object)</td>
  <td>
    <table>
    <tr>
      <td><strong>Name</strong></td>
      <td><strong>Type</strong></td>
      <td><strong>Required?</strong></td>
      <td><strong>Description</strong></td>
    </tr>
    <tr>
      <td>name</td>
      <td>String</td>
      <td>Yes</td>
      <td>Name of the service</td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
service.createFeatureService({name: "My empty feature service"}).then(function(response){
  console.log("response = ", response);
}, function(e){
  console.log("Error: ", e);
});
```
----------------
### Add layers to a feature service
**Description**:  it add layers to a service based on the definition of each layer.<br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: it returns the [ArcGIS API REST response](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/AddToDefinitionFeatureService/02r300000230000000/#GUID-2C31B4E2-8112-4872-88F8-71BC3B74B6DD).<br> 
**Example**: [See full example](/examples/addLayerToFS.js)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>addLayersToFS(options?)</td>
</tr>
<tr>
  <td><strong>Options</strong><br>(JSON object)</td>
  <td>
    <table>
    <tr>
      <td><strong>Name</strong></td>
      <td><strong>Type</strong></td>
      <td><strong>Required?</strong></td>
      <td><strong>Description</strong></td>
    </tr>
    <tr>
      <td>service</td>
      <td>String</td>
      <td>Yes</td>
      <td>URL of the service where the layers is going to be added</td>
    </tr>
    <tr>
      <td>layers</td>
      <td>Array of JSON Objects</td>
      <td>Yes</td>
      <td>Array of objects describing the layers (<a href="http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r300000230000000#GUID-63F2BD08-DCF4-485D-A3E6-C7116E17DDD8">see an example</a>). It can be generated using the <a href="#create-a-json-object-describing-a-layer">createLayer() method</a></td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
service.addLayersToFS({
  service: response.encodedServiceURL,
  layers: [layer]
}).then(function(response){
  console.log("response: ", response);
}, function(e){
  console.log("Error: ", e);
});
```
----------------

### Add features to a layer
**Description**:  add features to a feature layer<br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: it return de [ArcGIS API REST response](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Add_Features/02r30000010m000000/#GUID-6EDF1F16-5716-4B4D-9975-47FEA30AA359).<br> 
**Example**: [See full example](/examples/addFeatures.js)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>addFeatures(options?)</td>
</tr>
<tr>
  <td><strong>Options</strong><br>(JSON object)</td>
  <td>
    <table>
    <tr>
      <td><strong>Name</strong></td>
      <td><strong>Type</strong></td>
      <td><strong>Required?</strong></td>
      <td><strong>Description</strong></td>
    </tr>
    <tr>
      <td>serviceName</td>
      <td>String</td>
      <td>Yes</td>
      <td>Service name where the layer is hosted</td>
    </tr>
    <tr>
      <td>layer</td>
      <td>Integer</td>
      <td>Yes</td>
      <td>Layer index where the features want to be added</td>
    </tr>
    <tr>
      <td>features</td>
      <td>Array of features</td>
      <td>Yes</td>
      <td>Array of <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r3000000n8000000">features objects</a></td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
var data = [{
    "attributes":{
        "name": "Feature name"
    },
    "geometry": {
        "x": -3,
        "y": 40,
        "spatialReference": {"wkid" : 4326}
    }
  }
  // Add as many features as you want
];

service.addFeatures({
    serviceName: "Your service name",
    layer: 0, //<layer index, Ex: 0, 1, 2, ...>
    features: data
}).then(function(response){
    console.log("response = ", response);
},function(e){
    console.log("Error: ", e);
});
```
----------------

### Find address candidates
**Description**:  find xy locations for an address<br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: it return de [ArcGIS API REST response](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/WorldGeocodingService/02r30000027s000000/).<br> 
**Example**: [See full example](/examples/findAddressCandidates.js)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>findAddressCandidates(options?)</td>
</tr>
<tr>
  <td><strong>Options</strong><br>(JSON object)</td>
  <td>
    <table>
    <tr>
      <td><strong>Name</strong></td>
      <td><strong>Type</strong></td>
      <td><strong>Required?</strong></td>
      <td><strong>Description</strong></td>
    </tr>
    <tr>
      <td>address</td>
      <td>String</td>
      <td>Yes</td>
      <td>The address</td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
service.findAddressCandidates({
    address: "Emilio muñoz 35, madrid"
}).then(function(response){
    console.log("response: ", JSON.stringify(response, null, "\t"));
});
```
----------------

### Export a webmap
**Description**:  generate a static image from a webmap object
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: it return de [ArcGIS API REST response](https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task).<br> 
**Example**: [See full example](/examples/ExportWebMapTask.js)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>ExportWebMapTask(options?)</td>
</tr>
<tr>
  <td><strong>Options</strong><br>(JSON object)</td>
  <td>
    <table>
    <tr>
      <td><strong>Name</strong></td>
      <td><strong>Type</strong></td>
      <td><strong>Required?</strong></td>
      <td><strong>Description</strong></td>
    </tr>
    <tr>
      <td>webmap</td>
      <td>JSON Object</td>
      <td>Yes</td>
      <td>A <a href="http://resources.arcgis.com/en/help/arcgis-web-map-json/index.html#/Web_map_data/02qt0000000q000000/">webmap object</a></td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
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
```
