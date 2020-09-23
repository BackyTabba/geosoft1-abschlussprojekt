var ApiArray = [];
var ApiArray2 = [];

function getClosestStops(){
    var apikey= "https://api.tfl.gov.uk/StopPoint?StopTypes=NaptanMetroStation&radius=2500&returnLines=true&lat=51.5&lon=-0.05"

    openRequest(apikey, showStops);
}
/**
 * open an API-Request and execute a function with parameters on the response. (Event/ajax) No return value
 * @param resource - Link of the API
 * @param func - function to executed on the Response
 * @param{optional} z -  Parameter to give in the func
 */
function openRequest(resource,func,z) {
    if(z==undefined) z="";

    var x = new XMLHttpRequest();
    x.onload = loadcallback;
    x.onerror = errorcallback;
    x.onreadystatechange = statechangecallback(func,x,z);
    x.open("GET", resource, true);
    x.send();
}

function statechangecallback(func,x,z) { //mit parameter response
    if(z==undefined) z="";
    function actualcallback(){
        if (x.status == "200" && x.readyState == 4) {

            func(x,z);

        }
    }
    return actualcallback;
}
/**
 * @desc Funktion um die erhaltenen MetroStations aus der API zu filtern und in ein Array zu füllen
 *
 * @param response
 */
function showStops(response) {

  //View auf London setzen
  benutzerFahrtMap.setView([51.5, -0.05], 12);

  var ApiData = JSON.parse(response.responseText);
  for (g of ApiData.stopPoints) {
    //nur MetroStations nehmen, an denen eine Linie des Typs "tube" fährt
    if(g.modes.includes("tube") == true){
      //die nötigen Infos über die Station in das Array schreiben (Name, Position, ID)
      ApiArray[ApiArray.length] = [g.commonName, coordinates1 = [g.lat,g.lon], g.id];
    }
  }
  console.log(ApiArray);
  addMarkers(ApiArray);

}
/**
 * @desc Funktion um die Ankünfte an der gewählten MetroStation abzufragen
 *
 * @param id - ID der gewählten MetroStation
 */
function getArrivals(id){
  var apikey2 = "https://api.tfl.gov.uk/StopPoint/"+id+"/arrivals"
  document.getElementById("tableBody").innerHTML = "";
  openRequest(apikey2, showArrivals);
}

/**
 * @desc Funktion um die Ankünfte an der gewählten MetroStation anzuzeigen
 *
 * @param response
 */
function showArrivals(response){
  ApiArray2 = [];
  var ApiData2 = JSON.parse(response.responseText);
  for (g of ApiData2) {
    //Alle nötigen Informationen in Array abspeichern (nicht alle werden angezeigt)
      ApiArray2[ApiArray2.length] = [g.lineName, g.destinationName, g.expectedArrival, g.timeToStation, g.vehicleId, g.id];
    }
  var index=0;
  //das Array nach Abfahrtszeit sortieren
  ApiArray2.sort(function(a, b) {
    return a[3] - b[3];
  })
  //Erstellen der HTML-Tabellen-Elemente mit den Informationen und eines Buttons um eine Fahrt auszuwählen
  for (f of ApiArray2) {
    var row = document.createElement("tr");
    row.id ="abfahrt"+index;
    var element = document.getElementById("tableBody");
    element.appendChild(row);
    var tableLine = document.createElement("td");
    var node = document.createTextNode(f[0]);
    tableLine.appendChild(node);
    var tableDestination = document.createElement("td");
    node = document.createTextNode(f[1]);
    tableDestination.appendChild(node);
    var tableArrival = document.createElement("td");
    node = document.createTextNode(f[2].substr(11, 8));
    tableArrival.appendChild(node);
    var tableChoose = document.createElement("td");
    var btnChoose = document.createElement("button");
    node = document.createTextNode("Diese Fahrt nehmen");
    btnChoose.id = index;
    btnChoose.addEventListener("click", function() {
    saveGastFahrt(this.id)
  },true);
    btnChoose.appendChild(node);
    tableChoose.appendChild(btnChoose);
    var currentRow = document.getElementById("abfahrt"+index);
    currentRow.appendChild(tableLine);
    currentRow.appendChild(tableDestination);
    currentRow.appendChild(tableArrival);
    currentRow.appendChild(tableChoose);
    index ++;
    }
  if(ApiArray2.length == 0)
  {
    document.getElementById("anzeigeAbfahrten").style.display = "none";
  }
  else
  document.getElementById("anzeigeAbfahrten").style.display = "block";
}

function errorcallback(e) {

    document.getElementById("anzeigeAbfahrten").innerHTML = "errorcallback: check web-console";
}

function loadcallback() {
}

/**
 * @desc Funktion um die ausgewählte Fahrt in der GastFahrt-Tabelle zu speichern
 *
 * @param id - Zeigt an, welche "Zeile" des ApiArray2 genutzt werden muss
 */
function saveGastFahrt(id){
  console.log(pointer);
  console.log(ApiArray);
  console.log(ApiArray2);
  let gastfahrtinfo = {};
  gastfahrtinfo.FahrtID=ApiArray2[id][5];
  gastfahrtinfo.stationsname=pointer[2];
  gastfahrtinfo.Lat=pointer[1][0];
  gastfahrtinfo.Long=pointer[1][1];
  gastfahrtinfo.einstiegszeit=ApiArray2[id][2];
  gastfahrtinfo.endstation=ApiArray2[id][1];
  console.log(gastfahrtinfo);
  $.post("localhost:3000/user/AddUserToFahrt",[gastfahrtinfo])
  saveFahrt(id);
/**
$.ajax({
  type: "POST",
  url: "localhost:3000/user/AddUserToFahrt",
  data: gastfahrtinfo
});
*/
}

/**
 * @desc Funktion um die ausgewählte Fahrt in der Fahrt-Tabelle zu speichern
 *
 * @param id - Zeigt an, welche "Zeile" des ApiArray2 genutzt werden muss
 */
function saveFahrt(id){
  let fahrtinfo = {};
  fahrtinfo.FahrtID=ApiArray2[id][5];
  fahrtinfo.endstation=ApiArray2[id][1];
  fahrtinfo.Risiko = false;
  fahrtinfo.lininenname=ApiArray2[id][0];
  console.log(fahrtinfo);

  $.post( "localhost:3000/user/AddFahrt",[fahrtinfo])
  document.getElementById("tableBody").innerHTML = "";
  document.getElementById("anzeigeAbfahrten").style.display = "none";
}
