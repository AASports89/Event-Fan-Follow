var dueDateInputEl = $('#when');

//********************** COPIED SOURCE CODE *********************//

// var userFormEl = document.querySelector('#');
// var SeeEventsButtonsEl = document.querySelector('#');
// var nameInputEl = document.querySelector('#');
// var repoContainerEl = document.querySelector('#');
// var repoSearchTerm = document.querySelector('#');

// var formSubmitHandler = function (event) {
//   event.preventDefault();

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
// };


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
      var eventName = data._embedded.events[0].name;
      
      var cardBodyEl = $("<div>").addClass("card-body my-2");

      var cardName = $("<h5>").text(eventName).addClass("card-title");

      document.append(cardName);

    });

    // ? don't know what that is : 
    //   if (response.ok) {
    //     console.log(response);
    //     response.json().then(function (data) {
    //       console.log(data);
    //       displayRepos(data, user);
    //     });
    //   } else {
    //     alert('Error: ' + response.statusText);
    //   }
    // })
    // .catch(function (error) {
    //   alert('Unable to connect to GitHub');
    // });
};

getTicketMasterInfo();

//Testing for Google Maps API//
// var getFeaturedRepos = function (language) {
//   var apiUrl = 'https://api.github.com/search/repositories?q=' + language + '+is:featured&sort=help-wanted-issues';

//   fetch(apiUrl).then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         displayRepos(data.items, language);
//       });
//     } else {
//       alert('Error: ' + response.statusText);
//     }
//   });
// };

dueDateInputEl.datepicker({ minDate: 1 });

//********************* COPIED SOURCE CODE *********************************//

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

// userFormEl.addEventListener('submit', formSubmitHandler);
// languageButtonsEl.addEventListener('click', buttonClickHandler);