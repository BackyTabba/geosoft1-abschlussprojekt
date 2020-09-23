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

//Icon für den User-Standort
var positionMarker = L.icon({
  iconUrl: "../../icons/icon_location.png",
  iconAnchor: [30, 60],
  popupAnchor: [0, -50]
});
