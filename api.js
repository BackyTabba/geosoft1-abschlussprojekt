function getClosestStops(){
    var apikey= "https://api.tfl.gov.uk/StopPoint?StopTypes=NaptanMetroStation&radius=3000&returnLines=true&lat=51.5&lon=-0.05&app_key=a2ae620183744041b714999e0eaacc1b"

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

  var ApiData = JSON.parse(response.responseText);
  var ApiArray = [];
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
  openRequest(apikey2, showArrivals);
}

function showArrivals(response){
  var ApiData2 = JSON.parse(response.responseText);
  var ApiArray2 = [];
  for (g of ApiData2) {
      ApiArray2[ApiArray2.length] = [g.lineName, g.destinationName, g.expectedArrival, g.vehicleId];
    }
  console.log(ApiArray2);
  var index=0;
  for (f of ApiArray2) {
    outres=f[0]+"  "+f[1]+"  "+f[2]+"  "+f[3];

    var subresult = document.createElement("div");
    subresult.id="stop"+index;
    var node = document.createTextNode(outres);
    subresult.appendChild(node);
    var element = document.getElementById("content2");
    element.appendChild(subresult);
    index++;
    }
}
function errorcallback(e) {

    document.getElementById("content").innerHTML = "errorcallback: check web-console";
}

function loadcallback() {
}
