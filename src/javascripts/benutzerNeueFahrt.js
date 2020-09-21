
var benutzerFahrtMap = L.map('mapNeueFahrt', {
  layers: [worldStreetMap]
});

L.control.layers(baseMaps).addTo(benutzerFahrtMap);

benutzerFahrtMap.locate({ setView: true, maxZoom: 20 });


var markerGroup = L.layerGroup();
benutzerFahrtMap.addLayer(markerGroup);

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

//Variable in die der Arrayeintrag der ausgewählten Station gespeichert wird
var pointer;

/**
 * @desc Funktion die getArrivals für die angeklickte Station ausführt
 *
 * @param e - angeklicktes Element (Leaflet-Marker einer MetroStation)
 */
function onClick(e) {
  console.log(e);
  var id;
  //Vergleich der "commonNames" der Stationen mit dem des Popups um die gewählte Station zu erkennen
  for (f of ApiArray) {
    if (f[0]  == e.target._popup._content)
      id = f[2];
      pointer = f;
  }
  getArrivals(id);
}

//Icon für den User-Standort
var positionMarker = L.icon({
  iconUrl: "../../icons/icon_location.png",
  iconAnchor: [30, 60],
  popupAnchor: [0, -50]
});

/**
 * @desc Function to show the user position if possible
 *
 * @param e
 */
function onLocationFound(e) {
    L.marker(e.latlng, {icon: positionMarker}).addTo(benutzerFahrtMap).bindPopup("You are here!");
    getClosestStops();
}

benutzerFahrtMap.on('locationfound', onLocationFound);
