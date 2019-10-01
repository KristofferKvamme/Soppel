var map;
var directionsDisplay;
var directionsService;
let locations = [];
let filteredLocations = [];
let markers;
var imageBio = "m/png_4_recycling-bins_Brown_XSmall.png";
var imagePaper = "m/png_4_recycling-bins_Blue_XSmall.png";
var imageRest = "m/png_4_recycling-bins_Black_XSmall.png";
var imageMetall = "m/png_4_recycling-bins_Red_XSmall.png";
var markerCluster;
let infoContainerNumber = document.getElementById("containerNumber");
let infoCategory = document.getElementById("containerCategory");
let infoAddress = document.getElementById("containerAddress");
let infoFillHeight = document.getElementById("containerFillHeight");
let infoContainerCounter = document.getElementById("containerCounter");
let infoContainerDate = document.getElementById("containerDate");

function initMap(data) {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: new google.maps.LatLng(58.828897, 5.736545),
        mapTypeId: "terrain"
    });
    initDirections();
    getTrashInfo().then(data => placeTrash(data));
}

function initDirections() {
    directionsService = new google.maps.DirectionsService();
}

// Loop through the results array and place a marker for each
// set of coordinates.
function placeTrash(json) {
    let results = JSON.parse(json);
    for (var i = 0; i < results.length; i++) {
        let address = results[i].ADDRESS;
        let containerNumber = results[i].CONTAINERNUMBER;
        let counter = results[i].COUNTER;
        let date = results[i].DATE;
        let fillHeight = results[i].FILLHEIGHT;
        let trashType = results[i].FRACTION;
        let lat = results[i].LATITUDE;
        let lng = results[i].LONGITUDE;
        locations.push({
            address: address,
            containerNumber: containerNumber,
            counter: counter,
            date: date,
            fillHeight: fillHeight,
            trashType: trashType,
            lat: lat,
            lng: lng
        });
    }
    setMarkers();
}

function setMarkers() {
    markers = locations.map(function(sensor, i) {
        let marker = new google.maps.Marker({
            position: new google.maps.LatLng(sensor.lat, sensor.lng),
            icon: sensor.trashType == "Bio" ?
                imageBio : sensor.trashType == "Papir" ?
                imagePaper : sensor.trashType == "Restavfall" ?
                imageRest : sensor.trashType == "Glass/metall" ?
                imageMetall : null,
            category: sensor.trashType,
            date: sensor.date,
            fillHeight: sensor.fillHeight,
            address: sensor.address,
            containerNumber: sensor.containerNumber,
            containerCounter: sensor.counter
        });
        marker.addListener('click', function() {
            document.getElementsByClassName("infoPanel")[0].style.visibility = "visible";
            infoContainerNumber.innerHTML = marker.containerNumber;
            infoCategory.innerHTML = marker.category;
            infoAddress.innerHTML = marker.address;
            infoFillHeight.innerHTML = marker.fillHeight;
            infoContainerCounter.innerHTML = marker.containerCounter;
            infoContainerDate.innerHTML = marker.date;
        })
        return marker;
    });
    addMarkersToCluster(markers);
}

function addMarkersToCluster(markers) {
    markerCluster = new MarkerClusterer(map, markers, {
        imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    });
}

function filterMarkers() {
    let bioFilter = document.getElementById("filterBio").checked;
    let paperFilter = document.getElementById("filterPapir").checked;
    let restFilter = document.getElementById("filterRestavfall").checked;
    let glassAndMetalFilter = document.getElementById("filterGlassOgMetall").checked;
    let minFill =(2500 * document.getElementById("fillSlider").value / 100);
    let filteredMarkers = [];
    for (i = 0; i < markers.length; i++) {
        marker = markers[i];
        if (marker.fillHeight < minFill) continue;
        // If is same category or category not picked
        if (bioFilter && marker.category == "Bio" ||
            paperFilter && marker.category == "Papir" ||
            restFilter && marker.category == "Restavfall" ||
            glassAndMetalFilter && marker.category == "Glass/metall" ||
            !bioFilter && !paperFilter && !restFilter && !glassAndMetalFilter) {
            filteredMarkers.push(marker);
        }
    }
    markerCluster.clearMarkers();
    addMarkersToCluster(filteredMarkers);
    filteredLocations = filteredMarkers;
}

function changeValue() {
    document.getElementById("fillPercent").innerHTML = document.getElementById("fillSlider").value;
}

function getDirections() {
    var request = {
        travelMode: google.maps.TravelMode.DRIVING
    };

}