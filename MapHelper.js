/*!
 *	HELPER CLASS FOR GOOGLEMAPS API
 *	https://github.com/nargalzius/MapHelper
 *
 *	3.6
 *
 *	author: Carlo J. Santos
 *	email: carlosantos@gmail.com
 *
 *	Copyright (c) 2015, All Rights Reserved, www.nargalzius.com
 */

//var GMapAPIinit, console, google, GMapAPILoaded; // FOR DEBUGGING

if(typeof window.GMapAPILoaded === 'undefined')
{
	window.GMapAPILoaded = false;

	var tag = document.createElement('script');
		tag.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + '&signed_in=false&callback=GMapAPIinit';

	if( window.GMapAPIKey ) tag.src += '&key=' + window.GMapAPIKey;

	//setTimeout(function(){
	var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	//}, 5000);

	var GMapAPIinit = function() {
	 	window.GMapAPILoaded = true;
	 	if(typeof window.EventBus != 'undefined') EventBus.dispatch("MAP_LOADED", window);
	 	if(console && debug) console.log('GoogleMaps API loaded');
	};
}

function MapHelper(){}

MapHelper.prototype = {
	params: {
		debug: false,
		center: null,
		zoom: 15,
		id: 'map',
		obtrusive: true,
		address: 'New York, USA',
		draggable: true,
		disableDoubleClickZoom: true,
		mapType: 'road',
		minZoom: 2,
		maxZoom: 15,
		chromeless: true
	},
	mapTypes: {
		road: 'ROADMAP',
		hybrid: 'HYBRID',
		satellite: 'SATELLITE',
		terrain: 'TERRAIN'
	},
	proxy: null,
	infoWindow: null,
	IWparams: {
		element: null,
		autopan: true
	},
	delayed: {
		arg: null,
		callback: null
	},
	ready: false,
	init: function(arg, callback) {
		
		var self = this;

		if(arg) {this.delayed.arg = arg;}
		if(callback) {this.delayed.callback = callback;}

		if( GMapAPILoaded )
		{
			if(this.ready)
			{
				this.trace('Map already initialized');
			}
			else
			{

				if(this.params.chromeless) { this.params.disableDefaultUI = false; } else { this.params.disableDefaultUI = true; }

				this.trace(this.get_objecttype(this.delayed.arg) + ' detected');

				switch(this.get_objecttype(this.delayed.arg))
				{
					case "[object String]":
						this.params.id = this.delayed.arg;
						document.getElementById(this.params.id);
					break;
					case "[object Object]":
						var tObj = {};
							for (var attrname1 in this.params) { tObj[attrname1] = this.params[attrname1]; }
							for (var attrname2 in this.delayed.arg) { tObj[attrname2] = this.delayed.arg[attrname2]; }
							this.params = tObj;
					break;
					default:
						this.trace('blank');
				}

				if(this.params.center)
				{
					this.params.center = this.get_latlng(this.params.center);

					if(this.delayed.callback) {
						this.startmap(this.delayed.callback);
					} else {
						this.startmap();
					}

					//this.init_cleanup();
				}
				else if(this.params.obtrusive)
				{
					this.locate_user_gps(function(e){

						if(e) {
							self.trace('location: '+e);
							self.params.center = e;

							if(self.delayed.callback) {
								self.startmap(self.delayed.callback);
							} else {
								self.startmap();
							}

							//self.init_cleanup();
						}
					});
				} else {
					this.locate_rigged(function(e){

						self.params.center = e;

						if(self.delayed.callback) {
							self.startmap(self.delayed.callback);
						} else {
							self.startmap();
						}

						//self.init_cleanup();
					});
				}
			}
		}
		else
		{
			setTimeout(function(){
				self.init();
			}, 1000);
		}
	},
	startmap: function(callback)
	{
		var self = this;

		if(!this.ready)
		{
			this.evaluate();
			this.proxy = new google.maps.Map( document.getElementById(this.params.id), this.params);
			this.proxy.addListener('zoom_changed',function(){
				self.trace('Zoom Level: '+self.proxy.getZoom());
			});
			this.infoWindow = new google.maps.InfoWindow({disableAutoPan: this.IWparams.autopan});
			this.ready = true;
			if(callback) {
				callback();
			}

			this.init_cleanup();
		} else {
			this.trace('Map already initialized');
		}
	},
	evaluate: function() {

		this.set_maptype(this.params.mapType, true);
		this.params.disableDefaultUI = this.params.chromeless;

	},
	set_maptype: function(arg, bool) {
		
		if( GMapAPILoaded ) {

			if( arg === 'road' || arg === 'terrain' || arg === 'satellite' || arg === 'hybrid' )
			{
				this.trace('Changing map type to: '+arg);

				var newMapType = google.maps.MapTypeId[this.mapTypes[arg]];

				if(this.proxy) {this.proxy.setMapTypeId(newMapType);}

				if(bool) {
					this.params.mapTypeId = newMapType;
					this.params.mapType = arg;
				}
			} else {

				if(this.params.mapType) {
					this.trace('Invalid Map Type, choose from: "road", "hybrid", "satellite", and "terrain"');
				} else {
					this.trace('Using default map type (road)');
				}
			}
		}
	},
	get_staticmap: function(container, center, zoom) {
		
		var zoomVal;

		if(zoom) {
			zoomVal = zoom;
		} else {
			zoomVal = this.params.zoom;
		}

		var imgH = document.getElementById(container).offsetHeight;
		var imgW = document.getElementById(container).offsetWidth;

		return 'https://maps.googleapis.com/maps/api/staticmap?center='+center+'&zoom='+zoomVal+'&size='+imgW+'x'+imgH;

	},
	resize: function() {
		var self = this;
		google.maps.event.trigger(self.proxy, 'resize');
	},
	zoom: function(num)
	{
		if(this.ready) {this.proxy.setZoom(num);}	
	},
	center: function(arg, bool, jump)
	{
		if(this.ready) {

			var newC;

			if(arg) {
				newC = this.get_latlng(arg);
			} else {
				newC = this.params.center;
			}

			// BONUSES
			if(arg && bool) {
				switch(this.get_objecttype(bool))
				{
					case "[object Object]":

						if(bool.replace) this.params.center = newC;

						var offsetx = 0;
						var offsety = 0;

						if(bool.x) offsetx = bool.x;

						if(bool.y) offsety = bool.y * -1;
						
						var scale = Math.pow(2, this.proxy.getZoom());
						var nw = new google.maps.LatLng(
						    this.proxy.getBounds().getNorthEast().lat(),
						    this.proxy.getBounds().getSouthWest().lng()
						);

						var worldCoordinateCenter = this.proxy.getProjection().fromLatLngToPoint(newC);
						var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0)

						var worldCoordinateNewCenter = new google.maps.Point(
						    worldCoordinateCenter.x - pixelOffset.x,
						    worldCoordinateCenter.y + pixelOffset.y
						);

						newC = this.proxy.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

					break;
					default:
						this.params.center = newC;		
				}
			}

			if(jump) {
				this.proxy.setCenter(newC);
			} else {
				this.proxy.panTo(newC);
			}
		}
	},
	locate_user_gps: function(callback, bool)
	{
		var self = this;

		if(callback && GMapAPILoaded)
		{

			var latlng;

			// IF GEOLOCATION DATA AVAILABLE
			var geoLocSuccess = function(location) {
				self.trace('location accuracy: '+location.coords.accuracy);
				latlng = self.get_latlng([location.coords.latitude, location.coords.longitude]);

				if(bool) {self.proxy.setCenter(latlng);}
				if(callback) {callback(latlng);}
				else {self.trace(latlng);}
			};

			var geoLocError = function(err) {
				self.trace('error or location not found: '+err);
				latlng = err;

				// self.locate_user_general(function(e){
				// 	trace(e);
				// })

				self.locate_rigged(callback);
			};

			navigator.geolocation.getCurrentPosition(geoLocSuccess, geoLocError);
		}
	},
	// locate_user_general: function(callback, bool)
	// {
	// 	if(callback === "man")
	// 	{
	// 		this.man(	'Locates user via Google JSAPI script (deprecated & unreliable)',
	// 					'Callback, Boolean',
	// 					'LatLng',
	// 					'Boolean is optional, setting it to true will jump the map to the coordinates'
	// 				);
	// 	} else {

	// 		if( GMapAPILoaded )
	// 		{
	// 			var self = this;

	// 				if(callback || self.delayed.callback)
	// 				{
	// 					if(callback) self.delayed.callback = callback;

	// 					// if(window['JSAPILoaded'])
	// 					// {
	// 					// 	trace(google.loader.ClientLocation);
	// 					// }
	// 					// else
	// 					// {
	// 					// 	setTimeout(function(){
	// 					// 		self.locate_user_general();
	// 					// 	}, 1000)
	// 					// }
	// 			}
	// 		}
	// 	}
	// },
	locate_find: function(address, callback) {

		var self = this;

		if( GMapAPILoaded ) {
			this.trace('finding: '+address);

			var geocoder = new google.maps.Geocoder();
				geocoder.geocode( { 'address': address}, function(results, status) {
					if (status === google.maps.GeocoderStatus.OK) {
						self.trace('coordinates for '+address+' is: '+results[0].geometry.location);
						callback(results[0].geometry.location);
					} else {
						self.trace("Geocode was not successful for the following reason: " + status);
						callback(null);
					}
				});
		}
	},
	locate_resolve: function(latlng, callback)
	{
		if( GMapAPILoaded ) {

			var self = this;

			this.trace('resolve: '+latlng);

			var geocoder = new google.maps.Geocoder();
				geocoder.geocode({'latLng': this.get_latlng(latlng)}, function(results, status) {

					if (status === google.maps.GeocoderStatus.OK) {
						if (results) {
							self.trace('success');
							callback(results);
						} else {
							self.trace('no results');
							callback(null);
						}
					} else {
						self.trace('reverse geocoding failed due to: ' + status);
						callback(null);
					}

				});
		}

	},
	locate_rigged: function(callback) {

		if( GMapAPILoaded ) {
			this.locate_find(this.params.address, function(e){
				if(callback) {callback(e);}
			});
		}
	},
	infowindow_show: function(e, content) {

		if(e.info)
		{
			var container = document.createElement('div');
				container.className = 'infoWindow';

				//trace(this.get_objecttype(e.info));
				//trace(typeof e.info);
				
				if(content) { 
					container.appendChild(content);
				} else {
					var info;

					if(this.get_objecttype(e.info) === '[object String]') {
						info = document.createElement('div');
						info.className = 'info default text';
						info.innerHTML = e.info;
					}
					else
					if(this.get_objecttype(e.info) === '[object Function]') {
						info = e.info();
					}
					else {
						info = e.info;	
					}

					container.appendChild(info);
				}

				this.infoWindow.setContent(container);
				this.infoWindow.open(this.proxy, e);
				this.trace('showing infoWindow for marker '+e.id);
		}
	},
	infowindow_hide: function() {
		this.infoWindow.setContent('');
		this.infoWindow.close();
		this.trace('hiding infoWindow');
	},
	marker_log: {
		index: 0,
		markers: [],
		locations: []
	},
	marker_add: function(obj) {

		if( this.ready ) {

			var loc = this.get_latlng(obj.loc);

			var marker = new google.maps.Marker({
				id: null,
				map: this.proxy,
				position: loc,
				events: null,
				info: null,
				'loc': loc 
			});

			if(obj.icon) {marker.setIcon(obj.icon);}
			if(obj.info) {marker.info = obj.info;}
			if(obj.events) { marker.events = obj.events; }
			marker.id = this.marker_log.index;

			if(!this.marker_log.locations) {this.marker_log.locations = [];}

			this.marker_log.locations.push(marker.position);
			this.marker_log.markers.push(marker);

			this.marker_log.index++;

			marker.setMap(this.proxy);
			this.listeners_add(marker);

			this.trace(marker);

		}
	},
	markers_fit: function(bool)
	{
		if(this.ready) {
			var bounds = new google.maps.LatLngBounds();

			// IF EMPTY, USE CENTER
			if(this.marker_log.locations.length === 0) {this.marker_log.locations.push(this.params.center);}

			this.marker_log.locations.forEach(function(n){
				bounds.extend(n);
			});

			this.proxy.setCenter(bounds.getCenter()); //or use custom center

			if(bool) {
				this.proxy.panToBounds(bounds);
			} else {
				this.proxy.fitBounds(bounds);
			}
		}
	},
	markers_show: function() {
		if(this.ready) {this.markers_set(this.proxy);}
	},
	markers_hide: function() {
		if(this.ready) {this.markers_set(null);}
	},
	markers_clear: function() {
		for(var i = 0; i < this.marker_log.markers.length; i++)
		{
			var marker = this.marker_log.markers[i];
			this.listeners_remove(marker);
		}

		this.markers_set(null);
		this.marker_log.arrayid = 0;
		this.marker_log.markers = [];
		this.marker_log.locations = [];
	},
	markers_set: function(arg) {
		if(this.ready) {
			if(this.marker_log.markers.length)
			{
				this.marker_log.markers.forEach(function(m) {
					m.setMap(arg);
				});
			}
		}
	},
	listeners_add: function(marker) {
		var self = this;
		// EVENT BINDINGS
		google.maps.event.addListener(marker, 'click', function(){
			if(this.events && this.events.click) {
				this.events.click(this);
			} else {
				self.trace('clicked on marker: '+this.id);
			}
		});
		google.maps.event.addListener(marker, 'dblclick', function(){
			if(this.events && this.events.dclick) {
				this.events.dclick(this);
			}
		});
		google.maps.event.addListener(marker, 'mouseover', function(){
			if(this.events && this.events.over) {
				this.events.over(this);
			}
		});
		google.maps.event.addListener(marker, 'mouseout', function(){
			if(this.events && this.events.out) {
				this.events.out(this);
			}
		});
	},
	listeners_remove: function(marker) {
		google.maps.event.clearListeners(marker, 'click');
		google.maps.event.clearListeners(marker, 'dblclick');
		google.maps.event.clearListeners(marker, 'mouseover');
		google.maps.event.clearListeners(marker, 'mouseout');
	},
	get_distance: function(p1, p2, callback) {
		
		if( GMapAPILoaded ) {
			// function rad(x) {
			// 	return x * Math.PI / 180;
			// }

			var rad = function(x) { return x * Math.PI / 180; };

			var loc1 = this.get_latlng(p1);
			var loc2 = this.get_latlng(p2);

  			var R = 6371000; // earth's mean radius in metres
  			var M = 0.000621371;

  			var dLat = rad(loc2.lat() - loc1.lat());
  			var dLong = rad(loc2.lng() - loc1.lng());

  			var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  				Math.cos(rad(loc1.lat())) * Math.cos(rad(loc2.lat())) *
  				Math.sin(dLong / 2) * Math.sin(dLong / 2);
  			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  			var d = R * c;
  				d = Math.round(d*M *100) * 0.01;

  			var res = Number(d.toFixed(1));

			if(callback) {
				callback(res);
			} else {
				return res;
			}
		}
	},
	get_latlng: function(arg, callback) {
		
		if( GMapAPILoaded ) {
			var res;

			switch(this.get_objecttype(arg))
			{
				case "[object String]":
					res = new google.maps.LatLng(arg.split(',')[0], arg.split(',')[1]);
				break;
				case "[object Array]":
					res = new google.maps.LatLng(arg[0], arg[1]);
				break;
				case "[object Object]":
					res = arg;
				break;
			}

			//trace(res);

			if(callback) {
				callback(res);
			} else {
				return res;
			}
		}
	},
	trace: function (str) { if(console && this.params.debug) {console.log(str);} },
	get_objecttype: function(obj) {
		return Object.prototype.toString.call(obj);
	},
	init_cleanup: function() {
		// CLEANUP
		this.delayed.callback = null;
		this.delayed.arg = null;
	},
	destroy: function() {

		if(this.ready) {

			this.markers_clear();
			google.maps.event.clearListeners(this.proxy, 'zoom_changed');
			this.infoWindow = null;
			this.proxy = null;
			document.getElementById(this.params.id).innerHTML = '';
			this.ready = false;
		} else {
			this.trace('nothing to destroy');
		}

	}
};