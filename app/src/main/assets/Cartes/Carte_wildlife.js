 var map = L.map('map').setView([44, 20.4651300], 8); 

 //console.log(document.getElementsByClassName('scrollmenu')[1]);
var nomAnimal= '';
//url = 'Cartes/animaux_vegetaux.csv'
mapMarkers = [];

function doalert(obj) {
        //alert(obj.getAttribute("src"));
  for(var i = 0; i < mapMarkers.length & mapMarkers.length>1; i++){
                      map.removeLayer(mapMarkers[i]);
                  }
  if (mapMarkers.length > 1) {mapMarkers=[]};

  nomAnimal=obj.getAttribute("src");
        //var select = document.getElementsByID('#');

  var animalIcon = L.icon({
    iconUrl: nomAnimal,
    iconSize:     [35, 35], // size of the icon
    iconAnchor:   [17, 35], // point of the icon which will correspond to marker's location
  });

  //d3.csv(url, function (data) {
  $.getJSON('Cartes/animaux_vegetaux.json', function (data) {
    var markers = L.markerClusterGroup({
      iconCreateFunction: function(cluster) {
        return L.divIcon({
          html: cluster.getChildCount()+'<img src=' + nomAnimal + ' , width = 50 >',
          className: 'mycluster',
          iconSize: L.point(35, 20)
        }); 
      }
    })

    for(var i = 0; i < data.length; i++){
      if (data[i].url == nomAnimal) {
        var marker = L.marker([data[i].decimalLatitude, data[i].decimalLongitude], {icon: animalIcon});  
        markers.addLayer(marker);
        mapMarkers.push(marker);
      }      
    }
    map.addLayer(markers);
    mapMarkers.push(markers);
  })

        return false;
    }

console.log(nomAnimal);
 
//console.log(document.getElementsByClassName('scrollmenu').getAttribute('src'))
  // load a tile layer
  L.tileLayer('https://api.mapbox.com/styles/v1/murmuration/ck2afd4vj24h01cs4gvvhe10b/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXVybXVyYXRpb24iLCJhIjoiY2sxN3F1Z29qMWV0dzNjcDNoaDVsODc0ciJ9.H2_bYweaK42jLplL87mE2A', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox.streets'
        }).addTo(map);

$.getJSON('https://raw.githubusercontent.com/coraliecoumes/serbie/master/serbiaWithURL.json', function (data) {
    var geojson = L.geoJson(data, {
        style: style,
        onEachFeature: function (feature, layer) {
            var defaultStyle = layer.style;
            //info.update(layer.feature.properties)   
        }
    }).addTo(map);
});

  function style(feature) {
    return {
        fillColor: getColor(feature.properties.pngURL),
        weight: 1,
        opacity: 0.2,
        color: 'grey',
        dashArray: '3',
        fillOpacity: 0.2}
}

function getColor(d) {
    return d == 'https://github.com/coraliecoumes/serbie/blob/master/Carte%20principale/Tile-Foret@300x.png?raw=true'  ? '#4C5B2D' :
           d == 'https://github.com/coraliecoumes/serbie/blob/master/Carte%20principale/Tile-Champ@300x.png?raw=true'  ? '#EDEF46' :
           d == 'https://github.com/coraliecoumes/serbie/blob/master/Carte%20principale/Tile-Urban@300x.png?raw=true'  ? '#666666' :
           d == 'https://github.com/coraliecoumes/serbie/blob/master/Carte%20principale/Tile-Rural@300x.png?raw=true'  ? '#999999' :
           d == 'https://github.com/coraliecoumes/serbie/blob/master/Carte%20principale/Tile-Montagne@300x.png?raw=true'   ? '#FFFFFF' :
                      '#99C25A';
}

//url = 'https://raw.githubusercontent.com/coraliecoumes/serbie/master/animaux_vegetaux.csv'

//var animalIcon = L.icon({
//    iconUrl: nomAnimal,
//    iconSize:     [35, 35], // size of the icon
//    iconAnchor:   [17, 35], // point of the icon which will correspond to marker's location
//});



/*d3.csv(url, function (data) {
  var markers = L.markerClusterGroup({
  iconCreateFunction: function(cluster) {
    return L.divIcon({
      html: cluster.getChildCount()+'<img src= https://github.com/coraliecoumes/serbie/blob/master/lapin.png?raw=true, width = 50 >',
      className: 'mycluster',
      iconSize: L.point(35, 20)
    });
   
  }
}); */

/*  for(var i = 0; i < data.length; i++){
    if (data[i].species == 'Aquila clanga') {

      var marker = L.marker([data[i].decimalLatitude, data[i].decimalLongitude], {icon: animalIcon});  
      markers.addLayer(marker);
    }      
  }
  map.addLayer(markers);
}) */