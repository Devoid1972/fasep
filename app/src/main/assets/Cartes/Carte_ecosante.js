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
        'i_water : ' + props.Water.toLocaleString() 
        + '<br/> i_rurality :'  + props.Rurality.toLocaleString()
        + '<br/> i_protect :'  + props.ProtectedZ.toLocaleString()
        : 'Passer la souris sur une zone');
  };*/
  /*info.update = function (props) {
    this._div.innerHTML = '' 
  };*/

  info.addTo(map);

  //load shapefile
  $.getJSON('Cartes/serbiaWithImage.json', function (data) {
    var geojson = L.geoJson(data, {
        style: style,
        onEachFeature: function (feature, layer) {
            var defaultStyle = layer.style;

            layer.on('click', function (e) {
                this.setStyle({
                    color: 'lightblue',
                    fillColor : 'lightblue',
                    weight: 2,
                    dashArray : '',
                    fillOpacity: 0.7
                });
                //info.update(layer.feature.properties)
            });
            layer.on('mouseout', function (e) {
                geojson.resetStyle();
                //info.update()
            });
           
           var gouttes = '';
           if (feature.properties.Water==0) {
             gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_0.png?raw=true'
            } else if (feature.properties.Water<=2) {
             gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_1.png?raw=true'
            } else if (feature.properties.Water<=4) {
             gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_2.png?raw=true'
            } else if (feature.properties.Water<=6) {
             gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_3.png?raw=true'
            } else if (feature.properties.Water<=8) {
             gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_4.png?raw=true'
            } else {
             gouttes = 'https://github.com/coraliecoumes/serbie/blob/master/gouttes_5.png?raw=true'
            }
           layer.bindPopup('<img src=' + gouttes + '/></br> Image zone protégée'+ '</br> Image urbanisation');
        }
    }).addTo(map);
});

//geojson.bindPopup()
//layer.bindPopup('<h1>'+feature.properties.f1+'</h1><p>name: '+feature.properties.f2+'</p>');

  function style(feature) {
    return {
        //fillColor: 'blue',
        weight:1,
        opacity: 0,
        //color: 'white',
        dashArray: '3',
        fillOpacity: 0
    };
}

//affichage des coordonnées sur la carte
//var popup = L.popup();

//function onMapClick(e) {
//    popup
//        .setLatLng(e.latlng)
//        .setContent("You clicked the map at " + e.latlng.toString())
//        .openOn(map);
//}

//function testAffichage(latIn, lonIn) {
//    console.log(latIn,lonIn);
//}
//map.on('click', onMapClick);

//affichage des coordonnées du click dans la console
//map.on('click', function(e){
//  var coord = e.latlng;
//  lat = coord.lat;
//  lng = coord.lng;
//  console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
//  testAffichage(lat,lng);
//  });

//inclure une image dans un hexagone
//var overlay = L.imageOverlay('https://github.com/coraliecoumes/serbie/blob/master/hexa_test.png?raw=true',
//                            [[45.94921576371568, 18.692548823758553], [45.82415604324296, 18.900005852199982]])
//                            .addTo(map);

/*$.getJSON('https://raw.githubusercontent.com/coraliecoumes/serbie/master/serbiaEcoWithURL.json', function (dataURL) {
  
  //var i = 1;
  console.log(dataURL['features'].length)
  for (var i = 0 ; i < dataURL['features'].length; i++){
    var overlay = L.imageOverlay(dataURL['features'][i]['properties']['pngURL'],
                              [[dataURL['features'][i]['properties']['LongMax'],dataURL['features'][i]['properties']['LatMax']],
                              [dataURL['features'][i]['properties']['LongMin'],dataURL['features'][i]['properties']['LatMin']]]).addTo(map);
  }
});*/

$.getJSON('Cartes/serbiaWithImage.json', function (dataURL) {

  for (var i = 0 ; i < dataURL['features'].length; i++){
    var overlay = L.imageOverlay(dataURL['features'][i]['properties']['pngURL_eco'],
                              [[dataURL['features'][i]['properties']['LatMax_eco'],dataURL['features'][i]['properties']['LongMin_ec']],
                              [dataURL['features'][i]['properties']['LatMin_eco'],dataURL['features'][i]['properties']['LongMax_ec']]]).addTo(map);
  }
});
