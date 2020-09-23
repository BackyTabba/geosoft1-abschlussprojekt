
var benutzerFahrtMap = L.map('mapNeueFahrt', {
  layers: [worldStreetMap]
});

L.control.layers(baseMaps).addTo(benutzerFahrtMap);

benutzerFahrtMap.locate({ setView: true, maxZoom: 20 });


var markerGroup = L.layerGroup();
benutzerFahrtMap.addLayer(markerGroup);

//Variable in die der Arrayeintrag der ausgewählten Station gespeichert wird
var pointer = [];

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
    if (f[0]  == e.target._popup._content){
      id = f[2];
      pointer = f;
    }
  }
  getArrivals(id);
}

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
