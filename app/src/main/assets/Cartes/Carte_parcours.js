// initialize the map
  var map = L.map('map').setView([44, 20.4651300], 8);  

  // load a tile layer
  L.tileLayer('https://api.mapbox.com/styles/v1/murmuration/ck2afd4vj24h01cs4gvvhe10b/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXVybXVyYXRpb24iLCJhIjoiY2sxN3F1Z29qMWV0dzNjcDNoaDVsODc0ciJ9.H2_bYweaK42jLplL87mE2A', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox.streets'
        }).addTo(map);

  //dynamic legend
  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    //this.update();
    return this._div;
  };

  /*info.update = function (props) {
    this._div.innerHTML = '<h5>Caractéristiques de la zone</h5>' +  (props ?
        'Water : ' + props.Water.toLocaleString() 
        + '<br/> Rurality :'  + props.Rurality.toLocaleString()
        + '<br/> ProtectedZ :'  + props.ProtectedZ.toLocaleString()
        : 'Passer la souris sur une zone');
  };*/

  info.addTo(map);

class select_cells {
  constructor(Water, Rurality, ProtectedZ){
    this.Water = Water;
    this.Rurality = Rurality;
    this.ProtectedZ = ProtectedZ;

  }
};

//roads layer
$.getJSON('https://raw.githubusercontent.com/coraliecoumes/serbie/master/SRB_roads.json', function (dataroad) {
  L.geoJson(dataroad,{
    style : function(feature){
      return{
        color : 'grey',
        weight: 2
      };
    }
  }).addTo(map);
});

var dessin = false;
var cells = [];
var mean_mean=0;
mapMarkers = [];
if (L.Browser.touch) {
      L.control.touchHover().addTo(map);
    }
  //load shapefile
  $.getJSON('Cartes/serbiaWithImage.json', function (data) {
    var geojson = L.geoJson(data, {
        style: style,
        onEachFeature: function (feature, layer) {
            var defaultStyle = layer.style;
            
            layer.on('click',function(e){ 
              for(var i = 0; i < mapMarkers.length & mapMarkers.length>1; i++){
                      map.removeLayer(mapMarkers[i]);
                  }
              if (mapMarkers.length > 1) {mapMarkers=[]};
              var marker = L.marker(e.latlng,{icon: greenIcon}).addTo(map);
              mapMarkers.push(marker);
                  this.setStyle({
                    color: 'red',
                    fillColor : 'red',
                    weight: 2,
                    dashArray : '',
                    fillOpacity: 0.7
                });
                cells = [];
                if(dessin == false) {
                  dessin = true;
                  geojson.resetStyle();
                  }
                else {dessin = false ;}
            });
            layer.on('mouseover', function(){
              if(dessin == true){
                    this.setStyle({
                    color: 'red',
                    fillColor : 'red',
                    weight: 2,
                    dashArray : '',
                    fillOpacity: 0.7
                });
                //info.update(layer.feature.properties);
                let id = new select_cells(layer.feature.properties.Water,
                                          layer.feature.properties.Rurality,
                                          layer.feature.properties.ProtectedZ);
                cells.push(id)
              }
            });

            layer.on('mouseup',function(e){
              //L.marker(e.latlng,{icon: greenIcon}).addTo(markerGroup);
              var mean_water = 0;
              var mean_rurality = 0;
              var mean_protect = 0;
              var mean_mean = 0
              for (let i = 0; i < cells.length; i++) {
                  mean_water += cells[i].Water;
                  mean_rurality += cells[i].Rurality;
                  mean_protect += cells[i].ProtectedZ;
                  mean_mean = mean_mean + cells[i].Water + cells[i].Rurality + cells[i].ProtectedZ;
                }
              mean_water /= cells.length;
              mean_rurality /= cells.length;
              mean_protect /= cells.length;
              mean_mean = mean_mean/(3*cells.length);
              if (dessin == true) {
                //alert('Water : ' + mean_water.toLocaleString() + '\n'
                //+ 'Rurality :'  + mean_rurality.toLocaleString() + '\n'
                //+ 'ProtectedZ :'  + mean_protect.toLocaleString() + '\n'
                //)

                var gouttes = '';
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
                }

                var etoiles = '';
                var texte = '';
                if (mean_mean==0) {
                  etoiles = 'Cartes/Illu_parcours/etoiles_0.png'
                  texte = 'Try again'
                } else if (mean_mean<=2) {
                  etoiles = 'Cartes/Illu_parcours/etoiles_1.png'
                  texte = 'Try again'
                } else if (mean_mean<=4) {
                  etoiles = 'Cartes/Illu_parcours/etoiles_2.png'
                  texte = 'You can do better'
                } else if (mean_mean<=6) {
                  etoiles = 'Cartes/Illu_parcours/etoiles_3.png'
                  texte = 'Good!'
                } else if (mean_mean<=8) {
                  etoiles = 'Cartes/Illu_parcours/etoiles_4.png'
                  texte = 'Bravo!'
                } else {
                  etoiles = 'Cartes/Illu_parcours/etoiles_5.png'
                  texte = 'Perfect!'
                }

                layer.bindPopup('<font size = "13"> <center>' + texte +'</center> </font> </br>'
                + '<center><img src=' + etoiles +'></center>'
                + '</br> '
                //+ '</br> Moyenne :' + mean_mean.toLocaleString()
                + '</br> <center> Details : </center>'
                + '</br> <img src=' + gouttes + '/>' 
                + '</br> Rurality :'  + mean_rurality.toLocaleString() 
                + '</br> ProtectedZ :'  + mean_protect.toLocaleString(),
                {minWidth: 350});
                }
            });
        }
    }).addTo(map);
});

  function style(feature) {
    return {
        fillColor: 'blue',
        weight: 2,
        opacity: 0,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0
    };
}

var greenIcon = L.icon({
    iconUrl : 'Cartes/Illu_parcours/icon-biodiversity.png',
    //iconUrl: 'https://github.com/coraliecoumes/serbie/blob/master/leaf-green.png?raw=true',
    //shadowUrl: 'https://github.com/coraliecoumes/serbie/blob/master/leaf-shadow.png?raw=true',

    iconSize:     [60, 60], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [19, 45], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -76] // point from which the popup should open relative to the iconAnchor
});

$.getJSON('Cartes/serbiaWithImage.json', function (dataURL) {
  
  //var i = 1;
  //console.log(dataURL['features'].length)
  for (var i = 0 ; i < dataURL['features'].length; i++){
    var overlay = L.imageOverlay(dataURL['features'][i]['properties']['pngURL_pri'],
                              [[dataURL['features'][i]['properties']['LatMax_pri'],dataURL['features'][i]['properties']['LongMin_pr']],
                              [dataURL['features'][i]['properties']['LatMin_pri'],dataURL['features'][i]['properties']['LongMax_pr']]]).addTo(map);
  }
});
