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
   style:stylepays,
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

function stylepays(feature) {
   return {
       weight:2,
       opacity: 1,
       color: '#444444',
       dashArray: '0',
       fillOpacity: 0
   };
}

//load cities in serbia json
var serbia_cities_raw = Android.loadJSONFromAsset('Data/SRB_stops.geojson');
var serbia_cities = JSON.parse(serbia_cities_raw);
var city_zone = map.createPane('city_zone')
map.getPane('city_zone').style.zIndex = 500;

var cityjson = L.geoJSON(serbia_cities,{
   style:stylecities,
   onEachFeature: function (feature, layer) {
        var defaultStyle = layer.style;

        layer.on('click', function (e) {
            cityjson.resetStyle();
            this.setStyle({
                color: '#444444',
                fillColor : 'green',
                weight: 2,
                dashArray : '',
                fillOpacity: 0.7
                    });
                });

        var goutte = '';
        if (feature.properties.watermean==0) {
            goutte = 'Cartes/Illu_popup/goutte_0.png'
        } else if (feature.properties.watermean<=4) {
            goutte = 'Cartes/Illu_popup/goutte_1.png'
        } else if (feature.properties.watermean<=5) {
            goutte = 'Cartes/Illu_popup/goutte_2.png'
        } else if (feature.properties.watermean<=6) {
            goutte = 'Cartes/Illu_popup/goutte_3.png'
        } else if (feature.properties.watermean<=7) {
            goutte = 'Cartes/Illu_popup/goutte_4.png'
        } else {
            goutte = 'Cartes/Illu_popup/goutte_5.png'
        }

        var arbre = '';
        if (feature.properties.protectedZmean==0) {
            arbre = 'Cartes/Illu_popup/arbre_0.png'
        } else if (feature.properties.protectedZmean<=1) {
            arbre = 'Cartes/Illu_popup/arbre_1.png'
        } else if (feature.properties.protectedZmean<=2) {
            arbre = 'Cartes/Illu_popup/arbre_2.png'
        } else if (feature.properties.protectedZmean<=3) {
            arbre = 'Cartes/Illu_popup/arbre_3.png'
        } else if (feature.properties.protectedZmean<=4) {
            arbre = 'Cartes/Illu_popup/arbre_4.png'
        } else {
            arbre = 'Cartes/Illu_popup/arbre_5.png'
        }

        var urban = '';
        if (feature.properties.ruralitymean>=9.9) {
            urban = 'Cartes/Illu_popup/urban_0.png'
        } else if (feature.properties.ruralitymean>9.1) {
            urban = 'Cartes/Illu_popup/urban_1.png'
        } else if (feature.properties.ruralitymean>8.3) {
            urban = 'Cartes/Illu_popup/urban_2.png'
        } else if (feature.properties.ruralitymean>7.5) {
            urban = 'Cartes/Illu_popup/urban_3.png'
        } else if (feature.properties.ruralitymean>7) {
            urban = 'Cartes/Illu_popup/urban_4.png'
        } else {
            urban = 'Cartes/Illu_popup/urban_5.png'
        }

        var titre = '';
        if (feature.properties.Indicator != null ) {
            titre = 'Focus on '+ feature.properties.Indicator + ' indicator'
        }
        layer.bindPopup('<h2><center>'+ feature.properties['name:en'] +'</center></h2><hr>'
                                  + 'Water Pressure :'  + '<img src=' + goutte +' height="30"></br>Forest Preservation :'
                                  + '<img src=' + arbre +' height="30"></br> Urbanisation :'
                                  +  '<img src=' + urban +' height="30"><hr><h2><center>' + titre
                                  + '</center></h2></br>'+ feature.properties.texte, {'className' : 'popupCustom'});
   },
   pane: city_zone
}).addTo(map)


function stylecities(feature) {
   return {
       weight:2,
       opacity: 1,
       color: '#444444',
       fillColor : '#444444',
       dashArray: '0',
       fillOpacity: 0.3
   };
}

//load json
var leMessi = Android.loadJSONFromAsset("Data/serbiaWithImage.json");
var serbiaWithImagejson = JSON.parse(leMessi);

for (var i = 0 ; i < serbiaWithImagejson['features'].length; i++){
   var overlay = L.imageOverlay(serbiaWithImagejson['features'][i]['properties']['pngURL_eco'],
                             [[serbiaWithImagejson['features'][i]['properties']['LatMax_eco'],serbiaWithImagejson['features'][i]['properties']['LongMin_ec']],
                             [serbiaWithImagejson['features'][i]['properties']['LatMin_eco'],serbiaWithImagejson['features'][i]['properties']['LongMax_ec']]],{zIndex:200}).addTo(map);
}
