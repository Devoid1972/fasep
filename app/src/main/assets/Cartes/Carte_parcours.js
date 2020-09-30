// initialize the map
var map = L.map('map').setView([44, 20.8], 8);

map.options.minZoom = 7;
map.options.maxZoom = 11;
map.options.bounceAtZoomLimits = false;
map.options.zoomSnap = 1;
map.options.touchZoom = 'center';
map.options.zoomDelta = 1;
//map.options.zoomControl = false;

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

//load json
var leMessi = Android.loadJSONFromAsset('serbiaWithImage.json');
var serbiaWithImagejson = JSON.parse(leMessi);

//cell class to store all selected polygons info
class select_cells {
  constructor(Water, Rurality, ProtectedZ){
    this.Water = Water;
    this.Rurality = Rurality;
    this.ProtectedZ = ProtectedZ;

  }
};

//roads layer
/*$.getJSON('https://raw.githubusercontent.com/coraliecoumes/serbie/master/SRB_roads.json', function (dataroad) {
  L.geoJson(dataroad,{
    style : function(feature){
      return{
        color : 'grey',
        weight: 2
      };
    }
  }).addTo(map);
});*/

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

        /*var gouttes = '';
        if (mean_water==0) {
            gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_0.png?raw=true'
        } else if (mean_water<=2) {
            gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_1.png?raw=true'
        } else if (mean_water<=4) {
            gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_2.png?raw=true'
        } else if (mean_water<=6) {
            gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_3.png?raw=true'
        } else if (mean_water<=8) {
            gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_4.png?raw=true'
        } else {
            gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_5.png?raw=true'
        }*/

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
            texte = 'Too bad'
        } else if (score<=3) {
            etoiles = 'Cartes/Illu_parcours/etoiles_1.png'
            texte = 'Try again'
        } else if (score<=6) {
            etoiles = 'Cartes/Illu_parcours/etoiles_2.png'
            texte = 'You can do better'
        } else if (score<=9) {
            etoiles = 'Cartes/Illu_parcours/etoiles_3.png'
            texte = 'Good!'
        } else if (score<=12) {
            etoiles = 'Cartes/Illu_parcours/etoiles_4.png'
            texte = 'Nice job!'
        } else {
            etoiles = 'Cartes/Illu_parcours/etoiles_5.png'
            texte = 'Perfect!'
        }

        var popup = L.popup({'className' : 'popupCustom'})
            .setLatLng(e.latlng)
            .setContent('<font size = "13"> <center>' + texte +'</center> </font>' //+'</br>'
                        + '<center><img src=' + etoiles +'></center>'
                        + '</br> <hr> <center> TERRITORIAL HEALTH </center><hr>'
                        //+ 'Moyenne :' + mean_mean.toLocaleString()
                        + 'Water Pressure :'  + '<img src=' + goutte +' height="30"></br>Forest Preservation :'
                        + '<img src=' + arbre +' height="30"></br> Urbanisation :'
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

for (var i = 0 ; i < serbiaWithImagejson['features'].length; i++){
    var overlay = L.imageOverlay(serbiaWithImagejson['features'][i]['properties']['pngURL_pri'],
                              [[serbiaWithImagejson['features'][i]['properties']['LatMax_pri'],serbiaWithImagejson['features'][i]['properties']['LongMin_pr']],
                              [serbiaWithImagejson['features'][i]['properties']['LatMin_pri'],serbiaWithImagejson['features'][i]['properties']['LongMax_pr']]]).addTo(map);
}
