var markers = [];
var map;

$(function () {

    let location = {
        lat: "53",
        lng: "-2"
    };
    //getTideData(location);
});

function getTideData(location) {
    $.getJSON("https://www.worldtides.info/api?heights&extremes&lat=53&lon=-2&length=1209600&key=f7b4b411-4b5d-49a8-9693-c6c741ada3b6", function (e) {
        console.log(e);
    })
    $.ajax({
        dataType: "json",
        url: "https://www.worldtides.info/api?heights&extremes&lat=53&lon=-2&length=1209600&key=f7b4b411-4b5d-49a8-9693-c6c741ada3b6",
        success: function (result) {
            console.log(result);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: {lat:53.37465, lng: -2.20808}
    });

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    
    map.addListener('click',function(e){
        placeMarker(e);
    });

    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        deleteMarkers();
        console.log(places);
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            addMarker
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) 
            {
                bounds.union(place.geometry.viewport);
            } 
            else 
            {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}
function addMarker(location){

}
function placeMarker(e){
    console.log(e.latLng.lat());
}

function deleteMarkers(){
    markers.forEach(function (marker) {
        marker.setMap(null);
    });
    markers = [];
}