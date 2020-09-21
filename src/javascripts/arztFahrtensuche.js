
var arztFahrtensucheMap = L.map('mapFahrtensuche', {
  layers: [worldStreetMap]
});

L.control.layers(baseMaps).addTo(arztFahrtensucheMap);

arztFahrtensucheMap.locate({ setView: true, maxZoom: 20 });
