// DEFINE MAIN FUNCTIONS
function mainFunctions() {
    markers.forEach(function(e) {
        map.marker_add(e);
    });
    map.markers_fit();  
}

    var buttons = document.querySelectorAll('.btn');
    
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
var customParams = {
    //debug: true,
    id: 'map-canvas',
    mapType: 'road'
};

var map = new MapHelper();
map.init(customParams, mainFunctions);

// DEFINE CUSTOM EVENT HANDLERS
function outHandler() {
    //map.infowindow_hide();
}

function clickHandler(marker) {
    map.center(marker.position);
}

function overHandler(marker) {
    var wrapper = document.createElement('div');

    if (marker.info) {
        if (typeof marker.info == 'string') {
            var desc = document.createElement('span');
            desc.className = 'details';
            desc.innerHTML = marker.info;
            wrapper.appendChild(desc);
        } else {
            if (marker.info.pic) {
                var pic = document.createElement('img');
                pic.className = 'pic';
                pic.src = marker.info.pic;
                wrapper.appendChild(pic);
            }

            if (marker.info.header) {
                var header = document.createElement('span');
                header.className = 'header';
                header.innerHTML = marker.info.header;
                wrapper.appendChild(header);
            }

            if (marker.info.details) {
                var details = document.createElement('div');
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

// IMAGES
var js = 'https://joystickinteractive.github.io/i/logo.png';
var mr = 'https://nargalzius.github.io/i/mapping/marker_red.png';
var mi = 'https://nargalzius.github.io/i/mapping/marker_blue.png';
var mg = 'https://nargalzius.github.io/i/mapping/marker_green.png';
var mb = 'https://nargalzius.github.io/i/mapping/marker_black.png';
var mo = 'https://nargalzius.github.io/i/mapping/marker_orange.png';
var mv = 'https://nargalzius.github.io/i/mapping/marker_purple.png';
var w1 = 'https://farm9.staticflickr.com/8864/18230308095_f67fbdf37d_q.jpg';
var w2 = 'https://farm8.staticflickr.com/7781/18370711672_d8cf45d927_q.jpg';
var w3 = 'https://farm8.staticflickr.com/7738/17346938444_cbba2bb3d2_q.jpg';
var w4 = 'https://farm9.staticflickr.com/8703/16970137454_3be4bdd7b0_q.jpg';
var w5 = 'https://farm9.staticflickr.com/8196/8089886408_bcced86bb6_q.jpg';

var tempobject = document.createElement('img');
tempobject.src = w4;

// TEXT
var h = 'Lorem ipsum dolor sit amet';
var d = 'Consectetur adipiscing elit.<br/>Qui potest igitur habitare in beata<br/>vita summi mali metus? Quem<br/>Tiberina descensio festo';

// MARKER
var markers = [
    // marker only
    {
        loc: '45.9615029,-108.6082415'
    },
    // with custom icon
    {
        loc: '36.8036157,-96.8528704',
        icon: mg
    },
    // with infoWindow, text (.info)
    {
        loc: '40.6752684,-86.9432024',
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
    {
        loc: '40.7384504,-73.9886937',
        icon: js,
        info: {
            url: 'http://joystickinteractive.com',
            name: 'Joystick'
        },
        events: {
            click: function(e) {

                var a = document.createElement('a');
                a.innerHTML = e.info.name;
                a.href = e.info.url;
                a.target = '_blank';

                map.infowindow_show(e, a);
            },
            dclick: function(e) {
                map.center(e.position);
            }
        }
    }, {
        loc: '47.6391668,-122.1287076',
        icon: 'http://res2.windows.microsoft.com/resbox/en/windows/main/eb4f0171-7cb7-428a-afcc-d93a6b84525c_33.png',
        info: {
            url: 'http://microsoft.com',
            name: 'Microsoft'
        },
        events: {
            click: function(e) {
                var a = document.createElement('a');
                a.innerHTML = e.info.name;
                a.href = e.info.url;
                a.target = '_blank';

                map.infowindow_show(e, a);
            },
            dclick: function(e) {
                map.center(e.position);
            }
        }
    }, {
        loc: '37.3303991,-122.0323321',
        icon: 'https://cdn3.iconfinder.com/data/icons/umar/Apple.png',
        info: "<a href='http://apple.com'>Apple Inc.</a>",
        // info: function() {
        //     var a = document.createElement('a');
        //         a.href = 'http://apple.com';
        //         a.innerHTML = 'Apple Inc.';
        //         a.target = '_blank';
        //     return a;
        // },
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

function trace(str) {
    console.log(str);
}