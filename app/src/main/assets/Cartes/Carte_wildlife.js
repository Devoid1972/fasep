// initialize the map
var map = L.map('map').setView([44, 20.8], 8);

map.options.minZoom = 7;
map.options.maxZoom = 11;
map.options.bounceAtZoomLimits = false;
map.options.zoomSnap = 1;
map.options.touchZoom = 'center';
map.options.zoomDelta = 1;

var nomAnimal= '';
mapMarkers = [];

//load wildlife data
var datawild = Android.loadJSONFromAsset('animaux_vegetaux.json');
var datawildjson = JSON.parse(datawild);

//marker clusters for selected filter
function doalert(obj) {
  for(var i = 0; i < mapMarkers.length & mapMarkers.length>1; i++){
                      map.removeLayer(mapMarkers[i]);
  }
  if (mapMarkers.length > 1) {mapMarkers=[]};

  nomAnimal=obj.getAttribute("src");

  var animalIcon = L.icon({
    iconUrl: nomAnimal,
    iconSize:     [35, 35], // size of the icon
    iconAnchor:   [17, 35], // point of the icon which will correspond to marker's location
  });

  var markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
        return L.divIcon({
            html: cluster.getChildCount()+'<img src=' + nomAnimal + ' , width = 50 >',
            className: 'mycluster',
            iconSize: L.point(35, 20)
        }); 
    }
  })

  for(var i = 0; i < datawildjson.length; i++){
    if (datawildjson[i].url == nomAnimal) {
        var marker = L.marker([datawildjson[i].decimalLatitude, datawildjson[i].decimalLongitude], {icon: animalIcon});
        $('.description').html('<h3>'+ datawildjson[i].species_en +' :</h3>'+"<p>"+datawildjson[i].description_en+"</p>");
        markers.addLayer(marker);
        mapMarkers.push(marker);
    }
  }

  map.addLayer(markers);
  mapMarkers.push(markers);

  return false;
}

// load a tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/murmuration/ck2afd4vj24h01cs4gvvhe10b/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoibXVybXVyYXRpb24iLCJhIjoiY2sxN3F1Z29qMWV0dzNjcDNoaDVsODc0ciJ9.H2_bYweaK42jLplL87mE2A', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: 'mapbox.streets'
}).addTo(map);

//load json
var leMessi = Android.loadJSONFromAsset('serbiaWithImage.json');
var serbiaWithImagejson = JSON.parse(leMessi);

//polygon layer
L.geoJson(serbiaWithImagejson, {
    style: style,
    onEachFeature: function (feature, layer) {
        var defaultStyle = layer.style;
    }
}).addTo(map);

function style(feature) {
    return {
        fillColor: getColor(feature.properties.pngURL_pri),
        weight: 1,
        opacity: 0.2,
        color: 'grey',
        dashArray: '3',
        fillOpacity: 0.2}
}

function getColor(d) {
    return d == 'Cartes/Bio_carte_principale/Tile-Foret@300x.png'  ? '#4C5B2D' :
           d == 'Cartes/Bio_carte_principale/Tile-Champ@300x.png'  ? '#EDEF46' :
           d == 'Cartes/Bio_carte_principale/Tile-Urban@300x.png'  ? '#666666' :
           d == 'Cartes/Bio_carte_principale/Tile-Rural@300x.png'  ? '#999999' :
           d == 'Cartes/Bio_carte_principale/Tile-Montagne@300x.png'   ? '#FFFFFF' :
                      '#99C25A';
}