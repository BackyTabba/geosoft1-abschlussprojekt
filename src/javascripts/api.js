var ApiArray = [];

function getClosestStops(){
    var apikey= "https://api.tfl.gov.uk/StopPoint?StopTypes=NaptanMetroStation&radius=2500&returnLines=true&lat=51.5&lon=-0.05&app_key=a2ae620183744041b714999e0eaacc1b"

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

            // console.log(JSON.parse(x.responseText));
            func(x,z);

        }
    }
    //console.dir(x);
    return actualcallback;
}

function showStops(response) {

  //View auf London setzen
  benutzerFahrtMap.setView([51.5, -0.05], 12);

  var ApiData = JSON.parse(response.responseText);
  for (g of ApiData.stopPoints) {
    if(g.modes.includes("tube") == true){
      ApiArray[ApiArray.length] = [g.commonName, coordinates1 = [g.lat,g.lon], g.id];
    }
  }
  console.log(ApiArray);
  addMarkers(ApiArray);

}
function getArrivals(id){
  var apikey2 = "https://api.tfl.gov.uk/StopPoint/"+id+"/arrivals"
  document.getElementById("tableBody").innerHTML = "";
  openRequest(apikey2, showArrivals);
}

function showArrivals(response){
  var ApiData2 = JSON.parse(response.responseText);
  var ApiArray2 = [];
  for (g of ApiData2) {
      ApiArray2[ApiArray2.length] = [g.lineName, g.destinationName, g.expectedArrival, g.timeToStation, g.vehicleId, g.id];
    }
  var index=0;
  //das Array nach Abfahrtszeit sortieren
  ApiArray2.sort(function(a, b) {
    return a[3] - b[3];
  })
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

    document.getElementById("anzeigeFahrten").innerHTML = "errorcallback: check web-console";
}

function loadcallback() {
}
