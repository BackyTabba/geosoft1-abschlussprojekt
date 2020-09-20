
var benutzerFahrtMap = L.map('mapNeueFahrt', {
  layers: [worldStreetMap]
});

L.control.layers(baseMaps).addTo(benutzerFahrtMap);

benutzerFahrtMap.locate({ setView: true, maxZoom: 20 });


var markerGroup = L.layerGroup();
benutzerFahrtMap.addLayer(markerGroup);

/**
 * @desc Function to create the markers of the busstops on the leaflet map
 *
 * @param array - array filled with the 15 nearest busstops
 */
function addMarkers(array){
  //delete the markers from the last try
  markerGroup.clearLayers();

  //helping array to swap lat and long
  var correctArray = [];
  for(var i = 0; i < array.length; i++){
    correctArray.push(['']);
    correctArray[i][0]= array[i][1][0];
    correctArray[i][1]= array[i][1][1];
    //creating the markers and adding them to the map
    markerGroup.addLayer(L.marker(correctArray[i]).bindPopup(array[i][0]).on('click', onClick));
  }

}

function onClick(e) {
  console.log(e);
  var id;
  for (f of ApiArray) {
    if (f[0]  == e.target._popup._content)
      id = f[2];
  }
  getArrivals(id);
}

//creating an icon for the user location marker
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
