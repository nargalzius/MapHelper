/*!
 *  HELPER CLASS FOR GOOGLEMAPS API
 *  https://github.com/nargalzius/MapHelper
 *
 *  3.10
 *
 *  author: Carlo J. Santos
 *  email: carlosantos@gmail.com
 *
 *  Copyright (c) 2015, All Rights Reserved, www.nargalzius.com
 */

function MapHelper() {}

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
    api: false,
    ready: false,
    currentZoom: null,
    currentCenter: null,
    clickTo: null,
    init(arg, callback) {

        // STORE IN CASE WE HAVE AN API LOAD DELAY
        if (arg) this.delayed.arg = arg;
        if (callback) this.delayed.callback = callback;

        if (window['google'] && google.maps) {
            if (this.ready) {
                this.trace('Map already initialized');
            } else {

                if (this.params.chromeless) {
                    this.params.disableDefaultUI = false;
                } else {
                    this.params.disableDefaultUI = true;
                }

                this.trace(this.get_objecttype(this.delayed.arg) + ' detected');

                switch (this.get_objecttype(this.delayed.arg)) {
                    case "[object String]":
                        this.params.id = this.delayed.arg;
                        document.getElementById(this.params.id);
                        break;
                    case "[object Object]":
                        let tObj = {};
                        for (let attrname1 in this.params) {
                            tObj[attrname1] = this.params[attrname1];
                        }
                        for (let attrname2 in this.delayed.arg) {
                            tObj[attrname2] = this.delayed.arg[attrname2];
                        }
                        this.params = tObj;
                        break;
                    default:
                        this.trace('blank');
                }

                if (this.params.center) {
                    this.params.center = this.get_latlng(this.params.center);

                    if (this.delayed.callback) {
                        this.startmap(this.delayed.callback);
                    } else {
                        this.startmap();
                    }

                } else if (this.params.obtrusive) {
                    this.locate_user_gps((e) => {
                        if (e) {
                            this.trace('location: ' + e);
                            this.params.center = e;

                            if (this.delayed.callback) {
                                this.startmap(this.delayed.callback);
                            } else {
                                this.startmap();
                            }
                        }
                    });
                } else {
                    this.locate_rigged((e) => {

                        this.params.center = e;

                        if (this.delayed.callback) {
                            this.startmap(this.delayed.callback);
                        } else {
                            this.startmap();
                        }
                    });
                }
            }
        } else {
            setTimeout(() => {
                this.init();
            }, 1000);
        }
    },
    startmap(callback) {

        if (!this.ready) {
            this.evaluate();
            this.proxy = new google.maps.Map(document.getElementById(this.params.id), this.params);
            this.currentZoom = this.proxy.getZoom();
            this.currentCenter = this.proxy.getCenter();

            this.setListeners();

            this.infoWindow = new google.maps.InfoWindow({
                disableAutoPan: this.IWparams.autopan
            });
            this.ready = true;
            if (callback) {
                callback();
            }

            this.init_cleanup();

        } else {
            this.trace('Map already initialized');
        }
    },
    setListeners() {
        // SET LISTENERS
        
        this.proxy.addListener('maptypeid_changed',  (e) => { this.callback_mapTypeChanged();    });
        this.proxy.addListener('projection_changed', (e) => { this.callback_projectionChanged(); });
        this.proxy.addListener('tilt_changed',       (e) => { this.callback_tiltChanged();       });
        this.proxy.addListener('tilesloaded',        (e) => { this.callback_tilesLoaded();       });
        this.proxy.addListener('idle',               (e) => { this.callback_mapIdle();           });
        this.proxy.addListener('resize',             (e) => { this.callback_mapResize();         });
        this.proxy.addListener('mousemove',          (e) => { this.callback_mapMouseMove();      });
        this.proxy.addListener('mouseover',          (e) => { this.callback_mapIn();             });
        this.proxy.addListener('mouseout',           (e) => { this.callback_mapOut();            });
        this.proxy.addListener('rightclick',         (e) => { this.callback_mapRClick();         });
        this.proxy.addListener('drag',               (e) => { this.callback_mapDrag();           });
        this.proxy.addListener('dragstart',          (e) => { this.callback_mapDragStart();      });
        this.proxy.addListener('dragend', (e) => {
            this.callback_mapDragEnd();

            // CHECK FOR NEW CENTER
            if( this.currentCenter !== this.proxy.getCenter() ) {
                this.currentCenter = this.proxy.getCenter();
                this.callback_centerChanged();
            }
        });
        this.proxy.addListener('click', (e) => {
            // GIVE CHANCE FOR DOUBLECLICK
            this.clickTo = setTimeout( () => {
                this.callback_mapClick();    
            }, 300);
            
        });
        this.proxy.addListener('dblclick', (e) => {
            clearTimeout(this.clickTo);
            this.callback_mapDClick();
        });
        this.proxy.addListener('zoom_changed', (e) => {
            setTimeout(()=>{
                if( this.proxy.getZoom() !== this.currentZoom ) {

                    this.trace('Zoom Level: ' + this.proxy.getZoom());

                    if( this.proxy.getZoom() < this.currentZoom ) {
                        this.callback_zoomOut();
                        this.callback_zoomChanged();
                    } else {
                        this.callback_zoomIn();
                        this.callback_zoomChanged();
                    }

                    this.currentZoom = this.proxy.getZoom();
                }
            }, 100);
        });
    },

    callback_mapClick()          { this.trace('------------------------- callback_mapClick');          },
    callback_mapDClick()         { this.trace('------------------------- callback_mapDClick');         },
    callback_mapRClick()         { this.trace('------------------------- callback_mapRClick');         },
    callback_mapDrag()           { this.trace('------------------------- callback_mapDrag');           },
    callback_mapDragStart()      { this.trace('------------------------- callback_mapDragStart');      },
    callback_mapDragEnd()        { this.trace('------------------------- callback_mapDragEnd');        },
    callback_mapMouseMove()      { this.trace('------------------------- callback_mapMouseMove');      },
    callback_mapIn()             { this.trace('------------------------- callback_mapIn');             },
    callback_mapOut()            { this.trace('------------------------- callback_mapOut');            },
    callback_zoomIn()            { this.trace('------------------------- callback_zoomIn');            },
    callback_zoomOut()           { this.trace('------------------------- callback_zoomOut');           },
    callback_zoomChanged()       { this.trace('------------------------- callback_zoomChanged');       },
    callback_centerChanged()     { this.trace('------------------------- callback_centerChanged');     },
    callback_projectionChanged() { this.trace('------------------------- callback_projectionChanged'); },
    callback_mapTypeChanged()    { this.trace('------------------------- callback_mapTypeChanged');    },
    callback_tiltChanged()       { this.trace('------------------------- callback_tiltChanged');       },
    callback_tilesLoaded()       { this.trace('------------------------- callback_tilesLoaded');       },
    callback_mapIdle()           { this.trace('------------------------- callback_mapIdle');           },
    callback_mapResize()         { this.trace('------------------------- callback_mapResize');         },

    evaluate() {

        this.set_maptype(this.params.mapType, true);
        this.params.disableDefaultUI = this.params.chromeless;

    },
    set_maptype(arg, bool) {

        if (window['google'] && google.maps) {

            if (arg === 'road' || arg === 'terrain' || arg === 'satellite' || arg === 'hybrid') {
                this.trace('Changing map type to: ' + arg);

                let newMapType = google.maps.MapTypeId[this.mapTypes[arg]];

                if (this.proxy) {
                    this.proxy.setMapTypeId(newMapType);
                }

                if (bool) {
                    this.params.mapTypeId = newMapType;
                    this.params.mapType = arg;
                }
            } else {

                if (this.params.mapType) {
                    this.trace('Invalid Map Type, choose from: "road", "hybrid", "satellite", and "terrain"');
                } else {
                    this.trace('Using default map type (road)');
                }
            }
        }
    },
    get_staticmap(container, center, zoom) {

        let zoomVal;

        if (zoom) {
            zoomVal = zoom;
        } else {
            zoomVal = this.params.zoom;
        }

        let imgH = document.getElementById(container).offsetHeight;
        let imgW = document.getElementById(container).offsetWidth;

        return 'https://maps.googleapis.com/maps/api/staticmap?center=' + center + '&zoom=' + zoomVal + '&size=' + imgW + 'x' + imgH;

    },
    resize() {
        let self = this;
        google.maps.event.trigger(this.proxy, 'resize');
    },
    zoom(num) {
        if (this.ready) {
            this.proxy.setZoom(num);
        }
    },
    center(arg, bool, jump) {
        if (this.ready) {

            let newC;

            if (arg) {
                newC = this.get_latlng(arg);
            } else {
                newC = this.params.center;
            }

            // BONUSES
            if (arg && bool) {
                switch (this.get_objecttype(bool)) {
                    case "[object Object]":

                        if (bool.replace) this.params.center = newC; //WHY?

                        let offsetx = 0;
                        let offsety = 0;

                        if (bool.x) offsetx = bool.x;

                        if (bool.y) offsety = bool.y * -1;

                        let scale = Math.pow(2, this.proxy.getZoom());
                        let nw = new google.maps.LatLng(
                            this.proxy.getBounds().getNorthEast().lat(),
                            this.proxy.getBounds().getSouthWest().lng()
                        );

                        let worldCoordinateCenter = this.proxy.getProjection().fromLatLngToPoint(newC);
                        let pixelOffset = new google.maps.Point((offsetx / scale) || 0, (offsety / scale) || 0)

                        let worldCoordinateNewCenter = new google.maps.Point(
                            worldCoordinateCenter.x - pixelOffset.x,
                            worldCoordinateCenter.y + pixelOffset.y
                        );

                        newC = this.proxy.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

                        break;
                    default:
                        this.params.center = newC;
                }
            }

            if (jump) {
                this.proxy.setCenter(newC);
            } else {
                this.proxy.panTo(newC);
            }
        }
    },
    // HARDWARE TO COORDINATES
    locate_user_gps(callback, bool) {
        if (callback && window['google'] && google.maps) {

            let latlng;

            // IF GEOLOCATION DATA AVAILABLE
            let geoLocSuccess = (location) => {
                this.trace('location accuracy: ' + location.coords.accuracy);
                latlng = this.get_latlng([location.coords.latitude, location.coords.longitude]);

                if (bool) {
                    this.proxy.setCenter(latlng);
                }
                if (callback) {
                    callback(latlng);
                } else {
                    this.trace(latlng);
                }
            };

            let geoLocError = (err) => {
                this.trace('error or location not found: ' + err);
                latlng = err;

                // this.locate_user_general( (e) => {
                //     this.trace(e);
                // });

                this.locate_rigged(callback);
            };

            navigator.geolocation.getCurrentPosition(geoLocSuccess, geoLocError);
        }
    },
    // ADDRESS TO COORDINATES
    locate_find(address, callback) {
        if (window['google'] && google.maps) {
            this.trace('finding: ' + address);

            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': address
            }, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    this.trace('coordinates for ' + address + ' is: ' + results[0].geometry.location);
                    callback(results[0].geometry.location);
                } else {
                    this.trace("Geocode was not successful for the following reason: " + status);
                    callback(null);
                }
            });
        }
    },
    // COORDINATES TO ADDRESS
    locate_resolve(latlng, callback) {
        if (window['google'] && google.maps) {

            this.trace('resolve: ' + latlng);

            let geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'latLng': this.get_latlng(latlng)
            }, (results, status) => {

                if (status === google.maps.GeocoderStatus.OK) {
                    if (results) {
                        this.trace('success');
                        callback(results);
                    } else {
                        this.trace('no results');
                        callback(null);
                    }
                } else {
                    this.trace('reverse geocoding failed due to: ' + status);
                    callback(null);
                }

            });
        }

    },
    locate_rigged(callback) {

        if (window['google'] && google.maps) {
            this.locate_find(this.params.address, (e) => {
                if (callback) {
                    callback(e);
                }
            });
        }
    },
    infowindow_show(e, content) {

        if (e.info) {
            let container = document.createElement('div');
            container.className = 'infoWindow';

            // this.trace(this.get_objecttype(e.info));
            // this.trace(typeof e.info);

            if (content) {
                container.appendChild(content);
            } else {
                let info;

                if (this.get_objecttype(e.info) === '[object String]') {
                    info = document.createElement('div');
                    info.className = 'info default text';
                    info.innerHTML = e.info;
                } else
                if (this.get_objecttype(e.info) === '[object Function]') {
                    info = e.info();
                } else {
                    info = e.info;
                }

                container.appendChild(info);
            }

            this.infoWindow.setContent(container);
            this.infoWindow.open(this.proxy, e);
            this.trace('showing infoWindow for marker ' + e.id);
        }
    },
    infowindow_hide() {
        this.infoWindow.setContent('');
        this.infoWindow.close();
        this.trace('hiding infoWindow');
    },
    marker_log: {
        index: 0,
        markers: [],
        locations: []
    },
    marker_add(obj) {

        if (this.ready) {

            let loc = this.get_latlng(obj.loc);

            let marker = new google.maps.Marker({
                id: null,
                map: this.proxy,
                position: loc,
                events: null,
                info: null,
                'loc': loc
            });

            if (obj.icon) {
                marker.setIcon(obj.icon);
            }
            if (obj.info) {
                marker.info = obj.info;
            }
            if (obj.events) {
                marker.events = obj.events;
            }
            marker.id = this.marker_log.index;

            if (!this.marker_log.locations) {
                this.marker_log.locations = [];
            }

            this.marker_log.locations.push(marker.position);
            this.marker_log.markers.push(marker);

            this.marker_log.index++;

            marker.setMap(this.proxy);
            this.listeners_add(marker);

            this.trace(marker);

        }
    },
    markers_fit(bool) {
        if (this.ready) {
            let bounds = new google.maps.LatLngBounds();

            // IF EMPTY, USE CENTER
            if (this.marker_log.locations.length === 0) {
                this.marker_log.locations.push(this.params.center);
            }

            this.marker_log.locations.forEach((n) => {
                bounds.extend(n);
            });

            this.proxy.setCenter(bounds.getCenter()); // OR USE CUSTOM CENTER

            if (bool) {
                this.proxy.panToBounds(bounds);
            } else {
                this.proxy.fitBounds(bounds);
            }
        }
    },
    markers_show() {
        if (this.ready) {
            this.markers_set(this.proxy);
        }
    },
    markers_hide() {
        if (this.ready) {
            this.markers_set(null);
        }
    },
    markers_clear() {
        for (let i = 0; i < this.marker_log.markers.length; i++) {
            let marker = this.marker_log.markers[i];
            this.listeners_remove(marker);
        }

        this.markers_set(null);
        this.marker_log.arrayid = 0;
        this.marker_log.markers = [];
        this.marker_log.locations = [];
    },
    markers_set(arg) {
        if (this.ready) {
            if (this.marker_log.markers.length) {
                this.marker_log.markers.forEach((m) => {
                    m.setMap(arg);
                });
            }
        }
    },
    listeners_add(marker) {
        // EVENT BINDINGS
        const SELF = this;
        google.maps.event.addListener(marker, 'click', function() {
            if (this.events && this.events.click) {
                this.events.click(this);
            } else {
                SELF.trace('clicked on marker: ' + this.id);
            }
        });
        google.maps.event.addListener(marker, 'dblclick', function() {
            if (this.events && this.events.dclick) {
                this.events.dclick(this);
            }
        });
        google.maps.event.addListener(marker, 'mouseover', function() {
            if (this.events && this.events.over) {
                this.events.over(this);
            }
        });
        google.maps.event.addListener(marker, 'mouseout', function() {
            if (this.events && this.events.out) {
                this.events.out(this);
            }
        });
    },
    listeners_remove(marker) {
        google.maps.event.clearListeners(marker, 'click');
        google.maps.event.clearListeners(marker, 'dblclick');
        google.maps.event.clearListeners(marker, 'mouseover');
        google.maps.event.clearListeners(marker, 'mouseout');
    },
    get_distance(p1, p2, callback) {

        if (window['google'] && google.maps) {

            let rad = (x) => {
                return x * Math.PI / 180;
            };

            let loc1 = this.get_latlng(p1);
            let loc2 = this.get_latlng(p2);

            let R = 6371000; // EARTH'S MEAN RADIUS IN METERS
            let M = 0.000621371;

            let dLat = rad(loc2.lat() - loc1.lat());
            let dLong = rad(loc2.lng() - loc1.lng());

            let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(loc1.lat())) * Math.cos(rad(loc2.lat())) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);
            let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

            let d = R * c;
            d = Math.round(d * M * 100) * 0.01;

            let res = Number(d.toFixed(1));

            if (callback) {
                callback(res);
            } else {
                return res;
            }
        }
    },
    get_latlng(arg, callback) {

        if (window['google'] && google.maps) {
            let res;

            switch (this.get_objecttype(arg)) {
                case "[object String]":
                    res = new google.maps.LatLng(arg.split(',')[0], arg.split(',')[1]);
                    break;
                case "[object Array]":
                    res = new google.maps.LatLng(arg[0], arg[1]);
                    break;
                case "[object Object]":

                    if (arg.lon) { // JS PROXIMETER ACCOMODATION
                        let tempobj = {
                            lat: arg.lat,
                            lng: arg.lon
                        };
                        arg = tempobj;
                    }

                    res = arg;
                    break;
            }

            // this.trace(res);

            if (callback) {
                callback(res);
            } else {
                return res;
            }
        }
    },
    trace(str) {
        if (window.console && this.params.debug) {
            console.log(str);
        }
    },
    get_objecttype(obj) {
        return Object.prototype.toString.call(obj);
    },
    init_cleanup() {
        // CLEANUP
        this.delayed.callback = null;
        this.delayed.arg = null;
    },
    destroy() {

        if (this.ready) {

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

// CHECK FOR API EXISTENCE
if (!(window['google'] && google.maps)) {

    let checkDebug = (window['console'] && window['debug'] && debug) ? true : false;

    // NO API YET, LOAD MANUALLY
    if (checkDebug) console.log('LOADING MAP API');
    let tag = document.createElement('script');
        tag.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' + '&callback=GMapAPIinit';
    if (window.GMapAPIKey)
        tag.src += '&key=' + window.GMapAPIKey;

    let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    let GMapAPIinit = () => {
        if (typeof window.EventBus != 'undefined') EventBus.dispatch("MAP_LOADED", window);
        if (checkDebug) console.log('GoogleMaps API loaded');
    };
}