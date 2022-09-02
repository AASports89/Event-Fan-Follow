var dueDateInputEl = $('#when');
var searchCityIDEl = $('#searchCityID');
var eventTypeEl = $('#event-type');

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
var getTicketMasterInfo = function (event) {

  console.log(event);
  var userCity = event.currentTarget.parentElement.parentElement.firstElementChild.firstElementChild.nextElementSibling.value;
  var userDate = moment(dueDateInputEl[0].value, "MM/DD/YYYY").format("YYYY-MM-DD"+"T"+"HH:mm:ss") + "Z";
  var userClassificationName = eventTypeEl[0].value;

  var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events/?apikey=Ghin8Ip1w9d05qXM8SbX3K9z1NWr1Y1A&source=ticketmaster&city=' + userCity + "&classificationName=" + userClassificationName + "&startDateTime=" + userDate;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function(data){
      console.log(data);
      ticketCardHolderEl.empty();

      var indexNumbers = ["0", "1", "2", "3", "4", "5"]; 
      indexNumbers.forEach(function(indexNumber){

        var eventName = data._embedded.events[indexNumber].name;
        var eventImageURL = data._embedded.events[indexNumber].images[1].url;
        var eventPrice = "$" + data._embedded.events[indexNumber].priceRanges[0].min + "0 - $" + data._embedded.events[indexNumber].priceRanges[0].max + "0";
        var eventVenue = data._embedded.events[indexNumber]._embedded.venues[0].name;
        var eventDate = moment(data._embedded.events[indexNumber].dates.start.localDate, "YYYY-MM-DD").format("MM/DD/YYYY");
        var eventTime = moment(data._embedded.events[indexNumber].dates.start.localTime, "HH-mm-ss").format("h:mmA");
        var lat = data._embedded.events[indexNumber]._embedded.venues[0].location.latitude;
        var lon = data._embedded.events[indexNumber]._embedded.venues[0].location.longitude;
      
        var cardCol = $("<div>").addClass("col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-4");
        var cardHolder = $("<div>").addClass("card border border-light mt-4 h-100");
        var cardImg = $("<img>").attr("src", eventImageURL).addClass("card-img-top");
        var cardBody = $("<div>").addClass("card-body text-center");
        var cardName = $("<h5>").text(eventName).addClass("card-title");
        var cardVenue = $("<p>").text(eventVenue).addClass("card-text");
        var cardDateTime = $("<p>").text(eventDate + " - " + eventTime).addClass("card-text");
        var cardPrice = $("<p>").text(eventPrice).addClass("card-text");
        var cardButton = $("<a>").text("Directions").addClass("btn btn-primary text-white").attr("data-lat", lat).attr("data-lon", lon);
        
        cardBody.append(cardName, cardVenue, cardDateTime, cardPrice, cardButton); 
        cardHolder.append(cardImg , cardBody);
        cardCol.append(cardHolder);
        ticketCardHolderEl.append(cardCol);
      })

    });

};

$(ticketCardHolderEl).on("click", ".btn", testFunction);


function testFunction(event) {
  var lat = event.currentTarget.dataset.lat;
  var lon = event.currentTarget.dataset.lon;

  console.log(lat);
  console.log(lon);
  console.log("what")

}


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

// *************************** Calling Functions ********************************//
searchCityIDEl.on("click", getTicketMasterInfo)

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
