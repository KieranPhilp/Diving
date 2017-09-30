var markers = [];
var map;
var recentLocations = [];

$(function () {

    let location = {
        lat: "53",
        lng: "-2"
    };
    //getTideData(location);
});

function getTideData(location) {
    $.ajax({
        dataType: "json",
        url: "https://www.worldtides.info/api?heights&extremes&lat="+location.lat+"&lon="+location.lng+"&length=1209600&key=f7b4b411-4b5d-49a8-9693-c6c741ada3b6",
        success: function (result) {
            console.log(result);
            var ctx = $('#tideData');
            var previousGetDate = "";
            var str = "<ul id='tideUL'>";
            $('#tideGraph').html();
            $.each(result.heights,function(){
                //this.date => "2017-10-14T00:30+0000"
                //this.dt => 1507941000
                //this.height => -2.328
                var date = new Date(this.date);
                var dateString = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " - " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                console.log(dateString);
                if(date.getDate() != previousGetDate)
                {
                    str += "<li><a>"+date.toString().split(' ')[0]+" "+date.getDate()+"-"+date.toLocaleString("en-us",{"month":"short"})+"</a></li>";
                }
                
                previousGetDate = date.getDate();
                
               /* <br>
                <canvas id="tideData" width="400" height="400"></canvas>*/
            })
            str += "</ul>";
            $('#tideGraph').append(str);
            var table = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    }
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(textStatus.toUpperCase() + " : " + this.url);
        }
    })
}
function addToRecentLocations(name,location)
{
    $('#recentLocations').append("<dd>\
                                    <a href='#' onClick='getTideData({lat:"+location.lat()+",lng:"+location.lng()+"})'>"+name+"</a>\
                                    <span>\
                                        <i>Remove</i>\
                                    </span>\
                                </dd>");
    //<dd>
    //  <a href="/public/weather/tide-times/gcuw1jbeg">Lunderston Bay (Beach)</a>
    //  <span data-geohash="gcuw1jbeg">
    //      <i class="icon" data-type="utility" data-value="cross" data-color="blue">Remove</i>
    //  </span>
    //</dd>
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

        getTideData({
            lat:places[0].geometry.location.lat(),
            lng:places[0].geometry.location.lng()
        })
        addToRecentLocations(places[0].name, places[0].geometry.location);
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
    //console.log(e.latLng.lat());
}

function deleteMarkers(){
    markers.forEach(function (marker) {
        marker.setMap(null);
    });
    markers = [];
}