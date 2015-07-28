# ArcNode
Node module to work with ArcGIS Online and ArcGIS Server.

Available methods to:
* Update token
* Check if a feature service exists
* Create an empty feature service
* Add a layer to a feature service**addLayerToFS**
* Create a JSON object describing a layer
* Determine the SQL type for an EsriType
* Add features to a layer

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
  <td><strong>Parameters</strong></td>
  <td>
    JSON object.
    <table>
    <tr>
      <td>Name</td><td>Type</td><td>Description</td>
    </tr>
    <tr>
      <td><strong>serviceName</strong></td>
      <td>String</td>
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
----------------
### Add a layer to a feature service**addLayerToFS**
----------------
### Create a JSON object describing a layer
----------------
### Determine the SQL type for an EsriType
----------------
### Add features to a layer
----------------
