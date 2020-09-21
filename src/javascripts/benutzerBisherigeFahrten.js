
var benutzerFahrtMap = L.map('mapBisherigeFahrten', {
  layers: [worldStreetMap]
});

L.control.layers(baseMaps).addTo(benutzerFahrtMap);

benutzerFahrtMap.locate({ setView: true, maxZoom: 20 });
