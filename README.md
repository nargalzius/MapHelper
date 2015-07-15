# MapHelper "class" for GoogleMaps API v3

#### [Codepen Demo](http://codepen.io/nargalzius/pen/gpKXaB)


### Method Quick Reference

Method | Description
-------|------------
`init` | Initializes the map
`resize` | Resizes map
`fit` | Adjusts center & zoom to fit all markers
`zoom` | Sets zoom level
`center` | Pans/snaps map view to a coordinate
`locate_user_gps` | Uses browser geolocation service to locate user
`locate_find` | Resolves a long-form address to LatLng coordinates
`locate_resolve` | Resolves LatLng coordinates to a location object
`marker_add` | Adds a marker
`markers_show` | Show all markers
`markers_hide` | Hide all markers
`markers_clear` | Destroy all markers
`infowindow_show` | Displays an infoWindow 
`infowindow_hide` | hides the infoWindow
`set_maptype` | Sets map type
`get_staticmap` | Convenience function to generate a static map image
`get_distance` | Get distance (in miles) between two coordinates
`get_latlng` | Sanitize input to a proper LatLng object
`destroy` | Destroy map instance

### Parameter Quick Reference
The `params` object includes the most relevant properties anyone's likely to use. Most of them are from the [GoogleMaps API](https://developers.google.com/maps/documentation/javascript/reference#MapOptions) - but I've also included some other custom parameters for convenience.

Parameter | Default | Description
----------|---------|------------
debug | false | Debug mode (mostly for outputting useful stuff to the browser console.
center | null | Map center coordinates
zoom | 15 | Zoom level
id | 'map' | DOM element ID where the map will load
obtrusive | true | Allows automatic user location detection via browser geolocation service
draggable | true | Allows map to be dragged around
disableDoubleClickZoom | true | Allow/Disallow zooming on double-click
mapType | 'road' | Sets the map to either road, satellite, terrain, or hybrid
minZoom | 2 | Farthest view allowed
maxZoom | 15 | Closest view allowed
chromeless | true | Disables map controls
address | 'New York, USA' | Default long-form address

That last bit (`address`) is for an undocumented method that the map uses when you don't supply a center **and** do not allow it (`params.obtrusive = false`) to use your browser's geolocation service. It basically resolves the whatever is set to `address` to LatLng coordinates and uses that as your default center.

There are _much more_ parameters you can set. The `params` object accepts practically **any** official property from the [GoogleMaps API](https://developers.google.com/maps/documentation/javascript/reference#MapOptions). 


## Quick Start

Include the helper script on your document. You **do not** need to include the 

```html
<head>
	<script src="helper_gmaps.js"></script>
</head>
```
The script automatically loads the GoogleMaps API script, so there's no need to include that anywhere in your document.

There are a bunch of ways to initialize the map. I'll be documenting 4; from the quickest to the most thorough. 

First is just by instanciating and initializing it :) This _assumes_ you have a DOM container with an ID called "**map**"

```javascript
var myMap = new MapHelper();
	myMap.init();
```

The second way is to supply the `init` method with the ID of your target container element. This will also overwite `myMap.params.id`

```javascript
var myMap = new MapHelper();
	myMap.init('map-container');
```

These work, they'll both show a map with no problem. But it's worth mentioning that since the GoogleMaps API is being loaded asyncrhonously, the MapHelper class actually "delays" any initialization processes behind the scenes until everything's good to go. So if all you need to do is show a map, then this is fine, as it will show it as soon as it's ready to show it. 

But if you do something like:

```javascript
var myMap = new MapHelper();
	myMap.init('map-container');
    myMap.addMarker( {loc:'37.3303991,-122.0323321'} );
```

This may not work as you're assuming everything needed to load a marker is ready (API loaded, map element instantiated, etc) when it's not necessarily the case.

Using a callback as the second parameter avoids this issue - and is the third way. 

```javascript

var myMap = new MapHelper();
	myMap.init('map-container', function(){
    	// do stuff
    });
```

And last is the fairly comprehensive one, where you supply an object with parameters that will override (or add to) existing properties in `params` object.

```javascript
var newParameters = {
	id: 'other-container',
    mapType: 'hybrid',
    zoom: 10,
    address: 'Miami, FL, USA'
}

var myMap = new MapHelper();
	myMap.init(newParameters, function(){
    	// do stuff
    });
```

That's pretty much it! The only things left to know about are the actual methods for map manipulation.

## Methods

Just like with the parameters/properties, while this helper class provides adds some useful methods to work with your map, **all** official [GoogleMaps API methods](https://developers.google.com/maps/documentation/javascript/reference#methods) can be applied to the map - you just have to make sure you're applying those [official] methods to the actual map element and not the helper instance.

The map element is assigned to the instance's `proxy` object. So in the example above, to apply say the `panBy()` method to it, it'll be `myMap.proxy.panBy(x,y);`

Below is a detailed list of the methods available on the MapHelper class and arguments they can take.  

##### NOTE: An _italicized_ argument is optional

#### init( _`string`_ | _`object`_, _`callback`_ )

Initializes the map. `string` is the DOM element container ID, `object` would be an object with compatible parameter keys and values.

#### resize()

Resizes map. Shorter way of calling `google.maps.event.trigger(myMap.proxy, 'resize')`

#### fit( _`boolean`_ )

Adjusts center & zoom to fit all markers. 

Normally I prefer panning animation, but it can be quite buggy for Google's `panToBounds()`. So by default, it "snaps" to the new view. Setting `boolean` to _true_ will force the pan (but you have been warned!)

#### zoom( `number` )

Set map zoom.

#### center( _`LatLng`_, _`boolean`_, _`boolean`_ )

Pans/snaps map view to a supplied coordinate.

If no LatLng has been provided, the map will simply "return" to its "original" center as set in `myMap.params.center` (useful if you've dragged the map)

Setting first `boolean` to _true_ will set a new `myMap.params.center`. Setting the second `boolean` to _true_ will "snap" to the updated view (it pans by default)

#### set_maptype( `string` )

There are four map types. Officially they are:
* `google.maps.MapTypeId.ROADMAP`
* `google.maps.MapTypeId.TERRAIN`
* `google.maps.MapTypeId.HYBRID`
* `google.maps.MapTypeId.SATELLITE`

One of these are set via the method `myMap.proxy.setMapTypeId(MAP_TYPE)`

This is a convenience function where you can just use `road`, `terrain`, `satellite`, and `hybrid` as simple strings (case sensitive, though) for easier application.

#### locate_user_gps( _`callback`_, _`boolean`_ )

Returns: **LatLng**

Requires `obtrusive` parameter to be set to _true_

When neither argument is supplied (and `debug` is _true_), it will just relay the result to the console. If `boolean` is true, it will also jump to the location.

#### locate_find( `string`, _`callback`_ )

Returns: **LatLng**

For lazy people; if you don't have time to get the `LatLng` of a place, you can just try geolocating it by entering the address in long from :) The drawback is you cannot guarantee location accuracy (not to mention when you're being to broad in your address (i.e. just a street name, etc.).

#### locate_resolve( `LatLng`, _`callback`_ )

Returns: **object**

This does the opposite of `locate_find`; you enter specific coordinates, and it'll return a location object with a bunch of data (street, city, etc.) depending on what information about the location is available.

#### marker_add( `object` )

Adds a marker.

The simplest form of the marker object would be something like: `{ loc: LatLng }`, so adding a marker is easy:

```javascript
myMap.marker_add( { loc:'37.3303991,-122.0323321'} );
```

The _"kitchen sink"_ version of it would be

```javascript
{
	loc: LatLng, 
	icon: string, 
	info: String | Object, 
	evenst: { 
		click: Function, 
        dclick: Function, 
        over: Function, 
        out: Function
    } 
}
```

I created it this way to simplify, yet maximize customizability. If it sounds oxymoronic, let me explain.

Just supplying the `loc` key will generate a generic marker. Supplying the `icon` will generate a marker using the icon/image you specified.

Setting `info` as a string will simply populate the infoWindow (assuming it's enabled) with the text content. Setting it as an object allows for further customization (to be discussed at length later in the `infowindow_show()` method)

The `events` object is, as you guessed, an override for the four common eventlisteners.

In general, it's best to check the [codepen example](http://codepen.io/nargalzius/pen/gpKXaB) listed above for a better understanding of what I mean.


#### markers_show()

Displays all markers.

#### markers_hide()

Hides all markers

#### markers_clear()

Deletes all markers (and listeners attached to them)

#### infowindow_show(`object`, _`node`_)

A method to automate the process of populating and showing an infoWindow. `object` is your marker object. The `node` is a DOM element node.

If `node` is not supplied, and you _still_ call this method, it'll look for the existence of `info` data on the marker. If it exists, it'll try it's best to determine what type it is and display it. The key (pun intended) here is what you put in your marker's `info` key.

So for example, you want the contents `info` to display a link to Apple Inc., you can do it in different ways:

```javascript
var marker = {
	loc: '37.3303991,-122.0323321', 
	info: "<a href='http://apple.com'>Apple Inc.</a>",
	events: { 
    	click: function(m) {
			map.infowindow_show(m);
		} 
	}
}
myMap.marker_add(marker);
```

or

```javascript
var marker = {
	loc: '37.3303991,-122.0323321', 
	info: function() {
		var a = document.createElement('a');
			a.href = 'http://apple.com';
			a.innerHTML = 'Apple Inc.';
		return a;
	},
	events: {
		click: function(e) {
            map.infowindow_show(e);
		}
	}
}
myMap.marker_add(marker);
```

or

```javascript
var tObj = document.createElement('a');
    tObj.href = 'http://apple.com';
	tObj.innerHTML = 'Apple Inc.';
    
var marker = {
	loc: '37.3303991,-122.0323321', 
	info: tObj,
	events: { 
    	click: function(m) {
			map.infowindow_show(m);
		} 
	}
}
myMap.marker_add(marker);
```

If it doesn't find an `info` key, then it'll ignore the method call altogether.

#### infowindow_hide()

Hides the infoWindow.

#### get_staticmap( `string`, `LatLng`, `number` )

Returns: **string**

A convenience feature that accesses the `https://maps.googleapis.com/maps/api/staticmap` API to allow generating static images of the map location.

The first parameter is the DOM element ID of the container - this is where the method will derive the height and width needed based on the container you're referencing. The second paramter obviously is the coordinates. Lastly, the number is the zoom level you wish to use for the static image.

#### get_distance( `LatLng`, `LatLng`, _`callback`_ )

Returns: **number**

#### get_latlng( `string` | `array` | `object` | `LatLng` )

Returns: **LatLng**

This is more of a sanitation method. You can pass latitude and longitude values casted in different ways:

* String: `"37.3303991,-122.0323321"`
* Array: `[37.3303991,-122.0323321]`
* Object Literal: `{ lat: 37.3303991, lng: -122.0323321 }`
* Google `LatLng` object.

Since the GoogleMaps constructor recognizes the last two natively, only the first two are really "sanitized" when running through the `get_latlng` method. It's worth mentioning that all the methods in the MapHelper class that have anything to do with coordinates run any argument you supply through this method behind the scenes. In short, whenever you see an "input" that's of the type `LatLng`, you can assume that you can use any of the 4 types discussed above, since the class should be smart enough to figure it out.

#### destroy()

Although Google [doesn't recommend](https://youtu.be/rUYs765QX-8?t=12m50s) trying to destroy the map object, for posterities sake, I've included a `destroy` method. To destroy map, you simply call `myMap.destroy()`.
