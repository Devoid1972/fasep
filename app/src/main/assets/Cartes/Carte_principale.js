// initialize the map
var map = L.map('map').setView([44, 20.8], 8);

map.options.minZoom = 7;
map.options.maxZoom = 11;
map.options.bounceAtZoomLimits = false;
map.options.zoomSnap = 1;
map.options.touchZoom = 'center';
map.options.zoomDelta = 1;

// load a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/murmuration/ck2afd4vj24h01cs4gvvhe10b/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXVybXVyYXRpb24iLCJhIjoiY2sxN3F1Z29qMWV0dzNjcDNoaDVsODc0ciJ9.H2_bYweaK42jLplL87mE2A', {
          attribution: 'Map data &copy; Murmuration',
          id: 'mapbox.streets'
          }).addTo(map);

//load countries around serbia json
var countries_around = Android.loadJSONFromAsset('Data/Serbia_pays_frontalier.geojson');
var serbia_pays_frontalier = JSON.parse(countries_around);

L.geoJSON(serbia_pays_frontalier,{
    style:style,
    onEachFeature : function (feature, layer){
        var label = L.marker(feature.properties.coor_label,{
            icon : L.divIcon({
                className : 'label',
                html : feature.properties.ADMIN,
                iconSize:[100,40]
            })
        }).addTo(map);
    }
}).addTo(map);

//load json
var leMessi = Android.loadJSONFromAsset('Data/serbiaWithImage.json');
var serbiaWithImagejson = JSON.parse(leMessi);

//polygon layer
//L.geoJSON(serbiaWithImagejson,{
//    style: style,
//    onEachFeature: function (feature, layer) {
//        var defaultStyle = layer.style;
//    }
//}).addTo(map);

function style(feature) {
    return {
        weight: 2,
        opacity : 1,
        color: '#444444',
        dashArray: '0',
        fillOpacity : 0
    };
}

//fill polygon with images
for (var i = 0 ; i < serbiaWithImagejson['features'].length; i++){
    var overlay = L.imageOverlay(serbiaWithImagejson['features'][i]['properties']['pngURL_pri'],
                              [[serbiaWithImagejson['features'][i]['properties']['LatMax_pri'],serbiaWithImagejson['features'][i]['properties']['LongMin_pr']],
                              [serbiaWithImagejson['features'][i]['properties']['LatMin_pri'],serbiaWithImagejson['features'][i]['properties']['LongMax_pr']]],{zIndex:200}).addTo(map);
}

var data_points = {
"type": "FeatureCollection",
"name": "Serbia_villes_principales",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
{ "type": "Feature", "properties": { "is_in_coun": "Serbia", "name": "Нови Сад", "name_en": "Novi Sad", "name_fr": "Novi Sad", "name_sr-La": "Novi Sad", "place": "city", "population": 250439.0 }, "geometry": { "type": "Point", "coordinates": [ 19.8451756, 45.2551338 ] } },
{ "type": "Feature", "properties": { "is_in_coun": "Serbia", "name": "Београд", "name_en": "Belgrade", "name_fr": "Belgrade", "name_sr-La": "Beograd", "place": "city", "population": 1166763.0 }, "geometry": { "type": "Point", "coordinates": [ 20.4568974, 44.8178131 ] } },
{ "type": "Feature", "properties": { "is_in_coun": "Serbia", "name": "Ниш", "name_en": "Niš", "name_fr": "Niš", "name_sr-La": "Niš", "place": "city", "population": 183164.0 }, "geometry": { "type": "Point", "coordinates": [ 21.8959232, 43.3211301 ] } },
{ "type": "Feature", "properties": { "is_in_coun": "Serbia", "name": "Крагујевац", "name_en": "Kragujevac", "name_fr": "Kragujevac", "name_sr-La": "Kragujevac", "place": "city", "population": 150835.0 }, "geometry": { "type": "Point", "coordinates": [ 20.91877, 44.0125745 ] } },
{ "type": "Feature", "properties": { "is_in_coun": "Kosovo", "name": "Prishtinë", "name_en": "Pristina", "name_fr": "Pristina", "name_sr-La": "Priština", "place": "city", "population": 145149.0 }, "geometry": { "type": "Point", "coordinates": [ 21.1640849, 42.6638771 ] } }
]
}

var pointLayer = L.geoJSON(null, {
  pointToLayer: function(feature,latlng){
    label = String(feature.properties.name_en)
    return new L.CircleMarker(latlng, {
      radius: 0.1,
    }).bindTooltip(label, {permanent: true, direction: "center", className: "my-labels"}).openTooltip();
    }
  });
pointLayer.addData(data_points);
map.addLayer(pointLayer);