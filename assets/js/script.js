var dueDateInputEl = $('#when');

//********************** COPIED SOURCE CODE *********************//


// var userFormEl = document.querySelector('#');
// var SeeEventsButtonsEl = document.querySelector('#');
// var nameInputEl = document.querySelector('#');
// var repoContainerEl = document.querySelector('#');
// var repoSearchTerm = document.querySelector('#');
var ticketCardHolderEl = $("#ticket-card-holder");


var userFormEl = document.querySelector("googleMap");
// var SeeEventsButtonsEl = document.querySelector('#');
// var nameInputEl = document.querySelector('#');
// var repoContainerEl = document.querySelector('#');
// var repoSearchTerm = document.querySelector('#');


var formSubmitHandler = function (event) {
  event.preventDefault();


//   var username = nameInputEl.value.trim();

//   if (username) {
//     getUserRepos(username);

//     repoContainerEl.textContent = '';
//     nameInputEl.value = '';
//   } else {
//     alert('INPUT ALERT MESSAGE');
//   }
// };

// var buttonClickHandler = function (event) {
//   var language = event.target.getAttribute('data-language');

//   if (language) {
//     getFeaturedRepos(language);

//     repoContainerEl.textContent = '';
//   }
};


//Testing for Ticketmaster API//
var getTicketMasterInfo = function (keyword) {

  var userCity = "los angeles";
  var userClassificationName = "music";


  var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events/?apikey=Ghin8Ip1w9d05qXM8SbX3K9z1NWr1Y1A&source=ticketmaster&city=' + userCity + "&classificationName=" + userClassificationName;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function(data){
      console.log(data);

      var indexNumbers = ["0", "1", "2", "3", "4", "5"]; 
      indexNumbers.forEach(function(indexNumber){

        var eventName = data._embedded.events[indexNumber].name;
        var eventImageURL = data._embedded.events[indexNumber].images[1].url;
        var eventPrice = "$" + data._embedded.events[indexNumber].priceRanges[0].min + "0 - $" + data._embedded.events[indexNumber].priceRanges[0].max + "0";
        var eventVenue = data._embedded.events[indexNumber]._embedded.venues[0].name;
        var lat = data._embedded.events[indexNumber]._embedded.venues[0].location.latitude;
        var lon = data._embedded.events[indexNumber]._embedded.venues[0].location.longitude;
      
        var cardHolder = $("<div>").addClass("card d-flex");
        var cardImg = $("<img>").attr("src", eventImageURL).addClass("card-img-top");
        var cardBody = $("<div>").addClass("card-body");
        var cardName = $("<h5>").text(eventName).addClass("card-title");
        var cardVenue = $("<p>").text(eventVenue).addClass("card-text");
        var cardPrice = $("<p>").text(eventPrice).addClass("card-text");

        cardBody.append(cardName, cardVenue, cardPrice);
        cardHolder.append(cardImg , cardBody);
        ticketCardHolderEl.append(cardHolder);

      })

    });

};


//********************** Testing for Google Maps API ************************//
var getFeaturedRepos = function (mapProp) {
  var apiUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDUSfnQS1xGOOSal06rdyFTZrtwp70TO_Q&callback=myMap";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, mapProp);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  });
};

getTicketMasterInfo();



dueDateInputEl.datepicker({ minDate: 1 });


var getFeaturedRepos = function (geolocate) {
var apiUrl = "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDUSfnQS1xGOOSal06rdyFTZrtwp70TO_Q&callback=geolocate";

fetch (apiUrl).then(function (response) {
  if (response.ok) {
    response.json().then(function (data) {
      displayRepos(data.items, geolocate);
    });
  } else {
    alert('Error: ' + response.statusText);
  }
});
};

 //************************* GOOGLE MAPS VARIABLE(S) *************************//
var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

function myMap(map) {
  var map = {
      center:new google.maps.LatLng(51.508742,-0.120850),
      zoom:5,
  };
}

var marker = new google.maps.Marker({position: myCenter});

marker.setMap(map);

var myTrip = [losangeles, california, unitedstates];
var flightPath = new google.maps.Polyline({
  path:myTrip,
  strokeColor:"#0000FF",
  strokeOpacity:0.8,
  strokeWeight:2
});

var myTrip = [losangeles, california, unitedstates];
var flightPath = new google.maps.Polygon({
  path:myTrip,
  strokeColor:"#0000FF",
  strokeOpacity:0.8,
  strokeWeight:2,
  fillColor:"#0000FF",
  fillOpacity:0.4
});

var myCity = new google.maps.Circle({
  center:losangeles,
  radius:20000,
  strokeColor:"#0000FF",
  strokeOpacity:0.8,
  strokeWeight:2,
  fillColor:"#0000FF",
  fillOpacity:0.4
});

var infowindow = new google.maps.InfoWindow({
  content:"Follow Event!"
});

var infowindow = new google.maps.InfoWindow({
  content:"Follow Event!"
});

google.maps.event.addListener(map, 'click', function(event) {
  placeMarker(map, event.latLng);
});

function placeMarker(map, location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  var infowindow = new google.maps.InfoWindow({
    content: 'Latitude: ' + location.lat() +
    '<br>Longitude: ' + location.lng()
  });
  infowindow.open(map,marker);
}

google.maps.event.addListener(marker, 'click', function() {
  infowindow.open(map,marker);
});

infowindow.open(map,marker);

var mapOptions = {
  center:new google.maps.LatLng(51.508742,-0.120850),
  zoom:7,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};

//ZOOM-TO-9 WHEN CLICKING ON MARKER//
google.maps.event.addListener(marker,'click',function() {
  map.setZoom(9);
  map.setCenter(marker.getPosition());
});

google.maps.event.addListener(marker,'click',function() {
  var pos = map.getZoom();
  map.setZoom(9);
  map.setCenter(marker.getPosition());
  window.setTimeout(function() {map.setZoom(pos);},3000);
});

//***************************** GOOGLE MAP VARIABLE CONTROLS ******************************//
// var mapOptions {disableDefaultUI: true}

// var mapOptions {
//   panControl: true,
//   zoomControl: true,
//   mapTypeControl: true,
//   scaleControl: true,
//   streetViewControl: true,
//   overviewMapControl: true,
//   rotateControl: true
// }

//************** CONTROL VARIABLES POSITION *************************************************//
// mapTypeControl: true,
// mapTypeControlOptions: {
//   style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
//   position: google.maps.ControlPosition.TOP_CENTER
// }
//*************************** COPIED SOURCE CODE ****************************//

// var displayRepos = function (repos, searchTerm) {
//   if (repos.length === 0) {
//     repoContainerEl.textContent = 'No repositories found.';
//     return;
//   }

//   repoSearchTerm.textContent = searchTerm;

//   for (var i = 0; i < repos.length; i++) {
//     var repoName = repos[i].owner.login + '/' + repos[i].name;

//     var repoEl = document.createElement('a');
//     repoEl.classList = 'list-item flex-row justify-space-between align-center';
//     repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

//     var titleEl = document.createElement('span');
//     titleEl.textContent = repoName;

//     repoEl.appendChild(titleEl);

//     var statusEl = document.createElement('span');
//     statusEl.classList = 'flex-row align-center';

//     if (repos[i].open_issues_count > 0) {
//       statusEl.innerHTML =
//         "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
//     } else {
//       statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
//     }

//     repoEl.appendChild(statusEl);

//     repoContainerEl.appendChild(repoEl);
//   }
// };

// userFormEl.addEventListener('submit', formSubmitHandler)
