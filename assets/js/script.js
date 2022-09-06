//****************** Reference Variables *********************//
var dueDateInputEl = $("#when");
var cityTextEl = $("#where");
var searchCityIDEl = $("#searchCityID");
var eventTypeEl = $("#event-type");
var eventSortEl = $("#how-sort");
var pageTitleEl = $("#page-title");
var mapPlaceholderEl = $("#map-placeholder");

var ticketCardHolderEl = $("#ticket-card-holder");
var userFormEl = document.querySelector("googleMap");

var citiesArray = [];

var latArray = [];
var lonArray = [];

//****************** Functions / Methods ******************//

//************************* Ticketmaster API ***************************//
var getTicketMasterInfo = function (event) {
  var userCity = cityTextEl[0].value;
  var userDate =
    moment(dueDateInputEl[0].value, "MM/DD/YYYY").format(
      "YYYY-MM-DD" + "T" + "HH:mm:ss"
    ) + "Z";
  var userClassificationName = eventTypeEl[0].value;
  var userSort = eventSortEl[0].selectedOptions[0].dataset.sort;

  setLocalStorage(userCity);

  var apiUrl =
    "https://app.ticketmaster.com/discovery/v2/events/?apikey=Ghin8Ip1w9d05qXM8SbX3K9z1NWr1Y1A&source=ticketmaster&city=" +
    userCity +
    "&classificationName=" +
    userClassificationName +
    "&startDateTime=" +
    userDate +
    "&sort=" +
    userSort;

  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      ticketCardHolderEl.empty();

      var indexNumbers = ["0", "1", "2", "3", "4", "5"];
      indexNumbers.forEach(function (indexNumber) {
        var eventName = data._embedded.events[indexNumber].name;
        var eventImageURL = data._embedded.events[indexNumber].images[1].url;
        var eventPrice = ` $${data._embedded.events[indexNumber].priceRanges[0].min} - $${data._embedded.events[indexNumber].priceRanges[0].max} `;
        var eventVenue =
          data._embedded.events[indexNumber]._embedded.venues[0].name;
        var eventDate = moment(
          data._embedded.events[indexNumber].dates.start.localDate,
          "YYYY-MM-DD"
        ).format("MM/DD/YYYY");
        var eventTime = moment(
          data._embedded.events[indexNumber].dates.start.localTime,
          "HH-mm-ss"
        ).format("h:mmA");
        var lat =
          data._embedded.events[indexNumber]._embedded.venues[0].location
            .latitude;
        var lon =
          data._embedded.events[indexNumber]._embedded.venues[0].location
            .longitude;
        var eventURL = data._embedded.events[indexNumber].url;
        var cardCol = $("<div>").addClass(
          "col-sm-12 col-md-6 col-lg-3 col-xl-2 mb-4"
        );
        var cardHolder = $("<div>").addClass(
          "card border border-light mt-4 h-100"
        );
        var cardImg = $("<img>")
          .attr("src", eventImageURL)
          .addClass("card-img-top");
        var cardBody = $("<div>").addClass("card-body text-center");
        var cardName = $("<h5>").text(eventName).addClass("card-title");
        var cardVenue = $("<p>").text(eventVenue).addClass("card-text");
        var cardDateTime = $("<p>")
          .text(eventDate + " - " + eventTime)
          .addClass("card-text");
        var cardPrice = $("<p>").text(eventPrice).addClass("card-text");
        //button will link to ticketMaster to purchase tickets
        var cardButton = $("<a>")
          .addClass("btn btn-primary text-white")
          .attr("type", "button")
          .attr("data-lat", lat)
          .attr("data-lon", lon)
          .attr("href", eventURL) 
          .text("Buy Tickets");

        cardBody.append(
          cardName,
          cardVenue,
          cardDateTime,
          cardPrice,
          cardButton
        );
        cardHolder.append(cardImg, cardBody);
        cardCol.append(cardHolder);
        ticketCardHolderEl.append(cardCol);

        

        latArray.push(lat);
        lonArray.push(lon);

      });
      // storeLatLon();
      loadMap();
    });
};

// *************************** Storing the lat / lon ********************************//
function storeLatLon() {
  // console.log(lat);
  // console.log(lon);
  // var thisLatLng = "LatLng(" + lat + ", " + lon + ")";
  // LatLng(37.426718, -122.080722);

  var newlatArray = latArray;
  var newlonArray = lonArray;

  newLatLon1 = newlatArray[0] + ", " + newlonArray[0];
  newLatLon2 = newlatArray[1] + ", " + newlonArray[1];
  newLatLon3 = newlatArray[2] + ", " + newlonArray[2];
  newLatLon4 = newlatArray[3] + ", " + newlonArray[3];
  newLatLon5 = newlatArray[4] + ", " + newlonArray[4];
  newLatLon6 = newlatArray[5] + ", " + newlonArray[5];

}

// *************************** Local Storage ********************************//

function setLocalStorage(city) {
  cityTextEl.val("");

  // error control
  if (city === "") {
    return;
  }

  // if city (the key value) does not exist, make an empty slot in local storage
  if (!localStorage.getItem("city")) {
    localStorage.setItem("city", "[]");
  } else {
    // parse from the local storage
    citiesArray = JSON.parse(localStorage.getItem("city"));
  }

  // if city doesn't already exist in local storage, add it
  if (!citiesArray.includes(city)) {
    citiesArray.push(city);
  } else {
    console.log("its a repeat");
  }

  // set to local storage (stringify it)
  localStorage.setItem("city", JSON.stringify(citiesArray));
  renderLocalStorage();
}

function renderLocalStorage() {
  var savedCities = JSON.parse(localStorage.getItem("city"));

  if (savedCities === null) {
    console.log("nothing in local storage");
  } else {
    // ****** Auto complete from local storage ******//
    $(function () {
      $("#where").autocomplete({
        source: savedCities,
      });
    });
  }
}

// *************************** Reload Page ********************************//
function pageReload() {
  console.log("reload me");
  location.reload();
}

// *************************** Calling Functions ********************************//
searchCityIDEl.on("click", getTicketMasterInfo);

dueDateInputEl.datepicker({ minDate: 1 });

// $(ticketCardHolderEl).on("click", ".btn", getTicketMasterInfo);

pageTitleEl.on("click", pageReload);

renderLocalStorage();

//******************************** NEW-GOOGLE-MAPS-JSCRIPT *********************************//

//DISPLAY-MAP-DIV-LISTENER//
//********************************************* */
const targetDiv = document.querySelector("#map");
const cardButton = document.querySelector(".btn");
// cardButton.onclick = 
function loadMap() {
  if (targetDiv.style.display !== "none") {
    targetDiv.style.display = "none";
  } else {
    targetDiv.style.display = "flex";
  }

  initMap();
  // <div style="border: solid 1.5px whitesmoke; border-radius: 0.25em; width: 50%; height: 450px; display: none" id="map"></div>
  
  // var theMap = $("<div>").attr("style", "border: solid 1.5px whitesmoke; border-radius: 0.25em; width: 50%; height: 450px;").attr("id", "map");

  // mapPlaceholderEl.append(theMap);

};
//******************************************* */

//EVENT-LISTENER-CLICK-ON-MARKER-EXPOSE-INFOWINDOW-//
// map.addListener("click", (mapsMouseEvent) => {
//   // Close the current InfoWindow.
//   infowindow.close();
//   infowindow.setContent(
//   JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
//   );
//   infowindow.open(map, marker);
//   });

//INITIALIZE-CODE-&-CONFIGURE-VARIABLES-MAP-OPTIONS//
function initMap() {
  var newlatArray = latArray;
  var newlonArray = lonArray;

  newLatLon1 = newlatArray[0] + ", " + newlonArray[0];
  newLatLon2 = newlatArray[1] + ", " + newlonArray[1];
  newLatLon3 = newlatArray[2] + ", " + newlonArray[2];
  newLatLon4 = newlatArray[3] + ", " + newlonArray[3];
  newLatLon5 = newlatArray[4] + ", " + newlonArray[4];
  newLatLon6 = newlatArray[5] + ", " + newlonArray[5];

  console.log(newLatLon1);

  var mapOptions = {
    //LAT-&-LON-CENTER-GOOGLE-MAP-KANSAS//
    center: new google.maps.LatLng(38.5, -98.0),
    zoom: 4,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DEAFULT,
      position: google.maps.ControlPosition.TOP_CENTER,
    },
  };

  // #1
  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(newLatLon1),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var infowindow = new google.maps.InfoWindow({
    content: "Follow Your Event!",
    position: new google.maps.LatLng(newLatLon1),
  });

  // #2
  var marker1 = new google.maps.Marker({
    position: new google.maps.LatLng(newLatLon2),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var infowindow1 = new google.maps.InfoWindow({
    position: new google.maps.LatLng(newLatLon2),
    content: "Follow Your Event!",
  });
  
  // #3
  var marker2 = new google.maps.Marker({
    position: new google.maps.LatLng(newLatLon3),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var infowindow2 = new google.maps.InfoWindow({
    position: new google.maps.LatLng(newLatLon3),
    content: "Follow Your Event!",
  });

  // #4
  var marker3 = new google.maps.Marker({
    position: new google.maps.LatLng(newLatLon4),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var infowindow3 = new google.maps.InfoWindow({
    position: new google.maps.LatLng(newLatLon4),
    content: "Follow Your Event!",
  });

  // #5
  var marker4 = new google.maps.Marker({
    position: new google.maps.LatLng(newLatLon5),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var infowindow4 = new google.maps.InfoWindow({
    position: new google.maps.LatLng(newLatLon5),
    content: "Follow Your Event!",
  });

  // #6
  var marker5 = new google.maps.Marker({
    position: new google.maps.LatLng(newLatLon6),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var infowindow5 = new google.maps.InfoWindow({
    position: new google.maps.LatLng(newLatLon6),
    content: "Follow Your Event!",
  });


  var myTrip = [
    new google.maps.LatLng(newLatLon1),
    new google.maps.LatLng(newLatLon2),
    new google.maps.LatLng(newLatLon3),
    new google.maps.LatLng(newLatLon4),
    new google.maps.LatLng(newLatLon5),
    new google.maps.LatLng(newLatLon6),
  ];
  var flightPath = new google.maps.Polyline({
    path: myTrip,
    strokeColor: "black",
    strokeOpacity: 0.8,
    strokeWeight: 1.5,
    fillColor: "#0563c1",
    fillOpacity: 0.4,
    editable: true,
  });

  //CREATE-&-DISPLAY-GOOGLE-MAP-USING-ALL-ABOVE-MAP-OPTIONS-&-VARIABLES//
  var map = new google.maps.Map(
    document.querySelector("#map"),
    mapOptions,
    flightPath,
    marker,
    infowindow
  );

  new google.maps.event.addListener(marker, "click", function () {
    infowindow.open(map, marker);
  });
  new google.maps.event.addListener(marker1, "click", function () {
    infowindow1.open(map, marker1);
  });
  new google.maps.event.addListener(marker2, "click", function () {
    infowindow2.open(map, marker2);
  });
  new google.maps.event.addListener(marker3, "click", function () {
    infowindow3.open(map, marker3);
  });
  new google.maps.event.addListener(marker4, "click", function () {
    infowindow4.open(map, marker4);
  });
  new google.maps.event.addListener(marker5, "click", function () {
    infowindow5.open(map, marker5);
  });

  //DISPLAY-'TM'-MARKER//
  marker.setMap(map);
  marker1.setMap(map);
  marker2.setMap(map);
  marker3.setMap(map);
  marker4.setMap(map);
  marker5.setMap(map);

  //DISPLAY-PATH-OF-EVENTS//
  flightPath.setMap(map);
}

//*** GOOGLE-ERROR-BUG-FIX ***//
//     $(document).ready(function(){
//     initMap
//     })

//**************************** TICKETMASTER CARD - LATs & LONs *******************************//
//  new google.maps.LatLng(36.0909, -115.1833),
//  new google.maps.LatLng(39.805674, -104.891082),
//  new google.maps.LatLng(37.426718, -122.080722),
//  new google.maps.LatLng(34.012879, -118.284926),
//  new google.maps.LatLng(32.77507215, -96.75646586),
//  new google.maps.LatLng(30.16190839, -95.46435087)
