//Gerüst aus Musterlösung
class MapInterface{
    constructor(params){
        // Parameter: view?,zoom?,mapid,basemap(maxzoom?,attribution?)
        //initialise the map view from the given coordinates
        if( params.mapid === undefined ||
            params.baseMap === undefined ||
            params.baseMap.tileLayer === undefined
        ){
            console.log("couldn't initialise map-interface. invalid parameters");
            return false;
        }

        let mapid = params.mapid;
        let view = params.view || [0,0];
        let zoom = params.zoom || 6;
        let baseMap = params.baseMap;

        this.map = L.map(mapid).setView(view, zoom);

        this.baseMapLayer = L.tileLayer(
            baseMap.tileLayer, {
                maxZoom : baseMap.maxZoom || 15,
                attribution : baseMap.attribution || ""
            });
        this.baseMapLayer.addTo(this.map);



        //create arrays that contain easily accessible "pointers" to all features of
        //each dataset
        //create groups wherein all the features of diffrent datasets will be contained


        //Gruppen

        //====================================================================================================================
        this.busStopIndex = [];
        this.busStopGroup = new L.LayerGroup().addTo(this.map);
        this.routesIndex = [];
        this.routesGroup = new L.LayerGroup().addTo(this.map);
        this.heatMap = null;
        this.heatMapGroup = new L.LayerGroup().addTo(this.map);
        this.userPositionLayer = new L.LayerGroup().addTo(this.map);

        //====================================================================================================================
        //add custom icons
        this.addIcons();

        //add layer-controls to the map
        this.overlayMaps = {
            "User-position" : this.userPositionLayer,
            "Bus-stops" : this.busStopGroup,
            "Bus-stop density" : this.heatMapGroup
        };

        L.control.layers(null,this.overlayMaps).addTo(this.map);


    }

    /**
     * @desc function that creates all different icons for different map elements
     */
    addIcons(){
        this.busStopIcon = L.icon({
            iconUrl: 'images/icons/BusStopIcon.png',
            iconSize: [10, 10],
            iconAnchor: [5,5]
        });
    }

    /**
     * @desc clear Bus stops
     * @desc removes all markers from the map when called
     */
    clearBusStops(){
        //empty the indices and featureGroups
        this.busStopIndex = [];
        this.busStopGroup.clearLayers();
    }

    /**
     * @desc adds bus stops to the map
     * @param {GeoJSON} featureCollection
     */
    addBusStops(featureCollection){
        const busStopOpacity = 0.4;

        for(let feature of featureCollection.features){
            let markerCoords = [feature.geometry.coordinates[1],
                feature.geometry.coordinates[0]];
            let markerProperties = feature.properties;

            let marker = L.marker(markerCoords,
                //marker options
                {
                    opacity : busStopOpacity,
                    riseOnHover: true}
            );

            //set cosmetics of the bus stop markers
            marker.setIcon(this.busStopIcon);
            marker.on('mouseover', (e)=>{
                marker.setOpacity(1.0);
            });
            marker.on('mouseout', (e)=>{
                marker.setOpacity(busStopOpacity);
            });

            //bind popup
            marker.bindPopup(`
          <b>${markerProperties.lbez}</b><br>
          <ul>
            <li>richtung: ${markerProperties.richtung}</li>
            <li>nr: ${markerProperties.nr}</li>
            <button class="button" type="button"
            onclick="
            DocumentInterface.showDepartures(${markerProperties.nr}, '${markerProperties.lbez}');
            DocumentInterface.scrollToElement('mainMap')
            ">
            show departures</button>
          </ul>
        `);

            //add the marker to markergroup, so it shows up on the map
            this.busStopIndex.push(marker);
            this.busStopGroup.addLayer(marker);
        }
    }

    /**
     * @desc clear Bus stops
     * @desc removes all markers from the map when called
     */
    clearRoutes(){
        //empty the indices and featureGroups
        this.routesIndex = [];
        this.routesGroup.clearLayers();
    }

    /**
     * @desc adds a route to the map
     * @param {GeoJSON} feature GeoJSON of type lineString
     */
    addRoute(feature){
        let route = L.geoJSON(feature);
        this.routesIndex.push(route);
        this.routesGroup.addLayer(route);

    }

    /**
     * @desc updates the user Location when called.
     * is called from reresh()
     * @param {GeoJSON} geoJSON describing the point where the user is.
     */
    updateUserLocation(geoJSON){
        this.userPositionLayer.clearLayers();
        let positionMarker = L.geoJSON(geoJSON);
        this.userPositionLayer.addLayer(positionMarker);
    }

    /**
     * @desc sets the heatmap when called.
     * @param {GeoJSON} featureCollection collection of points.
     */
    setHeatmap(featureCollection, radius){
        var coordinates = [];
        for(let feature of featureCollection.features){
            coordinates.push([feature.geometry.coordinates[1],
                feature.geometry.coordinates[0]]);
        }
        this.heatMap = L.heatLayer(coordinates, {radius: radius});
        this.heatMapGroup.addLayer(this.heatMap);
    }

}
