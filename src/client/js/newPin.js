//Google map object
var map;
//Create new to be placed on map
var pin = new google.maps.Marker({
      position: null,
      map: null,
      icon: '../images/yel_blank.png'
    });

var iconImage = '../images/grn_blank.png';
//Declare & intialize contentstring for the infowindows
var contentString = '<p>test line 8</p>';

$(document).ready(function () {
  $.getJSON("/pins/api", function(json) {
    initMap(json);
  });
});

function initMap(pins) {

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

    //Current position
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    //Create google map object
    map = new google.maps.Map(document.getElementById('map'), {
      center: pos,
      zoom: 18
    });

    //Adds event listener to the map for new pins
    map.addListener('click', function(event) {
      addPin(event.latLng);
    });

    //Create a single infowindow object
    var infowindow = new google.maps.InfoWindow({
        content: 'test'
      });

    //Create markers with pins from database
    for (var i = 0; i < pins.length; i++) {
      var latitude = parseFloat(pins[i].latitude);
      var longitude = parseFloat(pins[i].longitude);
      //Set contentString & marker color based on
      //the state of the pin
      contentString = setPin(pins, i);

      var marker = new google.maps.Marker({
        position: {lat: latitude, lng:longitude},
        map: map,
        windowContent: contentString,
        icon: iconImage
      });
      //Add event listener for pin clicks
      google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(this.windowContent);
            infowindow.open(map, this);

        });
    }
    //Error function
  },function() {
      //Client declined to allow current location, center map at enter map at city & county bldg
      map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 39.739209, lng: -104.990255},
      zoom: 18
      });

      //Adds event listener to the map for new pins
      map.addListener('click', function(event) {
        addPin(event.latLng);
      });

      //Create a single infowindow object
      var infowindow = new google.maps.InfoWindow({
        content: 'test'
      });

    //Create markers with pins from database
    for (var i = 0; i < pins.length; i++) {
      var latitude = parseFloat(pins[i].latitude);
      var longitude = parseFloat(pins[i].longitude);

      //Set content string
      contentString = setPin(pins, i);

      var marker = new google.maps.Marker({
        position: {lat: latitude, lng:longitude},
        map: map,
        windowContent: contentString,
        icon: iconImage
      });
      //Add event listener for pin clicks
      google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(this.windowContent);
            infowindow.open(map, this);

        });
    }
    });
  } else {
    // Browser doesn't support Geolocation, center map at city & county bldg
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 39.739209, lng: -104.990255},
    zoom: 18
    });

    //Adds event listener to the map for new pins
    map.addListener('click', function(event) {
      addPin(event.latLng);
    });

    //Create a single infowindow object
    var infowindow = new google.maps.InfoWindow({
        content: 'test'
      });

    //Create markers with pins from database
    for (var i = 0; i < pins.length; i++) {
      var latitude = parseFloat(pins[i].latitude);
      var longitude = parseFloat(pins[i].longitude);
      var contentString = '<div id="content"><h3>'+ pins[i].pin_title + '</h3><p>' + pins[i].pin_description +
      '</p><p>Dropped by ' + pins[i].username + '</p></div>';

      var marker = new google.maps.Marker({
        position: {lat: latitude, lng:longitude},
        map: map,
        windowContent: contentString,
        icon: iconImage
      });
      //Add event listener for pin clicks
      google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(this.windowContent);
            infowindow.open(map, this);

        });
    }
  }
}

function addPin (location) {

  var lat = location.lat;
  var lng = location.lng;

  //Assign hidden input vals on page to lat & lng
  $('#latitude').val(lat);
  $('#longitude').val(lng);

  pin.setPosition(location);
  pin.setMap(map);

}

function setPin (pins, i) {

  if (!pins[i].picked_up) {
    //If not picked up, green
    iconImage = '../images/grn_blank.png';

    return '<div class="content"><h3>'+ pins[i].pin_title + '</h3><img alt="No image uploaded...be ready for a surprise!" src="' + pins[i].pin_image + '"><br><br><p><strong>' + pins[i].pin_description + '</strong></p><p>Dropped by <a>' + pins[i].dropper + '</a></p><a id="pickup" href="/pickup/' + pins[i].pin_id + '">Pick this up!</a></div>';
  }
  else if (pins[i].missing){
    //Pin is missing, white
    iconImage = '../images/wht_blank.png';

    return '<div class="content"><h3>'+ pins[i].pin_title + '</h3><img alt="No image uploaded...be ready for a surprise!" src="' + pins[i].pin_image + '"><br><br><p><strong>' + pins[i].pin_description + '</strong></p><p>Dropped by <a>' + pins[i].dropper + '</a></p><a id="pickup" href="/pickup/' + pins[i].pin_id + '">I found it, pick it up!</a></div>';
  }
  else {
    //Pin has been picked up, red
    iconImage = '../images/red_blank.png';

    return '<div class="content flip"><h3>'+ pins[i].pin_title + '</h3><h4 class="picked">Picked up!</h4><div class="dropper"><img alt="No image uploaded...be ready for a surprise!" src="' + pins[i].pin_image + '"><br><br><p><strong>' + pins[i].pin_description + '</strong></p><p>Dropped by <a>' + pins[i].dropper + '</a></p></div><div class="receiver"><img alt="No image uploaded...how ungrateful!" src="' + pins[i].receiver_image + '"><br><br><p><strong>' + pins[i].receiver_message + '</strong></p><p>Picked up by <a>' + pins[i].receiver + '</a></p></div></div>';
  }

}



