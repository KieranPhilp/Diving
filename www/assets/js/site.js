$(function () {
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    if(isMobile.any())
        window.localStorage("/mobile.html");

        //getWeather({"lat":"53","lng":"-2"});
        getTideData({"lat":"53","lng":"-2"});
        // This example adds a search box to a map, using the Google Place Autocomplete
      // feature. People can enter geographical searches. The search box will return a
      // pick list containing a mix of places and predicted search terms.

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

    
})

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

      // Create the search box and link it to the UI element.
      var input = document.getElementById('pac-input');
      var searchBox = new google.maps.places.SearchBox(input);
      //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });

      var markers = [];
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
          return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
          marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
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
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
}
function getTideData(location){
    $.getJSON("https://www.worldtides.info/api?heights&extremes&lat=53&lon=-2&length=1209600&key=f7b4b411-4b5d-49a8-9693-c6c741ada3b6", function(e){
        console.log(e);
    })
    $.ajax({
        dataType: "json",
        url: "https://www.worldtides.info/api?heights&extremes&lat=53&lon=-2&length=1209600&key=f7b4b411-4b5d-49a8-9693-c6c741ada3b6",
        success: function(result){
            console.log(result);
        },
        error: function(jqXHR,textStatus,errorThrown){
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);

        }
    })
}
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