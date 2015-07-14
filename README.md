# MapHelper "class" for GoogleMaps API v3

### Method Quick Reference

Method | Description
-------|------------
`init` | Initializes the map
`resize` | Resizes map
`fit` | Adjusts center & zoom to fit all markers
`zoom` | Sets zoom level
`center` | Jumps to a corrdinate
`locate_user_gps` | Uses browser geolocation service to locate user
`locate_find` | Resolves a long-form address to LatLng coordinates
`locate_resolve` | Resolves LatLng coordinates to a location object
`marker_add` | Adds a marker
`markers_show` | Show all markers
`markers_hide` | Hide all markers
`markers_clear` | Destroy all markers
`set_maptype` | Sets map type
`get_staticmap` | Convenience function to generate static image
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

There are _much more_ parameters you can set. The `params` object accepts practically **any** official property from the [GoogleMaps API](https://developers.google.com/maps/documentation/javascript/reference#MapOptions). 


## Quick Start

There are a bunch of ways to initialize the map. I'll be documenting 4 - quickest to the most thorough way. 

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
The third is to include a callback function to avoid asynchronous loading issues.

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

Although Google [doesn't recommend](https://youtu.be/rUYs765QX-8?t=12m50s) trying to destroy the map object, for posterities sake, I've included a `destroy` method. To destroy map, you simply call `myMap.destroy()`.

That's pretty much it! The only things left to do for map manipulations are the methods discussed above.

## Methods

Just like with the parameters/properties, while this helper class provides adds some useful methods to work with your map, **all** official [GoogleMaps API methods](https://developers.google.com/maps/documentation/javascript/reference#methods) can be applied to the map - you just have to make sure you're applying those [official] methods to the actual map element and not the helper instance.

The map element is assigned to the instance's `proxy` object. So in the example above, to apply say the `panBy()` method to it, it'll be `myMap.proxy.panBy(x,y);`

Below is a detailed list of the methods available and arguments they can take.  

##### NOTE: An _italicized_ argument is optional

#### init( _`string`_ || _`object`_, _`callback`_ )

Initializes the map. `string` is the DOM element container ID, `object` would be an object with compatible parameter keys and values.

#### resize()

Shorter way of calling `google.maps.event.trigger(myMap.proxy, 'resize')`

#### fit( _`boolean`_ )

By default it "pans" to the new view. Setting `boolean` to _true_ will snap to the updated view.

#### zoom( `number` )

Set map zoom.

#### center( _`LatLng`_, _`boolean`_, _`boolean`_ )

Reposition map based on `LatLng`. If no LatLng has been provided, the map will simply "return" to it's original center (useful if you dragged away from it) as set in `myMap.params.center`

Setting first `boolean` to _true_ will overwrite `myMap.params.center`. Setting the second `boolean` to _true_ will snap to the updated view (it pans by default)

#### set_maptype( `string` )

There are four map types. Officially they are:
* `google.maps.MapTypeId.ROADMAP`
* `google.maps.MapTypeId.TERRAIN`
* `google.maps.MapTypeId.HYBRID`
* `google.maps.MapTypeId.SATELLITE`

One of these are set via the method `myMap.proxy.setMapTypeId(MAP_TYPE)`

This is a convenience function where you can just use `road`, `terrain`, `satellite`, and `hybrid` as simple strings for easier application.

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
myMap.marker_add( { loc: [14.600854,120.984809] } );
```

The **kitchen sink** version of it would be

```javascript
{
	loc: LatLng, 
	icon: string, 
	info: String | Object, 
	event: { 
		click: callback, 
        dclick: callback, 
        over: callback, 
        out: callback
    } 
}
```

I created it this way to simplify, but still be able to somewhat maximize customizability. If it sounds oxymoronic, let me explain.

Just supplying the `loc` key will generate a generic marker. Supplying the `icon` will generate a marker using the icon/image you specified.

Setting `info` as a string will simply populate the infoWindow (assuming it's enabled) with the text content. Setting it as an object allows for further customization (which you will have to create yourself)

The `event` object is, as you guessed, an override for the four common eventlisteners. Consider the code below:

```javascript
// DEFINE MARKERS
var markerA = { 
	    loc: '40.730994,-74.003134', 
	    info: 'Hello World', 
	    icon: 'http://domain.com/custom_marker.png', 
	    event: { 
	    	over: globalMouseOverHandler, 
	        out: globalMouseOutHandler
		} 
	};
var markerB = { 
		loc: '40.72501,-74.046736', 
	    info: {
	    	pic: 'http://domain.com/picture.png',
            text: 'Hey, Nice Pic!'
	    }, 
	    event: { 
	        click: globalClickHandler, 
	        dclick: globalDoubleClickHandler 
		} 
	}

// DEFINE CUSTOM EVENT HANDLERS
var globalMouseOverHandler = function(marker) {
	myMap.infoWindow.close();
};

var globalMouseOutHandler = function(marker) {
	globalClickHandler(marker);
};
var globalClickHandler = function(marker) {
	var container = document.createElement('div');    
    var desc;
	if(typeof marker.info == 'string') {
    	desc = document.createElement('span');
        desc.innerHTML = marker.info;
    } else {
    	var pic = document.createElement('img');
            pic.src = marker.info.pic;
        container.appendChild(pic);
        desc = document.createElement('span');
        desc.innerHTML = marker.info.text;
    }
    container.appendChild(desc);
	myMap.infoWindow.setContent(container);
    myMap.infoWindow.open(myMap.proxy, marker);
};

var globalDoubleClickHandler = function(marker) {
	myMap.center(marker.position);
};

// INITIALIZE MAP
var myMap = new MapHelper();
	myMap.init('map-container', function(){
    	myMap.marker_add(markerA);
    	myMap.marker_add(markerB);
    });

```

So in case you didn't follow. We basically defined two markers with different things.

First marker
1. Has a custom icon
2. Has handlers for 2 types of interactions (mouseover and mouseout)
3. Just has "Hello World" as the info

Second marker
1. `info` key is an object with other information stored.
2. Has handlers for 2 interactions (click and double click)

We also defined the actual handlers for the different types of functions.
1. `globalMouseOverHandler` just calls `globalClickHandler` - which is in charge of populating and showing the infoWindow.
2. `globalMouseOutHandler` closes the infoWindow
3. `globalClickHandler`, as mentioned earlier is in charge of generating the content.  
We have it create a container `div` element. Then it checks if the `info` object received is a string or not. If it is, it simply creates as `span` with the text (Hello World) and then it attaches that to the container, which then is attached to the info window.  
If `info` is an object (second marker) it instead creates an `img` element **and** the `span` for the text. It then attaches both to the container - and ultimately to the infoWindow.
4. The `globalDoubleClickHandler` is set to pan the map so that the marker you double clicked on, will be centered.

So we then intialize our map, and add the two markers.

These are the things to be expected with the block of code above:

First marker
* Will use the custom icon
* infoWindow will show with the text "Hello World" will appear on mouseover
* infoWindow will disappear as soon as you move your cursor away from the marker
* Double clicking will do nothing
* Clicking will do nothing

Second Marker
* Will use the generic GoogleMaps marker icon.
* You can only open the infoWindow by manually clicking on the marker (mouseover does nothing)
* infoWindow will show the custom picture and "Hey, Nice Pic!" text
* You will have to close the infoWindow manually (mouseout does nothing)
* Double clicking on the marker will reposition the map and center the marker you clicked on.

So you can see, while there are limitations, for most cases that involved markers, this is already a pretty powerful customization tool which is pretty straightforward compared to the other ways I've seen online. The trick is really the `info` object. Cuz you basically can put **anything** in there - and ultimately, Google's `infoWindow.setContent()` method basically allows you to put any HTML content inside it. So you can use classes and style them via CSS.


#### markers_show()

Displays all markers.

#### markers_hide()

Hides all markers

#### markers_clear()

Deletes all markers (and listeners attached to them)

#### get_staticmap( `string`, `LatLng`, `number` )

Returns: **string**

A convenience feature that accesses the `https://maps.googleapis.com/maps/api/staticmap` API to allow generating static images of the map location.

The first parameter is the DOM element ID of the container - this is where the method will derive the height and width needed based on the container you're referencing. The second paramter obviously is the coordinates. Lastly, the number is the zoom level you wish to use for the static image.

### get_distance( `LatLng`, `LatLng`, _`callback`_ )

Returns: **number**

### get_latlng( `string` | `array` | `object` | `LatLng` )

Returns: **LatLng**

This is more of a sanitation method. You can pass latitude and longitude values casted in different ways:

* String: `"40.72501,-74.046736"`
* Array: `[40.72501,-74.046736]`
* Object Literal: `{ lat: 40.72501, lng: -74.046736 }`
* Google `LatLng` object.

Since the GoogleMaps constructor recognizes the last two natively, only the first two are really parsed when running through the `get_latlng` method. It's worth mentioning that all the methods in this helper class that have anything to do with coordinates run the argument you supply through the `get_latlng` method. So In short, whenever you see an "input" that's of the type `LatLng`, you can assume that you can use any of the 4 types discussed above, and the class should be smart enough to sanitize it if need be.