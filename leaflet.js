var mymap = L.map('map').setView([51.5, -0.05], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoiam9zaGJhZyIsImEiOiJja2Fuc2FjNGYxaGpiMnpwaXQ4Y2RtZ2NrIn0.cA-St9daA5FOcPXJ2hBMJw'
}).addTo(mymap);

//creating a layer group for the markers and adding it to the map
var markerGroup = L.layerGroup();
mymap.addLayer(markerGroup);

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
    markerGroup.addLayer(L.marker(correctArray[i]).bindPopup(array[i][2]).on('click', onClick));
  }

}

function onClick(e) {
  console.log(e);
  getArrivals(e.target._popup._content);
}
//creating an icon for the user location marker
var positionMarker = L.icon({
  iconUrl: "icon_location.png",
  iconAnchor: [30, 60],
  popupAnchor: [0, -50]
});

//setting the view to the user location
//mymap.locate({setView: true, maxZoom: 16});

/**
 * @desc Function to show the user position if possible
 *
 * @param e
 */
function onLocationFound(e) {
    L.marker(e.latlng, {icon: positionMarker}).addTo(mymap).bindPopup("You are here!");
}

mymap.on('locationfound', onLocationFound);
