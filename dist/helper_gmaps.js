if("undefined"==typeof window.GMapAPILoaded){window.GMapAPILoaded=!1;var tag=document.createElement("script");tag.src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&callback=GMapAPIinit",setTimeout(function(){var e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(tag,e)},5e3);var GMapAPIinit=function(){window.GMapAPILoaded=!0,console.log("GoogleMaps API loaded")}}var MapHelper=function(){};MapHelper.prototype={params:{debug:!1,center:null,zoom:15,id:"map",obtrusive:!0,address:"New York, USA",draggable:!0,disableDoubleClickZoom:!0,mapType:"road",minZoom:2,maxZoom:15,chromeless:!0},mapTypes:{road:"ROADMAP",hybrid:"HYBRID",satellite:"SATELLITE",terrain:"TERRAIN"},proxy:null,infoWindow:null,IWparams:{element:null,autopan:!0},delayed:{arg:null,callback:null},ready:!1,init:function(e,t){var a=this;if(e&&(this.delayed.arg=e),t&&(this.delayed.callback=t),GMapAPILoaded)if(this.ready)this.trace("Map already initialized");else{switch(this.params.chromeless?this.params.disableDefaultUI=!1:this.params.disableDefaultUI=!0,this.trace(this.get_objecttype(this.delayed.arg)+" detected"),this.get_objecttype(this.delayed.arg)){case"[object String]":this.params.id=this.delayed.arg,document.getElementById(this.params.id);break;case"[object Object]":var s={};for(var i in this.params)s[i]=this.params[i];for(var o in this.delayed.arg)s[o]=this.delayed.arg[o];this.params=s;break;default:this.trace("blank")}this.params.center?(this.params.center=this.get_latlng(this.params.center),this.delayed.callback?this.startmap(this.delayed.callback):this.startmap()):this.params.obtrusive?this.locate_user_gps(function(e){e&&(a.trace("location: "+e),a.params.center=e,a.delayed.callback?a.startmap(a.delayed.callback):a.startmap())}):this.locate_rigged(function(e){a.params.center=e,a.delayed.callback?a.startmap(a.delayed.callback):a.startmap()})}else setTimeout(function(){a.init()},1e3)},startmap:function(e){var t=this;this.ready?this.trace("Map already initialized"):(this.evaluate(),this.proxy=new google.maps.Map(document.getElementById(this.params.id),this.params),this.proxy.addListener("zoom_changed",function(){t.trace("Zoom Level: "+t.proxy.getZoom())}),this.infoWindow=new google.maps.InfoWindow({disableAutoPan:this.IWparams.autopan}),this.ready=!0,e&&e(),this.init_cleanup())},evaluate:function(){this.set_maptype(this.params.mapType,!0),this.params.disableDefaultUI=this.params.chromeless},set_maptype:function(e,t){if(GMapAPILoaded)if("road"===e||"terrain"===e||"satellite"===e||"hybrid"===e){this.trace("Changing map type to: "+e);var a=google.maps.MapTypeId[this.mapTypes[e]];this.proxy&&this.proxy.setMapTypeId(a),t&&(this.params.mapTypeId=a,this.params.mapType=e)}else this.params.mapType?this.trace('Invalid Map Type, choose from: "road", "hybrid", "satellite", and "terrain"'):this.trace("Using default map type (road)")},get_staticmap:function(e,t,a){var s;s=a?a:this.params.zoom;var i=document.getElementById(e).offsetHeight,o=document.getElementById(e).offsetWidth;return"https://maps.googleapis.com/maps/api/staticmap?center="+t+"&zoom="+s+"&size="+o+"x"+i},resize:function(){var e=this;google.maps.event.trigger(e.proxy,"resize")},fit:function(e){if(this.ready){var t=new google.maps.LatLngBounds;0===this.marker_log.locations.length&&this.marker_log.locations.push(this.params.center),this.marker_log.locations.forEach(function(e){t.extend(e)}),this.proxy.setCenter(t.getCenter()),e?this.proxy.fitBounds(t):this.proxy.panToBounds(t)}},zoom:function(e){this.ready&&this.proxy.setZoom(e)},center:function(e,t,a){if(this.ready){var s;s=e?this.get_latlng(e):this.params.center,a?this.proxy.setCenter(s):this.proxy.panTo(s),e&&t&&(this.params.center=s)}},locate_user_gps:function(e,t){var a=this;if(e&&GMapAPILoaded){var s,i=function(i){a.trace("location accuracy: "+i.coords.accuracy),s=a.get_latlng([i.coords.latitude,i.coords.longitude]),t&&a.proxy.setCenter(s),e?e(s):a.trace(s)},o=function(t){a.trace("error or location not found: "+t),s=t,a.locate_rigged(e)};navigator.geolocation.getCurrentPosition(i,o)}},locate_find:function(e,t){var a=this;if(GMapAPILoaded){this.trace("finding: "+e);var s=new google.maps.Geocoder;s.geocode({address:e},function(s,i){i===google.maps.GeocoderStatus.OK?(a.trace("coordinates for "+e+" is: "+s[0].geometry.location),t(s[0].geometry.location)):(a.trace("Geocode was not successful for the following reason: "+i),t(null))})}},locate_resolve:function(e,t){if(GMapAPILoaded){var a=this;this.trace("resolve: "+e);var s=new google.maps.Geocoder;s.geocode({latLng:this.get_latlng(e)},function(e,s){s===google.maps.GeocoderStatus.OK?e?(a.trace("success"),t(e)):(a.trace("no results"),t(null)):(a.trace("reverse geocoding failed due to: "+s),t(null))})}},locate_rigged:function(e){GMapAPILoaded&&this.locate_find(this.params.address,function(t){e&&e(t)})},marker_log:{index:0,markers:[],locations:[]},marker_add:function(e){if(this.ready){var t=this.get_latlng(e.loc),a=new google.maps.Marker({id:this.marker_log.arrayid,map:this.proxy,position:t});e.icon&&a.setIcon(e.icon),e.info&&(a.info=e.info),e.event&&(a.event=e.event),a.id=this.marker_log.index,this.marker_log.locations||(this.marker_log.locations=[]),this.marker_log.locations.push(a.position),this.marker_log.markers.push(a),this.marker_log.index++,a.setMap(this.proxy),this.listeners_add(a)}},listeners_add:function(e){var t=this;google.maps.event.addListener(e,"click",function(){this.event&&this.event.click?this.event.click(this):t.trace(this.id)}),google.maps.event.addListener(e,"dblclick",function(){this.event&&this.event.dclick&&this.event.dclick(this)}),google.maps.event.addListener(e,"mouseover",function(){this.event&&this.event.over&&this.event.over(this)}),google.maps.event.addListener(e,"mouseout",function(){this.event&&this.event.out&&this.event.out(this)})},listeners_remove:function(e){google.maps.event.clearListeners(e,"click"),google.maps.event.clearListeners(e,"dblclick"),google.maps.event.clearListeners(e,"mouseover"),google.maps.event.clearListeners(e,"mouseout")},markers_show:function(){this.ready&&this.markers_set(this.proxy)},markers_hide:function(){this.ready&&this.markers_set(null)},markers_clear:function(){for(var e=0;e<this.marker_log.markers.length;e++){var t=this.marker_log.markers[e];this.listeners_remove(t)}this.markers_set(null),this.marker_log.arrayid=0,this.marker_log.markers=[],this.marker_log.locations=[]},markers_set:function(e){this.ready&&this.marker_log.markers.length&&this.marker_log.markers.forEach(function(t){t.setMap(e)})},get_distance:function(e,t,a){if(GMapAPILoaded){var s=function(e){return e*Math.PI/180},i=this.get_latlng(e),o=this.get_latlng(t),r=6371e3,n=621371e-9,l=s(o.lat()-i.lat()),c=s(o.lng()-i.lng()),d=Math.sin(l/2)*Math.sin(l/2)+Math.cos(s(i.lat()))*Math.cos(s(o.lat()))*Math.sin(c/2)*Math.sin(c/2),h=2*Math.atan2(Math.sqrt(d),Math.sqrt(1-d)),p=r*h;p=.01*Math.round(p*n*100);var m=Number(p.toFixed(1));if(!a)return m;a(m)}},get_latlng:function(e,t){if(GMapAPILoaded){var a;switch(this.get_objecttype(e)){case"[object String]":a=new google.maps.LatLng(e.split(",")[0],e.split(",")[1]);break;case"[object Array]":a=new google.maps.LatLng(e[0],e[1]);break;case"[object Object]":a=e}if(!t)return a;t(a)}},trace:function(e){this.params.debug&&console.log(e)},get_objecttype:function(e){return Object.prototype.toString.call(e)},init_cleanup:function(){this.delayed.callback=null,this.delayed.arg=null},destroy:function(){this.ready?(this.markers_clear(),google.maps.event.clearListeners(this.proxy,"zoom_changed"),this.infoWindow=null,this.proxy=null,document.getElementById(this.params.id).innerHTML="",this.ready=!1):this.trace("nothing to destroy")}};