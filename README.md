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
* [Determine the SQLType for an EsriType](#determine-the-sqltype-for-an-esritype)
* [Create a JSON object describing a field in a layer](#create-a-json-object-describing-a-field-in-a-layer)
* [Create a JSON object describing a layer](#create-a-json-object-describing-a-layer)
* [Add layers to a feature service](#add-layers-to-a-feature-service)
* [Add features to a layer](#add-features-to-a-layer)

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
      <td>The client type that will be granted access to the token. Only the referer value is supported. In the Generate Token page, select the Webapp URL option to specify the referer.</td>
    </tr>
    <tr>
      <td>referer</td>
      <td>String</td>
      <td>No</td>
      <td>The base URL of the client application that will use the token to access the Portal for ArcGIS API. In the Generate Token page, the referer is specified in the Webapp URL field, for example: referer=http://myserver/mywebapp.</td>
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
service.getToken().then(function(response){
  console.log("response = ", response);
}, function(e){
  console.log("Error: ", e);
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
### Determine the SQLType for an EsriType
**Description**: translate an EsriType (esriFieldTypeString, esriFieldTypeDouble and esriFieldTypeInteger) to SQL Types, needed to created new fields when defining a new layer<br>
**Return**: a string width the sqlType.<br> 
**Example**: [See full example](/examples/esriTypeToSqlType.js)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>esriTypeToSqlType(esriType)</td>
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
var sqlType = service.esriTypeToSqlType('esriFieldTypeString');
console.log("sqlType = ", sqlType);
```
----------------
### Create a JSON object describing a field in a layer
**Description**:  this method returns a JSON object with a field definition<br>
**Return**: a <a href="https://services.arcgis.com/help/layerAddToDefinition.html#Example1">JSON defining a field in a layer</a>.<br> 
**Example**: [See full example](/examples/createField.js)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>createField(options?)</td>
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
      <td>No</td>
      <td>Name that we want to assign to the field</td>
    </tr>
    <tr>
      <td>type</td>
      <td>String</td>
      <td>No</td>
      <td><a href="http://resources.esri.com/help/9.3/arcgisserver/adf/java/help/api/arcgiswebservices/com/esri/arcgisws/EsriFieldType.html">esriFieldType</a></td>
    </tr>
    <tr>
      <td>alias</td>
      <td>String</td>
      <td>No</td>
      <td>Visible alias of the field</td>
    </tr>
    <tr>
      <td>nullable</td>
      <td>Boolean</td>
      <td>No</td>
      <td>If the field can be null</td>
    </tr>
    <tr>
      <td>editable</td>
      <td>Boolean</td>
      <td>No</td>
      <td>If the field can be edited</td>
    </tr>
    <tr>
      <td>domain</td>
      <td>Object</td>
      <td>No</td>
      <td>An object defining the <a href="http://resources.arcgis.com/en/help/main/10.1/index.html#/A_quick_tour_of_attribute_domains/001s00000001000000/">domain</a> (<a href="/examples/createField.js">view example</a>)</td>
    </tr>
    <tr>
      <td>defaultValue</td>
      <td>String</td>
      <td>No</td>
      <td>Default value of the field</td>
    </tr>
    <tr>
      <td>length</td>
      <td>Interger</td>
      <td>No</td>
      <td>In case the type is "esriFieldTypeString" the length of the field</td>
    </tr>
    
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
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
```
----------------
### Create a JSON object describing a layer
**Description**:  this method returns a JSON object with a simple layer definition<br>
**Return**: a <a href="http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#//02r300000230000000#GUID-63F2BD08-DCF4-485D-A3E6-C7116E17DDD8">JSON defining a layer</a>.<br> 
**Example**: [See full example](/examples/createLayer.js)

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
    layer: "<layer index>",
    features: data
}).then(function(response){
    console.log("response = ", response);
},function(e){
    console.log("Error: ", e);
});
```
