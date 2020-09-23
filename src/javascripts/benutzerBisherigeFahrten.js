
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

var ArrayFahrten = [];

/**
 * @desc Funktion um alle bisherigen Fahrten des Nutzers darzustellen
 *
 *
 */
function showUserFahrten()
{
$.get("localhost:3000/user/FindAllFahrten");

dataFahrten = JSON.parse(response.responseText);
for (g of dataFahrten) {
  //Alle nötigen Informationen in Array abspeichern (nicht alle werden angezeigt)
    ArrayFahrten[ArrayFahrten.length] = [g.lineName, g.stationsname, [g.Lat, g.Long], g.einstiegszeit, g.FahrtID, g.endstation];
  }

//Daten in ein Array bekommen
addMarkers(arrayFahrten);
}

/**
 * @desc Funktion die getArrivals für die angeklickte Station ausführt
 *
 * @param e - angeklicktes Element (Leaflet-Marker einer MetroStation)
 */
function onClick(e) {
  console.log(e);
  var id;
  document.getElementById("tableBody").innerHTML = "";
  for (f of ArrayFahrten) {
      //Vergleich der "commonNames" der Stationen mit dem des Popups um die gewählte Station zu erkennen
    if (f[1]  == e.target._popup._content){
      ArrayStationFahrten[ArrayStationFahrten.length] = [f[0], f[4], f[6], f[5]];
    }
  }
  showBisherigeFahrten(ArrayStationFahrten);
}

/**
 * @desc Funktion um die bisherigen Abfahrten des Nutzers an der gewählten MetroStation zu zeigen
 *
 * @param array - Array gefüllt mit allen bisherigen Abfahrten des Nutzers an der gewählten Station
 */
function showBisherigeFahrten(array){
  //Erstellen der HTML-Tabellen-Elemente mit den Informationen und eines Buttons um eine Fahrt auszuwählen
  for (f of array) {
    var row = document.createElement("tr");
    row.id ="fahrt"+index;
    var element = document.getElementById("tableBody");
    element.appendChild(row);
    var tableLine = document.createElement("td");
    var node = document.createTextNode(f[0]);
    tableLine.appendChild(node);
    var tableArrival = document.createElement("td");
    node = document.createTextNode(f[1].substr(11, 8));
    tableDestination.appendChild(node);
    var tableDestination = document.createElement("td");
    node = document.createTextNode(f[2]);
    tableArrival.appendChild(node);
    var currentRow = document.getElementById("abfahrt"+index);
    currentRow.appendChild(tableLine);
    currentRow.appendChild(tableArrival);
    currentRow.appendChild(tableDestination);
    index ++;
    }
    if(array.length == 0)
    {
      document.getElementById("anzeigeFahrten").style.display = "none";
    }
    else
    document.getElementById("anzeigeFahrten").style.display = "block";
  }
