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


if (L.Browser.touch) {
    var drawerControl = new L.control.touchHover();
    drawerControl.addTo(map);
    drawerControl._toggle(new Event("click"));
}

L.Path.CLIP_PADDING = 0.12;

//dynamic legend
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = ''
};

info.addTo(map);

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

//load json
var leMessi = Android.loadJSONFromAsset('Data/serbiaWithImage.json');
var serbiaWithImagejson = JSON.parse(leMessi);

L.geoJson(serbiaWithImagejson, {
    style : styledupays
}).addTo(map);

function styledupays(feature) {
    return {
        fillColor: getColor(feature.properties.pngURL_pri),
        weight: 1,
        opacity: 0.2,
        color: 'grey',
        dashArray: '3',
        fillOpacity: 1}
}

function getColor(d) {
    return d == 'Cartes/Bio_carte_principale/Tile-Foret@300x.png'  ? '#B7B99A' :
           d == 'Cartes/Bio_carte_principale/Tile-Champ@300x.png'  ? '#E8E89D' :
           d == 'Cartes/Bio_carte_principale/Tile-Urban@300x.png'  ? '#C1BCAB' :
           d == 'Cartes/Bio_carte_principale/Tile-Rural@300x.png'  ? '#D1CBBB' :
           d == 'Cartes/Bio_carte_principale/Tile-Montagne@300x.png'   ? '#F0EAD9' :
                      '#CBDAA7';
}

//load road layer
var roads = Android.loadJSONFromAsset('Data/SRB_roads.json');
var serbia_roads = JSON.parse(roads);

L.geoJson(serbia_roads,{
                          style : function(feature){
                            return{
                              color : '#767676',
                              weight: 1
                            };
                          }
                        }).addTo(map);

//add city labels layer
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
    label = String(feature.properties['name_sr-La'])
    return new L.CircleMarker(latlng, {
      radius: 0.001, color: 'grey'
    }).bindTooltip(label, {permanent: true, direction: "center", className: "my-labels"}).openTooltip();
    }
  });
pointLayer.addData(data_points);
map.addLayer(pointLayer);


//cell class to store all selected polygons info
class select_cells {
  constructor(Water, Rurality, ProtectedZ){
    this.Water = Water;
    this.Rurality = Rurality;
    this.ProtectedZ = ProtectedZ;

  }
};

var dessin = false;
var cells = [];
var mean_mean=0;
mapMarkers = [];

var geojson;

 function style(feature) {
   return {
        fillColor: 'red',
        weight: 2,
        opacity: 0,
        color: 'red',
        dashArray: '3',
        fillOpacity: 0
   };
}

function highlightFeature(e) {
	var layer = e.target;
	layer.setStyle({
	    weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});
	if (!L.Browser.ie) {
		layer.bringToFront();
	}
	info.update(layer.feature.properties);
	let id = new select_cells(layer.feature.properties.Water,
                              layer.feature.properties.Rurality,
                              layer.feature.properties.ProtectedZ);
    cells.push(id)
};

function onEachFeature(feature,layer){
    layer.on('mouseup', function(e){
        var marker = L.marker(e.latlng,{icon: greenIcon}).addTo(map);
        mapMarkers.push(marker);
        var mean_water = 0;
        var mean_rurality = 0;
        var mean_protect = 0;
        var mean_mean = 0
        for (let i = 0; i < cells.length; i++) {
            mean_water += 3*cells[i].Water;
            mean_rurality += 3*cells[i].Rurality;
            mean_protect += cells[i].ProtectedZ;
            mean_mean = mean_mean + 3*cells[i].Water + 3*cells[i].Rurality + cells[i].ProtectedZ;
        };
        mean_water /= 3*cells.length;
        mean_rurality /= 3*cells.length;
        mean_protect /= cells.length;
        mean_mean = mean_mean/(7*cells.length);

        var goutte = '';
        var goutte_score = 0
        if (mean_water==0) {
            goutte = 'Cartes/Illu_popup/goutte_0.png'
            goutte_score = 0
        } else if (mean_water<=4) {
            goutte = 'Cartes/Illu_popup/goutte_1.png'
            goutte_score = 1
        } else if (mean_water<=5) {
            goutte = 'Cartes/Illu_popup/goutte_2.png'
            goutte_score = 2
        } else if (mean_water<=6) {
            goutte = 'Cartes/Illu_popup/goutte_3.png'
            goutte_score = 3
        } else if (mean_water<=7) {
            goutte = 'Cartes/Illu_popup/goutte_4.png'
            goutte_score = 4
        } else {
            goutte = 'Cartes/Illu_popup/goutte_5.png'
            goutte_score = 5
        }

        var arbre = '';
        var arbre_score = 0;
        if (mean_protect==0) {
            arbre = 'Cartes/Illu_popup/arbre_0.png'
            arbre_score = 0
        } else if (mean_protect<=1) {
            arbre = 'Cartes/Illu_popup/arbre_1.png'
            arbre_score = 1
        } else if (mean_protect<=2) {
            arbre = 'Cartes/Illu_popup/arbre_2.png'
            arbre_score = 2
        } else if (mean_protect<=3) {
            arbre = 'Cartes/Illu_popup/arbre_3.png'
            arbre_score = 3
        } else if (mean_protect<=4) {
            arbre = 'Cartes/Illu_popup/arbre_4.png'
            arbre_score = 4
        } else {
            arbre = 'Cartes/Illu_popup/arbre_5.png'
            arbre_score = 5
        }

        var urban = '';
        var urban_score = 0
        if (mean_rurality>9.9) {
            urban = 'Cartes/Illu_popup/urban_0.png'
            urban_score = 5
        } else if (mean_rurality>9.1) {
            urban = 'Cartes/Illu_popup/urban_1.png'
            urban_score = 4
        } else if (mean_rurality>8.3) {
            urban = 'Cartes/Illu_popup/urban_2.png'
            urban_score = 3
        } else if (mean_rurality>7.5) {
            urban = 'Cartes/Illu_popup/urban_3.png'
            urban_score = 2
        } else if (mean_rurality>7) {
            urban = 'Cartes/Illu_popup/urban_4.png'
            urban_score = 1
        } else {
            urban = 'Cartes/Illu_popup/urban_5.png'
            urban_score = 0
        }

        var etoiles = '';
        var texte = '';
        var score = goutte_score + arbre_score + urban_score
        if (score==0) {
            etoiles = 'Cartes/Illu_parcours/etoiles_0.png'
            texte = 'šteta'
        } else if (score<=3) {
            etoiles = 'Cartes/Illu_parcours/etoiles_1.png'
            texte = 'Pokušajte ponovo'
        } else if (score<=6) {
            etoiles = 'Cartes/Illu_parcours/etoiles_2.png'
            texte = 'Možete bolje '
        } else if (score<=9) {
            etoiles = 'Cartes/Illu_parcours/etoiles_3.png'
            texte = 'Dobro'
        } else if (score<=12) {
            etoiles = 'Cartes/Illu_parcours/etoiles_4.png'
            texte = 'Dobar posao'
        } else {
            etoiles = 'Cartes/Illu_parcours/etoiles_5.png'
            texte = 'Savršeno'
        }

        var popup = L.popup({'className' : 'popupCustom'})
            .setLatLng(e.latlng)
            .setContent('<font size = "13"> <center>' + texte +'</center> </font>' //+'</br>'
                        + '<center><img src=' + etoiles +'></center>'
                        + '</br> <hr> <center> ZDRAVLJE OBLASTI </center><hr>'
                        + 'Pritisak vode :'  + '<img src=' + goutte +' height="30"></br>Očuvanost šuma :'
                        + '<img src=' + arbre +' height="30"></br> Urbanizacija :'
                        +  '<img src=' + urban +' height="30">')
            .openOn(map);
    })


    layer.on('mousedown', function(e){
        for(var i = 0; i < mapMarkers.length & mapMarkers.length>1; i++){
                    map.removeLayer(mapMarkers[i]);
                }
        var marker = L.marker(e.latlng,{icon: greenIcon}).addTo(map);
        mapMarkers.push(marker);
        geojson.resetStyle();
        cells = [];
        map.closePopup();
    });

    layer.on({
        mouseover : highlightFeature,
    });
}


geojson = L.geoJson(serbiaWithImagejson, {
    style : style,
    onEachFeature : onEachFeature
}).addTo(map);


var greenIcon = L.icon({
    iconUrl : 'Cartes/Illu_parcours/icon-biodiversity.png',
    iconSize:     [60, 60], // size of the icon
    iconAnchor:   [19, 45], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -76] // point from which the popup should open relative to the iconAnchor
});

//for (var i = 0 ; i < serbiaWithImagejson['features'].length; i++){
//    var overlay = L.imageOverlay(serbiaWithImagejson['features'][i]['properties']['pngURL_pri'],
//                              [[serbiaWithImagejson['features'][i]['properties']['LatMax_pri'],serbiaWithImagejson['features'][i]['properties']['LongMin_pr']],
//                              [serbiaWithImagejson['features'][i]['properties']['LatMin_pri'],serbiaWithImagejson['features'][i]['properties']['LongMax_pr']]]).addTo(map);
//}
