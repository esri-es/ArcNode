# ArcNode
Node module to work with ArcGIS Online and ArcGIS Server.

Available methods to:
* [Update token](#update-token)
* [Check if a feature service exists](#check-if-a-feature-service-exists)
* [Create an empty feature service](#create-an-empty-feature-service)
* [Add a layer to a feature service](#add-a-layer-to-a-feature-service)
* [Create a JSON object describing a layer](#create-a-json-object-describing-a-layer)
* [Determine the SQL type for an EsriType](#determine-the-sql-type-for-an-esritype)
* [Add features to a layer](#add-features-to-a-layer)

## Documentation

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
**Description**:  <br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: .<br> 
**Example**: [See full example](https://github.com/esri-es/ArcNode/tree/master/examples)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>(options?)</td>
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
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
service
  
}, function(e){
  console.log("Error: ", e);
});
```
----------------
### Determine the SQL type for an EsriType
**Description**:  <br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: .<br> 
**Example**: [See full example](https://github.com/esri-es/ArcNode/tree/master/examples)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>(options?)</td>
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
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
service
  
}, function(e){
  console.log("Error: ", e);
});
```
----------------
### Add features to a layer
**Description**:  <br>
**Return**: a [deferred](http://dojotoolkit.org/reference-guide/1.10/dojo/Deferred.html) object. When it's resolved: .<br> 
**Example**: [See full example](https://github.com/esri-es/ArcNode/tree/master/examples)

<table>
<tr>
  <td><strong>Name</strong></td>
  <td>(options?)</td>
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
      <td></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    </table>
  </td>
</tr>
</table>

**How to use it**
```javascript
service
  
}, function(e){
  console.log("Error: ", e);
});
```
