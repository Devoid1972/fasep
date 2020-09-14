  // initialize the map
  var map = L.map('map').setView([44, 20.4651300], 8);  

  // load a tile layer
  L.tileLayer('https://api.mapbox.com/styles/v1/murmuration/ck2afd4vj24h01cs4gvvhe10b/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXVybXVyYXRpb24iLCJhIjoiY2sxN3F1Z29qMWV0dzNjcDNoaDVsODc0ciJ9.H2_bYweaK42jLplL87mE2A', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox.streets'
        }).addTo(map);

/*
  //dynamic legend
  var info = L.control();

  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
  };

  info.update = function (props) {
    this._div.innerHTML = '<h5>Caractéristiques de la zone</h5>' +  (props ?
        '<b>' + 'id : ' + props.id + '</b><br />' 
        + 'i_water : ' + props.i_water.toLocaleString() 
        + '<br/> i_aqi_02 :'  + props.i_aqi_02.toLocaleString()
        + '<br/> i_rurality :'  + props.i_rurality.toLocaleString()
        + '<br/> i_protect :'  + props.i_protect.toLocaleString()
        + '<br/> i_ecotouri :'  + props.i_ecotouri.toLocaleString()
        : 'Passer la souris sur une zone');
  };

  info.addTo(map);
*/

  //load shapefile
  $.getJSON('Cartes/serbiaWithImage.json', function (data) {
    //$.getJSON('serbiaWithImage.json', function (data) {
    //var data = JSON.parse(serbiaWithImage.json);
    //var geojson = new L.GeoJSON.AJAX('serbiaWithImage.json');
    var geojson = L.geoJson(data, {
    //geojson.on('data:loaded', function(){
        style: style,
        onEachFeature: function (feature, layer) {
            var defaultStyle = layer.style;

            /*layer.on('click', function (e) {
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
            });*/
        }
    }).addTo(map);
});


  function style(feature) {
    return {
        //fillColor: 'blue',
        weight: 1,
        //opacity: 1,
        opacity : 0,
        color: 'white',
        dashArray: '3',
        //fillOpacity: 1
        fillOpacity : 0
    };
}


//affichage des coordonnées sur la carte
/*var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

function testAffichage(latIn, lonIn) {
    console.log(latIn,lonIn);
}
map.on('click', onMapClick);

//affichage des coordonnées du click dans la console
map.on('click', function(e){
  var coord = e.latlng;
  lat = coord.lat;
  lng = coord.lng;
  console.log("You clicked the map at latitude: " + lat + " and longitude: " + lng);
  testAffichage(lat,lng);
  });*/

//inclure une image dans un hexagone
//var overlay = L.imageOverlay('Cartes/Bio_carte_principale/Tile-Foret@300x.png',
//                            [[45.94921576371568, 18.692548823758553], [45.82415604324296, 18.900005852199982]])
//                            .addTo(map);

$.getJSON('Cartes/serbiaWithImage.json', function (dataURL) {
  
  //var i = 1;
  //console.log(dataURL['features'].length)
  for (var i = 0 ; i < dataURL['features'].length; i++){
    var overlay = L.imageOverlay(dataURL['features'][i]['properties']['pngURL_pri'],
                              [[dataURL['features'][i]['properties']['LatMax_pri'],dataURL['features'][i]['properties']['LongMin_pr']],
                              [dataURL['features'][i]['properties']['LatMin_pri'],dataURL['features'][i]['properties']['LongMax_pr']]]).addTo(map);
  }
});