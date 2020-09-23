
var arztFahrtensucheMap = L.map('mapFahrtensuche', {
  center:[51.5, -0.05],
  zoom: 12,
  layers: [worldStreetMap]
});

L.control.layers(baseMaps).addTo(arztFahrtensucheMap);



function showAllFahrten(){
$.ajax({
  type: "GET",
  url: "localhost:3000/arzt/FindAllFahrten",
});
}
