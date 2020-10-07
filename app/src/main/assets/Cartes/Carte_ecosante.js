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

//dynamic legend
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    return this._div;
};

info.addTo(map);

//load json
var leMessi = Android.loadJSONFromAsset("serbiaWithImage.json");
var serbiaWithImagejson = JSON.parse(leMessi);

//load shapefile
var geojson = L.geoJson(serbiaWithImagejson, {
    style: style,
    onEachFeature: function (feature, layer) {
        var defaultStyle = layer.style;

        layer.on('click', function (e) {
            geojson.resetStyle();
            this.setStyle({
                color: 'green',
                fillColor : 'green',
                weight: 2,
                dashArray : '',
                fillOpacity: 0.7
            });
        });
           
           var goutte = '';
           if (feature.properties.Water==0) {
             goutte = 'Cartes/Illu_popup/goutte_0.png'
            } else if (feature.properties.Water<=4) {
             goutte = 'Cartes/Illu_popup/goutte_1.png'
            } else if (feature.properties.Water<=5) {
             goutte = 'Cartes/Illu_popup/goutte_2.png'
            } else if (feature.properties.Water<=6) {
             goutte = 'Cartes/Illu_popup/goutte_3.png'
            } else if (feature.properties.Water<=7) {
             goutte = 'Cartes/Illu_popup/goutte_4.png'
            } else {
             goutte = 'Cartes/Illu_popup/goutte_5.png'
            }

            var arbre = '';
            if (feature.properties.ProtectedZ==0) {
                arbre = 'Cartes/Illu_popup/arbre_0.png'
            } else if (feature.properties.ProtectedZ<=1) {
                arbre = 'Cartes/Illu_popup/arbre_1.png'
            } else if (feature.properties.ProtectedZ<=2) {
                arbre = 'Cartes/Illu_popup/arbre_2.png'
            } else if (feature.properties.ProtectedZ<=3) {
                arbre = 'Cartes/Illu_popup/arbre_3.png'
            } else if (feature.properties.ProtectedZ<=4) {
                arbre = 'Cartes/Illu_popup/arbre_4.png'
            } else {
                arbre = 'Cartes/Illu_popup/arbre_5.png'
            }

            var urban = '';
            if (feature.properties.Rurality>=9.9) {
                urban = 'Cartes/Illu_popup/urban_0.png'
            } else if (feature.properties.Rurality>9.1) {
                urban = 'Cartes/Illu_popup/urban_1.png'
            } else if (feature.properties.Rurality>8.3) {
                urban = 'Cartes/Illu_popup/urban_2.png'
            } else if (feature.properties.Rurality>7.5) {
                urban = 'Cartes/Illu_popup/urban_3.png'
            } else if (feature.properties.Rurality>7) {
                urban = 'Cartes/Illu_popup/urban_4.png'
            } else {
                urban = 'Cartes/Illu_popup/urban_5.png'
            }

           layer.bindPopup('<center> TERRITORIAL HEALTH </center><hr>'
                           + 'Water Pressure :'  + '<img src=' + goutte +' height="30"></br>Forest Preservation :'
                           + '<img src=' + arbre +' height="30"></br> Urbanisation :'
                           +  '<img src=' + urban +' height="30">', {'className' : 'popupCustom'});
        }
    }).addTo(map);

function style(feature) {
    return {
        weight:1,
        opacity: 0,
        dashArray: '3',
        fillOpacity: 0
    };
}

for (var i = 0 ; i < serbiaWithImagejson['features'].length; i++){
    var overlay = L.imageOverlay(serbiaWithImagejson['features'][i]['properties']['pngURL_eco'],
                              [[serbiaWithImagejson['features'][i]['properties']['LatMax_eco'],serbiaWithImagejson['features'][i]['properties']['LongMin_ec']],
                              [serbiaWithImagejson['features'][i]['properties']['LatMin_eco'],serbiaWithImagejson['features'][i]['properties']['LongMax_ec']]]).addTo(map);
}

