// initialize the map
var map = L.map('map').setView([44, 20.8], 8);

// load a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/murmuration/ck2afd4vj24h01cs4gvvhe10b/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXVybXVyYXRpb24iLCJhIjoiY2sxN3F1Z29qMWV0dzNjcDNoaDVsODc0ciJ9.H2_bYweaK42jLplL87mE2A', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox.streets'
          }).addTo(map);

//load json
var leMessi = Android.loadJSONFromAsset('serbiaWithImage.json');
var serbiaWithImagejson = JSON.parse(leMessi);

//polygon layer
L.geoJSON(serbiaWithImagejson,{
    style: style,
    onEachFeature: function (feature, layer) {
        var defaultStyle = layer.style;
    }
}).addTo(map);

function style(feature) {
    return {
        weight: 1,
        opacity : 0,
        color: 'white',
        dashArray: '3',
        fillOpacity : 0
    };
}

//fill polygon with images
for (var i = 0 ; i < serbiaWithImagejson['features'].length; i++){
    var overlay = L.imageOverlay(serbiaWithImagejson['features'][i]['properties']['pngURL_pri'],
                              [[serbiaWithImagejson['features'][i]['properties']['LatMax_pri'],serbiaWithImagejson['features'][i]['properties']['LongMin_pr']],
                              [serbiaWithImagejson['features'][i]['properties']['LatMin_pri'],serbiaWithImagejson['features'][i]['properties']['LongMax_pr']]]).addTo(map);
}
