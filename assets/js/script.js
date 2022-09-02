var dueDateInputEl = $('#when');
var searchCityIDEl = $('#searchCityID');
var eventTypeEl = $('#event-type');
var eventSortEl = $('#how-sort');

var ticketCardHolderEl = $("#ticket-card-holder");
var userFormEl = document.querySelector("googleMap");


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
  var userSort = eventSortEl[0].selectedOptions[0].dataset.sort; 
  console.log(eventSortEl[0].selectedOptions[0].dataset.sort);
 
  setLocalStorage(userCity);

  var apiUrl = 'https://app.ticketmaster.com/discovery/v2/events/?apikey=Ghin8Ip1w9d05qXM8SbX3K9z1NWr1Y1A&source=ticketmaster&city=' + userCity + "&classificationName=" + userClassificationName + "&startDateTime=" + userDate + "&sort=" + userSort;

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

function setLocalStorage(city) {
  console.log(city) 
  localStorage.setItem("city", city);
}

$(ticketCardHolderEl).on("click", ".btn", getTicketMasterInfo);


// *************************** Calling Functions ********************************//
searchCityIDEl.on('click', getTicketMasterInfo);

dueDateInputEl.datepicker({ minDate: 1 });

function getFeaturedRepos(mapProp) {
  var apiUrl = "httpsgit checki://maps.googleapis.com/maps/api/js?key=AIzaSyCefcPxVMTAYFtpnbp3axEYEqtXbQWT1Ig&callback=myMap";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayRepos(data.items, mapProp);
      });
    } else {
      alert('Error: ' + response.statusText);
    }
  });

  //********************************** SHOW MAP DIV **********************//

const targetDiv = document.getElementById('map');
const btn = document.getElementById(".btn");
btn.onclick = function () {
  if (targetDiv.style.display !== "none") {
    targetDiv.style.display = "none";
  } else {
    targetDiv.style.display = "float right";
  }
};

//********************************** MAPS JS **************************//

var cardButton = document.getElementById('map');

$(cardButton).on('click', '.btn', initMap);

cardButton.addListener('click', '.btn', show('map'));

//Initialize and add the map
var myMap;
		
		function initMap(event) {							
			var latitude = event.currentTarget.dataset.lat  // YOUR LATITUDE VALUE
			var longitude = event.currentTarget.dataset.lng // YOUR LONGITUDE VALUE
			
      console.log(latitude, longitude);

			var myLatLng = {lat: latitude, lng: longitude};
			
			map = new google.maps.Map(document.getElementById('map'), {
			  center: myLatLng,
			  zoom: 14,
			  disableDoubleClickZoom: true, // disable the default map zoom on double click
			});
			
			// Update lat/long value of div when anywhere in the map is clicked	
			google.maps.event.addListener(map,'click',function(event) {				
                document.getElementById('latclicked').innerHTML = event.latLng.lat();
                document.getElementById('longclicked').innerHTML = event.latLng.lng();
            });
            
            // Update lat/long value of div when you move the mouse over the map
            google.maps.event.addListener(map,'mousemove',function(event) {
                document.getElementById('latmoved').innerHTML = event.latLng.lat();
                document.getElementById('longmoved').innerHTML = event.latLng.lng();
            });
					
			var marker = new google.maps.Marker({
			  position: myLatLng,
			  map: map,
			  
			  // setting latitude & longitude as title of the marker
			  // title is shown when you hover over the marker
			  title: latitude + 'Follow Event' + longitude 
			});	
			
			// Update lat/long value of div when the marker is clicked
			marker.addListener('click', function(event) {			  
			  document.getElementById('latclicked').innerHTML = event.latLng.lat();
              document.getElementById('longclicked').innerHTML =  event.latLng.lng();
			});
			
			// Create new marker on double click event on the map
			google.maps.event.addListener(map,'dblclick',function(event) {
                var marker = new google.maps.Marker({
				  position: event.latLng, 
				  map: map, 
				  title: event.latLng.lat()+', '+event.latLng.lng()
				});
				
				// Update lat/long value of div when the marker is clicked
				marker.addListener('click', function() {
				  document.getElementById('latclicked').innerHTML = event.latLng.lat();
				  document.getElementById('longclicked').innerHTML =  event.latLng.lng();
				});            
            });

            // Create new marker on single click event on the map
			google.maps.event.addListener(map,'click',function(event) {
                var marker = new google.maps.Marker({
				  position: event.latLng, 
				  map: map, 
				  title: event.latLng.lat()+'Follow Event'+event.latLng.lng()
				});                
            });
		}

  // function initMap() {
  //   var directionsRenderer = new google.maps.DirectionsRenderer();
  //   var losangeles = new google.maps.LatLng(37.426718, -122.080722);
  //   var mapOptions = {
  //     zoom:7,
  //     center: losangeles
  //   }
  //   var map = new google.maps.Map(document.getElementById('#map'), mapOptions);
  //   directionsRenderer.setMap(map);
  //   directionsRenderer.setPanel(document.getElementById('directionsPanel'));
  // }
  
  // function calcRoute() {
  //   var start = document.getElementById('start').value;
  //   var end = document.getElementById('end').value;
  //   var request = {
  //     origin:start,
  //     destination:end,
  //     travelMode: 'DRIVING'
  //   };
  //   directionsService.route(request, function(response, status) {
  //     if (status == 'OK') {
  //       directionsRenderer.setDirections(response);
  //     }
  //   });
  // }
  // function position() {
  //   google.maps.event.trigger(cardButton, 'click');
    
  // }

  // google.maps.event.addDomListener(window, 'load', initialize);
  
  $(document).ready(function(){
    initMap
  })


 //************************* TICKETMASTER - LATs & LNGs *************************//
//  new google.maps.LatLng(36.0909, -115.1833),
//  new google.maps.LatLng(39.805674, -104.891082),
//  new google.maps.LatLng(37.426718, -122.080722),
//  new google.maps.LatLng(34.012879, -118.284926),
//  new google.maps.LatLng(32.77507215, -96.75646586),
//  new google.maps.LatLng(30.16190839, -95.46435087)
