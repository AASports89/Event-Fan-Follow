//********************************* REFERENCE-VARIABLES ***********************************//
var dueDateInputEl = $("#when");
var cityTextEl = $("#where");
var searchCityIDEl = $("#searchCityID");
var eventTypeEl = $("#event-type");
var eventSortEl = $("#how-sort");
var pageTitleEl = $("#page-title");

var ticketCardHolderEl = $("#ticket-card-holder");
var userFormEl = document.querySelector("googleMap");

var citiesArray = [];

//*********************************** FUNCTIONS-&-METHODS ********************************//

//************************* TICKETMASTER-API ***************************//
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
//BUTTON WILL LINK TO TICKETMASTER TO PURCHASE TICKET//
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

        storeLatLon(lat, lon);
      });
    });
};

//**************************** STORING-LAT-&-LON-CONSOLE-LOG ***************************//
  function storeLatLon(lat, lon) {
  // console.log(lat);
  // console.log(lon);
  var thisLatLng = "LatLng(" + lat + ", " + lon + ")";
  // LatLng(37.426718, -122.080722);
  console.log(thisLatLng);
  }

//*************************************** LOCAL-STORAGE ***********************************//
  function setLocalStorage(city) {
  cityTextEl.val("");

  // error control
  if (city === "") {
    return;
  }

//IF CITY (KEY VALUE) DOES NOT EXIST, MAKE AN EMPTY MAKE SLOT IN THE LOCAL STORAGE//
  if (!localStorage.getItem("city")) {
    localStorage.setItem("city", "[]");
  } else {
//PARSE FROM THE LOCAL STORAGE//
    citiesArray = JSON.parse(localStorage.getItem("city"));
  }

//IF CITY DOES NOT ALREADY EXIST IN LOCAL STORAGE, ADD IT//
  if (!citiesArray.includes(city)) {
    citiesArray.push(city);
  } else {
    console.log("its a repeat");
  }

//SET TO LOCAL STORAGE (STRINGIFY IT)//
  localStorage.setItem("city", JSON.stringify(citiesArray));
  renderLocalStorage();
}

function renderLocalStorage() {
  var savedCities = JSON.parse(localStorage.getItem("city"));

  if (savedCities === null) {
    console.log("nothing in local storage");
  } else {
    
//******* AUTO COMPLETE FROM THE LOCAL STORAGE ******//
    $(function () {
      $("#where").autocomplete({
        source: savedCities,
      });
    });
  }
}

//**************************** RELOAD-PAGE ********************************//
function pageReload() {
  console.log("reload me");
  location.reload();
}

//**************************** CALLING-FUNCTIONS ********************************//
searchCityIDEl.on("click", getTicketMasterInfo);

dueDateInputEl.datepicker({ minDate: 1 });

//$(ticketCardHolderEl).on("click", ".btn", getTicketMasterInfo);//

pageTitleEl.on("click", pageReload);

renderLocalStorage();

//******************************** NEW-GOOGLE-MAPS-JSCRIPT *********************************//

//DISPLAY-MAP-DIV-LISTENER//
const targetDiv = document.querySelector("#map");
const cardButton = document.querySelector(".btn");
cardButton.onclick = function () {
  if (targetDiv.style.display !== "none") {
    targetDiv.style.display = "none";
  } else {
    targetDiv.style.display = "flex";
  }
};

//INITIALIZE-CODE-&-CONFIGURE-VARIABLES-MAP-OPTIONS//
function initMap() {
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

  var marker = new google.maps.Marker({
    position: new google.maps.LatLng(37.426718, -122.080722),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var infowindow = new google.maps.InfoWindow({
    content: "Follow Your Event!",
    position: new google.maps.LatLng(37.426718, -122.080722),
  });

  var marker1 = new google.maps.Marker({
    position: new google.maps.LatLng(36.0909, -115.1833),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var marker2 = new google.maps.Marker({
    position: new google.maps.LatLng(39.805674, -104.891082),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var marker3 = new google.maps.Marker({
    position: new google.maps.LatLng(34.012879, -118.284926),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var marker4 = new google.maps.Marker({
    position: new google.maps.LatLng(32.77507215, -96.75646586),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var marker5 = new google.maps.Marker({
    position: new google.maps.LatLng(30.16190839, -95.46435087),
    icon: "./assets/images/tm.jpg",
    animation: google.maps.Animation.DROP,
  });

  var infowindow = new google.maps.InfoWindow({
    position: new google.maps.LatLng(37.426718, -122.080722),
    content: "Follow Your Event!",
  });

  var infowindow1 = new google.maps.InfoWindow({
    position: new google.maps.LatLng(36.0909, -115.1833),
    content: "Follow Your Event!",
  });

  var infowindow2 = new google.maps.InfoWindow({
    position: new google.maps.LatLng(39.805674, -104.891082),
    content: "Follow Your Event!",
  });

  var infowindow3 = new google.maps.InfoWindow({
    position: new google.maps.LatLng(34.012879, -118.284926),
    content: "Follow Your Event!",
  });

  var infowindow4 = new google.maps.InfoWindow({
    position: new google.maps.LatLng(32.77507215, -96.75646586),
    content: "Follow Your Event!",
  });

  var infowindow5 = new google.maps.InfoWindow({
    position: new google.maps.LatLng(30.16190839, -95.46435087),
    content: "Follow Your Event!",
  });

  var myTrip = [
    new google.maps.LatLng(36.0909, -115.1833),
    new google.maps.LatLng(39.805674, -104.891082),
    new google.maps.LatLng(37.426718, -122.080722),
    new google.maps.LatLng(34.012879, -118.284926),
    new google.maps.LatLng(32.77507215, -96.75646586),
    new google.maps.LatLng(30.16190839, -95.46435087),
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
//***************************************** END-OF-CODE *************************************//

//**************************** TICKETMASTER CARD - LATs & LONs *******************************//
  //  new google.maps.LatLng(36.0909, -115.1833),
  //  new google.maps.LatLng(39.805674, -104.891082),
  //  new google.maps.LatLng(37.426718, -122.080722),
  //  new google.maps.LatLng(34.012879, -118.284926),
  //  new google.maps.LatLng(32.77507215, -96.75646586),
  //  new google.maps.LatLng(30.16190839, -95.46435087)