$(function(){
    let location = {lat:"53",lng:"-2"};
    getWeather(location);
});

function getWeather(location){
    console.log(location);
    console.log("http://api.openweathermap.org/data/2.5/forecast?lat="+location.lat+"&lon="+location.lng+"&appid="+apiKey.openWeather)
    $.ajax({
        dataType: "json",
        url: "http://api.openweathermap.org/data/2.5/forecast?lat="+location.lat+"&lon="+location.lng+"&appid="+apiKey.openWeather,
        traditional: true,
        success: function(result){
            console.log(result);
            $.each(result.list,function(){
                console.log(this);
            })
            /*var data = result.Locations.Location;
            console.log(data);
            $.each(data,function(){
                $('#combobox').append('<option value="'+this.id+'">'+this.name+'</option>');
            })*/
        },
        error:function(jqXHR, textStatus,errorThrown){
            alert(textStatus.toUpperCase() + " : " + this.url);
        }
    })
    $.ajax({
        dataType: "json",
        url: "http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/all?res=3hourly&key=7b4266aa-1e1c-451e-b764-0021561a2662",
        traditional: true,
        success: function(result){
            var data = result.SiteRep.DV.Location;
            // console.log(data);
            $.each(data,function(){
                //if(this.i="3840")
                    //  console.log(this);
            })
        },
        error:function(jqXHR, textStatus,errorThrown){
            alert(textStatus.toUpperCase() + " : " + this.url);
        }
    })
}

function initMap() {
    var uluru = {
        lat: 53.37465,
        lng: -2.20808
    };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: uluru
    });

    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });

    // Search Box
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

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
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}