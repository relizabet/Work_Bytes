$(document).ready(function () {
  let lat;
  let lon;
  const jobListings = $("div.job-listings");
  const restaurantListings = $("div.restaurant-listings");
  const jobLocationCity = $("input#job-location-city");
  const jobLocationState = $("input#job-location-state");
  const jobLocationCountry = $("input#job-location-country");

  let savedJobsArr = [];
  // $(".parallax").parallax();

  const apiKey =
    "08b0f7f65564475254bb83cd500444bd4cbc421bdbe6f0dc120b7552e822dc21";

    function capitalize(cityName){
      // first split the string into an array
      return cityName.toLowerCase().split(" ")
      // map the array to return the word with the first letter capitalized
      .map(function(word){
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      // join the arrays back together
      .join(" ");
      //return the string out of the function

    };

  function findJobs(locationInputCity, locationInputState) {
    // jobs ajax request
    const location = encodeURI(`${capitalize(locationInputCity)}, ${locationInputState.toUpperCase()}`);
    $.ajax({
      url: `https://www.themuse.com/api/public/jobs?location=${location}&page=1&descending=true&api_key=${apiKey}`,
      //   Request URL: https://www.themuse.com/api/public/jobs?location=Aachen%2C%20Germany&page=10&descending=true
      method: "GET",
    }).then(function (response) {
      // console.log(response);
      jobListings.empty();
      let iterations = 10;
      for (let i = 0; i < iterations; i++) {
        console.log(response.results[i].locations[0].name);
        console.log(location);
        if (response.results[i].locations[0].name !== `${capitalize(locationInputCity)}, ${locationInputState.toUpperCase()}`){
            iterations++;
            continue;
            
        }
        
        let newDiv = $("<div class='input-field new-div-style'></div>")
          .attr("data-name", response.results[i].company.name)
          .attr("data-location", response.results[i].locations[0].name)
          .addClass("jobListingClick card");
          
        jobListings.append(newDiv);
        newDiv
          .append(`<h4>${response.results[i].name}</h4>`)
          .append(`<p>${response.results[i].company.name}</p>`)
          // needs to truncate // extract to .val()?
          //   .append(`<p>${response.results[i].contents}<p>`)
          // limit to 2 characters
          .append(`<p>${response.results[i].locations[0].name}</p>`);

        let cardAction = $("<div class='card-action'></div>");
        newDiv.append(cardAction);

        let applyNow = $("<a>Apply Now</a>")
          .attr("href", response.results[i].refs.landing_page)
          // blank target to open links in new tab
          .attr("target", "_blank");
        cardAction.append("<i class='tiny material-icons'>chevron_right</i>");
        cardAction.append(applyNow);

        // <i class="large material-icons">insert_chart</i>

        // let applyIcon = $("<i class='small material-icons'></i>")

        // appending checkbox
        let newForm = $(`<form action="#">
                    <p><label><input type="checkbox" /><span>Save this job</span></label></p></form>`)
          .attr("data-name", response.results[i].name)
          .attr("data-company", response.results[i].company.name)
          .attr("data-location", response.results[i].locations[0].name);
        // newDiv.append(newForm);
        cardAction.append(newForm);
      }
    });
  }

  function getCoordinates(companyName, location) {
    // coordinates ajax request
    $.ajax({
      url: `http://www.mapquestapi.com/geocoding/v1/address?key=ZnAtTuiJDu6IN6Gr7hp9MS2MkxM9hNgT&location=${companyName}${location}`,
      method: "GET",
    }).then(function (response) {
      // console.log(response);

      //get lat and lon
      lat = response.results[0].locations[0].displayLatLng.lat;
      lon = response.results[0].locations[0].displayLatLng.lng;

      // console.log(lat, lon);

      // call find bytes function with coords
      findBytes(lat, lon);
    });
  }

  // need to catch random 400 errors ??? ask teacher
  // ???????????????????????????
  function findBytes(lat, lon) {
    // restaurants ajax request
    $.ajax({
      url: `https://developers.zomato.com/api/v2.1/geocode?lat=${lat}&lon=${lon}`,
      dataType: "json",
      async: true,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("user-key", "cdbf16f90860f66af2b545b52ab9fdbf");
      }, // This inserts the api key into the HTTP header
      success: function (response) {
        // console.log(response);
        restaurantListings.empty();
        for (let i = 0; i < response.nearby_restaurants.length; i++) {
          let newRestaurant = $(
            `<a class="style-url right">${response.nearby_restaurants[i].restaurant.name}</a>`
          )
            // this url is taking them to the zomato website, should we send directely to food website?
            .attr("href", response.nearby_restaurants[i].restaurant.url)
            // blank target to open links in new tab
            .attr("target", "_blank");
          restaurantListings.append(newRestaurant);
          restaurantListings.append($("<br>"));
        }
      },
    });
  }

  // search for jobs button click event
  $("button.find-jobs").on("click", function () {
    const locationInputCity = jobLocationCity.val().trim();
    const locationInputState = jobLocationState.val().trim();

    // call jobs
    findJobs(locationInputCity, locationInputState);
  });

  //   target any job listing that is being clicked
  $(document).on("click", "div.jobListingClick", function () {
    // get company name
    const companyName = $(this).attr("data-name");
    // console.log(companyName);

    // get location
    const location = $(this).attr("data-location");
    // console.log(location);

    // call get coords function with name and location
    getCoordinates(companyName, location);
  });

  $(document).on("click", "form input", function () {
    // need if statement
    const form = $(this).closest("form");
    if ($(this).is(":checked")) {
      const savedJobName = form.attr("data-name");
      const savedJobCompany = form.attr("data-company");
      const savedJobLocation = form.attr("data-location");
      // get the job details (name, company, location)
      // local storage
      const savedJobObj = {
        name: savedJobName,
        company: savedJobCompany,
        location: savedJobLocation,
      };
      console.log(savedJobObj);
    } else {
      console.log("clear if out");
    }
  });
});
