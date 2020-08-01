$(document).ready(function () {
  var lat;
  var lon;
  let jobListings = $("div.job-listings");
  let jobLocationCity = $("textarea#job-location-city");
  let jobLocationState = $("textarea#job-location-state");
  let jobLocationCountry = $("textarea#job-location-country");

  var apiKey =
    "08b0f7f65564475254bb83cd500444bd4cbc421bdbe6f0dc120b7552e822dc21";

  function findJobs(locationInputCity, locationInputState) {
    // jobs ajax request
    $.ajax({
      url: `https://www.themuse.com/api/public/jobs?location=${locationInputCity}%2C%20${locationInputState}&page=1&descending=true&api_key=${apiKey}`,
      //   Request URL: https://www.themuse.com/api/public/jobs?location=Aachen%2C%20Germany&page=10&descending=true
      method: "GET",
    }).then(function (response) {
      console.log(response);
      jobListings.empty();
      for (let i = 0; i < 10; i++) {
        let newDiv = $("<div class='input-field'></div>")
          .attr("data-name", response.results[i].name)
          .addClass("jobListingClick");
        jobListings.append(newDiv);
        newDiv
          .append(`<h4>${response.results[i].name}</h4>`)
          .append(`<p>${response.results[i].company.name}</p>`)
          // needs to truncate // extract to .val()?
          //   .append(`<p>${response.results[i].contents}<p>`)
          // limit to 2 characters
          .append(`<p>${response.results[i].locations[0].name}</p>`);
      }
    });
  }

  function getCoordinates(companyName, locationInputCity, locationInputState) {}

  function findBytes() {
    // restaurants ajax request
    $.ajax({
      url: "https://developers.zomato.com/api/v2.1/categories?",
      dataType: "json",
      async: true,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("user-key", "e49950936f801133968055049e30f777");
      }, // This inserts the api key into the HTTP header
      success: function (response) {
        console.log(response);
      },
    });
  }

  // search for jobs button click event
  $("button.find-jobs").on("click", function () {
    let locationInputCity = jobLocationCity.val().trim();
    let locationInputState = jobLocationState.val().trim();
    // console.

    // call jobs
    findJobs(locationInputCity, locationInputState);
    // call restaurants
    findBytes();
  });

  // target any job listing that is being clicked
  //   $(document).on("click", "jobListingClick", function () {
  //       let
  //     $(this).getElementById("");
  //   });
  //   getCoordinates();
});
