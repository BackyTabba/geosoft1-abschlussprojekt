
var benutzerAlleFahrtenMap = L.map('mapBisherigeFahrten', {
  layers: [worldStreetMap]
});

L.control.layers(baseMaps).addTo(benutzerAlleFahrtenMap);

benutzerAlleFahrtenMap.locate({ setView: true, maxZoom: 20 });

benutzerAlleFahrtenMap.on('locationfound', onLocationFound);

/**
 * @desc Funktion um die Nutzerposition zu ermitteln
 *
 * @param e
 */
function onLocationFound(e) {
    L.marker(e.latlng, {icon: positionMarker}).addTo(benutzerAlleFahrtenMap).bindPopup("You are here!");
    showUserFahrten();
}


/**
 * @desc Funktion um alle bisherigen Fahrten des Nutzers darzustellen
 *
 * @param e
 */
function showUserFahrten(){
$.get("http://localhost:3000/user/FindAllFahrten");
}
