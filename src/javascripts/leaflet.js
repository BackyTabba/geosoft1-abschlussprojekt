//Initialisieren der Leaflet-Karte mit drei Basemaps
var mapLink = '<a href="http://www.esri.com/">Esri</a>';

var satelliteMap = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '&copy; ' + mapLink,
  maxZoom: 20,
});
var topoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: ''
});

var worldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: ''
});

var baseMaps = {
  "Satellite": satelliteMap,
  "Topographic": topoMap,
  "WSM": worldStreetMap
};

/**
 * @desc Funktion um die Marker der MetroStations auf der Karte zu erstellen
 *
 * @param array - Array, gefüllt mit den MetroStations im Radius
 */
function addMarkers(array){
  //Die Marker vom letzten mal löschen
  markerGroup.clearLayers();

  //Hilfsarray um Lat und Long zu tauschen
  var correctArray = [];
  for(var i = 0; i < array.length; i++){
    correctArray.push(['']);
    correctArray[i][0]= array[i][1][0];
    correctArray[i][1]= array[i][1][1];
    //Erstellen der Marker und hinzufügen zur Karte
    markerGroup.addLayer(L.marker(correctArray[i]).bindPopup(array[i][0]).on('click', onClick));
  }

}

//Icon für den User-Standort
var positionMarker = L.icon({
  iconUrl: "../../icons/icon_location.png",
  iconAnchor: [30, 60],
  popupAnchor: [0, -50]
});
