# ArcNode
Node module to work with ArcGIS Online and ArcGIS Server.

## How to install it

Just write this in your prompt:
```npm install --save arc-node```

And you are ready to use it like this:
```javascript
var ArcNode = require('arc-node'),
    service = new ArcNode(<config object>);
```
Check here the description of the *[\<config object\>](/examples/config.json.sample)* parameter.

## Documentation
When you have instanciate the service you will have available methods to:
* [Update token](#update-token)
* [Check if a feature service exists](#check-if-a-feature-service-exists)
* [Create an empty feature service](#create-an-empty-feature-service)
* [Add a layer to a feature service](#add-a-layer-to-a-feature-service)
* [Create a JSON object describing a layer](#create-a-json-object-describing-a-layer)
* [Determine the SQL type for an EsriType](#determine-the-sql-type-for-an-esritype)
* [Add features to a layer](#add-features-to-a-layer)

### Update token
**Description**: Gets a new token valid for 15 days <br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: an string with the new token, but the service will be also updated.<br> 
**Example**: [See full example](https://github.com/esri-es/ArcNode/tree/master/examples)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>updateToken()</td>
</tr>
<tr>
  <td><strong>Parameters</strong></td>
  <td><i>None</i></td>
</tr>
</table>

**How to use it**
```javascript
service.updateToken().then(function(token){
  console.log("token = ", token);
}, function(e){
  console.log("Error: ", e);
});
```
----------------
### Check if a feature service exists
**Description**: Check if a feature service with that name exists <br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: a boolean showing if the service is available.<br> 
**Example**: [See full example](https://github.com/esri-es/ArcNode/tree/master/examples)

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
service.checkIfFSExists( { serviceName: "Service name" } ).then(function(available){
  console.log("available = ", available);
}, function(e){
  console.log("Error: ", e);
});
```
----------------
### Create an empty feature service
**Description**:  it creates a feature service with no layers in it<br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: it returns the [ArcGIS REST API response](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r30000027r000000#GUID-0BC44A32-475E-4F30-A8DE-2812FA88A070).<br> 
**Example**: [See full example](https://github.com/esri-es/ArcNode/tree/master/examples)

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
service.createFeatureService({serviceName: serviceName}).then(function(response){
  console.log("response = ", response);
}, function(e){
  console.log("Error: ", e);
});
```
----------------
### Add a layer to a feature service
**Description**:  it add a layer to a service based on the definition of the layer.<br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: it returns the [ArcGIS API REST response](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/AddToDefinitionFeatureService/02r300000230000000/#GUID-2C31B4E2-8112-4872-88F8-71BC3B74B6DD).<br> 
**Example**: [See full example](https://github.com/esri-es/ArcNode/tree/master/examples)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>addLayerToFS(options?)</td>
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
      <td>layer</td>
      <td>JSON Object</td>
      <td>Yes</td>
      <td>Object describing the layer object (<a href="http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r300000230000000#GUID-63F2BD08-DCF4-485D-A3E6-C7116E17DDD8">see an example</a>). It can be generated using the <a href="#create-a-json-object-describing-a-layer">createLayer() method</a></td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
service.addLayerToFS({
  service: response.encodedServiceURL,
  layer: layer
}).then(function(response){
  console.log("response: ", response);
}, function(e){
  console.log("Error: ", e);
});
```
----------------
### Create a JSON object describing a layer
**Description**:  this method returns a JSON object with a quite simple layer definition<br>
**Return**: a <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r300000230000000#GUID-63F2BD08-DCF4-485D-A3E6-C7116E17DDD8">JSON defining a layer</a>.<br> 
**Example**: [See full example](https://github.com/esri-es/ArcNode/tree/master/examples)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>createLayer(options?)</td>
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
      <td>layerName</td>
      <td>String</td>
      <td>No</td>
      <td>Name that we want to assign to the layer</td>
    </tr>
    <tr>
      <td>fields</td>
      <td>Array of objects</td>
      <td>No</td>
      <td>Array defining all fields available (<a href="http://resources.arcgis.com/en/help/sds/rest/index.html?featureServiceObject.html">check on this sample</a>)</td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
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
    layerName: "My new layer",
    fields: fields
});
console.log("layer = ", layer);
```
----------------
### Determine the SQL type for an EsriType
**Description**: translate an EsriType (esriFieldTypeString, esriFieldTypeDouble and esriFieldTypeInteger) to SQL Types, needed to created new fields when defining a new layer<br>
**Return**: a string width the sqlType.<br> 
**Example**: [See full example](https://github.com/esri-es/ArcNode/tree/master/examples)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>esriToSqlType(esriType)</td>
</tr>
<tr>
  <td><strong>Parameters</strong><br></td>
  <td>
    <table>
    <tr>
      <td><strong>Name</strong></td>
      <td><strong>Type</strong></td>
      <td><strong>Required?</strong></td>
      <td><strong>Description</strong></td>
    </tr>
    <tr>
      <td>esriType</td>
      <td>String</td>
      <td>Yes</td>
      <td>It returns: sqlTypeVarchar, sqlTypeDecimal, sqlTypeInteger or sqlTypeOther depending of the esriType</td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
var sqlType = service.esriToSqlType('esriFieldTypeString');
console.log("sqlType = ", sqlType);
```
----------------
### Add features to a layer
**Description**:  add features to a new layer<br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: it return de [ArcGIS API REST response](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Add_Features/02r30000010m000000/#GUID-6EDF1F16-5716-4B4D-9975-47FEA30AA359).<br> 
**Example**: [See full example](https://github.com/esri-es/ArcNode/tree/master/examples)

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
        id: 1,
        "Name": "Feature name"
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
    layer: "0",
    features: data
}).then(function(response){
    console.log("response = ", response);
},function(e){
    console.log("Error: ", e);
});
```
