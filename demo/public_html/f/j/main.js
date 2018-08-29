window.GMapAPIKey = 'AIzaSyCFRNLj4ku5PAV6mht_GmOzRKvKRpUsFSg';

// IMAGES
let js = 'http://joystickinteractive.com/images/js-logo-small.png';
let mr = 'https://nargalzius.github.io/i/mapping/marker_red.png';
let mi = 'https://nargalzius.github.io/i/mapping/marker_blue.png';
let mg = 'https://nargalzius.github.io/i/mapping/marker_green.png';
let mb = 'https://nargalzius.github.io/i/mapping/marker_black.png';
let mo = 'https://nargalzius.github.io/i/mapping/marker_orange.png';
let mv = 'https://nargalzius.github.io/i/mapping/marker_purple.png';
let w1 = 'https://farm9.staticflickr.com/8864/18230308095_f67fbdf37d_q.jpg';
let w2 = 'https://farm9.staticflickr.com/8864/18230308095_f67fbdf37d_q.jpg';
let w3 = 'https://farm8.staticflickr.com/7738/17346938444_cbba2bb3d2_q.jpg';
let w4 = 'https://farm9.staticflickr.com/8703/16970137454_3be4bdd7b0_q.jpg';
let w5 = 'https://farm9.staticflickr.com/8196/8089886408_bcced86bb6_q.jpg';

let tempobject = document.createElement('img');
    tempobject.src = w4;

// TEXT
let h = '<span style=\'font-weight:bold;\'>Lorem ipsum dolor sit amet</span>';
let d = 'Consectetur adipiscing elit.<br/>Qui potest igitur habitare in beata<br/>vita summi mali metus? Quem<br/>Tiberina descensio festo';


// MARKER
let markers = [
    // marker only
    {
        loc: {lat: 45.9615029, lng: -108.6082415}
    },
    // with custom icon
    {
        loc: '36.8036157,-96.8528704',
        icon: mg
    },
    // with infoWindow, text (.info)
    {
        loc: {lat: 40.6752684, lon: -86.9432024},
        info: 'Lorem ipsum',
        events: {
            click: clickHandler,
            dclick: dClickHandler,
            over: overHandler,
            out: outHandler
        }
    },
    // with infoWindow, picture (.pic)
    {
        loc: '40.7384504,-73.9886937',
        info: {
            pic: js
        },
        events: {
            click: clickHandler,
            dclick: dClickHandler,
            over: overHandler,
            out: outHandler
        }
    },
    // with custom icon, infoWindow, header text
    {
        loc: '40.7418927,-95.5564837',
        icon: mv,
        info: {
            header: h
        },
        events: {
            click: clickHandler,
            dclick: dClickHandler,
            over: overHandler,
            out: outHandler
        }
    },
    // with custom icon, infoWindow, details text
    {
        loc: '45.238968,-101.5550188',
        icon: mb,
        info: {
            details: d
        },
        events: {
            click: clickHandler,
            dclick: dClickHandler,
            over: overHandler,
            out: outHandler
        }
    },
    // with infoWindow, details & header text
    {
        loc: '35.3886421,-112.0589777',
        info: {
            details: d,
            header: h
        },
        events: {
            click: clickHandler,
            dclick: dClickHandler,
            over: overHandler,
            out: outHandler
        }
    },
    // with custom icon, infoWindow, pic, header text
    {
        loc: '29.4142929,-100.6101946',
        icon: mr,
        info: {
            pic: w1,
            header: h
        },
        events: {
            click: clickHandler,
            dclick: dClickHandler,
            over: overHandler,
            out: outHandler
        }
    },
    // with custom icon, infoWindow, pic, details text
    {
        loc: '36.4862811,-106.1033587',
        icon: mo,
        info: {
            pic: w2,
            details: d
        },
        events: {
            click: clickHandler,
            dclick: dClickHandler,
            over: overHandler,
            out: outHandler
        }
    },
    // with custom icon, infoWindow, pic, details & header text
    {
        loc: '33.7915247,-90.4588274',
        icon: mi,
        info: {
            details: d,
            header: h,
            pic: w3
        },
        events: {
            click: clickHandler,
            dclick: dClickHandler,
            over: overHandler,
            out: outHandler
        }
    },
    // with individual custom callbacks
    // {
    //     loc: '40.7384504,-73.9886937',
    //     icon: js,
    //     info: {
    //         url: 'http://joystickinteractive.com',
    //         name: 'Joystick'
    //     },
    //     events: {
    //         click: function(e) {

    //             let a = document.createElement('a');
    //                 a.innerHTML = e.info.name;
    //                 a.href = e.info.url;
    //                 a.target = '_blank';

    //             map.infowindow_show(e, a);
    //         },
    //         dclick: function(e) {
    //             map.center(e.position);
    //         }
    //     }
    // }, 
    {
        loc: '47.6391668,-122.1287076',
        icon: 'https://cdn0.iconfinder.com/data/icons/shift-logotypes/32/Microsoft-128.png',
        info: {
            url: 'http://microsoft.com',
            name: 'Microsoft'
        },
        events: {
            click: function(e) {
                let a = document.createElement('a');
                    a.innerHTML = e.info.name;
                    a.href = e.info.url;
                    a.target = '_blank';

                map.infowindow_show(e, a);
            },
            dclick: function(e) {
                map.center(e.position);
            }
        }
    }, 
    {
        loc: '37.3303991,-122.0323321',
        icon: 'https://cdn3.iconfinder.com/data/icons/umar/Apple.png',
        // info: "<a href='http://apple.com'>Apple Inc.</a>",
        info: function() {
            let a = document.createElement('a');
                a.href = 'http://apple.com';
                a.innerHTML = 'Apple Inc.';
                a.target = '_blank';
            return a;
        },
        events: {
            click: function(e) {
                map.infowindow_show(e);
            },
            dclick: function(e) {
                map.center(e.position);
            }
        }
    }
];

// DEFINE MAIN FUNCTIONS
function mainFunctions() {
    markers.forEach(function(e) {
        map.marker_add(e);
    });

    // new google.maps.LatLng(-34.397, 150.644)
    // map.marker_add({
    //     loc: new google.maps.LatLng(40.7384504,-73.9886937),
    //     icon: js,
    //     info: {
    //         header: 'Joystick Interactive',
    //         pic: js
    //     },
    //     events: {
    //         click: function(e){
    //             trace(new google.maps.LatLng(40.7384504,-73.9886937));
    //         },
    //         dclick: dClickHandler,
    //         over: overHandler,
    //         out: outHandler
    //     }
    // })
    map.markers_fit();  
}

    let buttons = document.querySelectorAll('.btn');
    
[].forEach.call(buttons, function (item) {
    item.addEventListener('click', btnHandler);
});


function btnHandler() {
    switch (this.id) {
        case 'btn_showmarkers':
            map.markers_show();
            break;
        case 'btn_hidemarkers':
            map.markers_hide();
            break;
        case 'btn_clearmarkers':
            map.markers_clear();
            break;
        case 'btn_loadmarkers':
            markers.forEach(function(e) {
                map.marker_add(e);
            });
            map.markers_fit();
            break;
    }
}

// INITIALIZE MAP
let customParams = {
    debug: true,
    id: 'map-canvas',
    mapType: 'road'
};

let map = new MapHelper();
    map.init(customParams, mainFunctions);

// DEFINE CUSTOM EVENT HANDLERS
function outHandler() {
    map.infowindow_hide();
}

function clickHandler(marker) {
    map.center(marker.position, {x: -5, y: 6, replace: true});
}

function overHandler(marker) {
    let wrapper = document.createElement('div');

    if (marker.info) {
        if (typeof marker.info == 'string') {
            let desc = document.createElement('span');
                desc.className = 'details';
                desc.innerHTML = marker.info;
            wrapper.appendChild(desc);
        } else {
            if (marker.info.pic) {
                let pic = document.createElement('img');
                    pic.className = 'pic';
                    pic.src = marker.info.pic;
                wrapper.appendChild(pic);
            }

            if (marker.info.header) {
                let header = document.createElement('span');
                    header.className = 'header';
                    header.innerHTML = marker.info.header;
                wrapper.appendChild(header);
            }

            if (marker.info.details) {
                let details = document.createElement('div');
                    details.className = 'details';
                    details.innerHTML = marker.info.details;
                wrapper.appendChild(details);
            }
        }
    }

    map.infowindow_show(marker, wrapper);
}

function dClickHandler(marker) {
    trace(marker.id);
}

function trace(str) {
    console.log(str);
}

