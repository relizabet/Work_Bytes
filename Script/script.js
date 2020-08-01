$(document).ready(function () {
    var lat;
    var lon;
    let jobListings = $("div.job-listings");
    let restaurantListings = $("div.restaurant-listings");
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
                    .attr("data-name", response.results[i].company.name)
                    .attr("data-location", response.results[i].locations[0].name)
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

    function getCoordinates(companyName, location) {
        // coordinates ajax request
        $.ajax({
            url: `http://www.mapquestapi.com/geocoding/v1/address?key=ZnAtTuiJDu6IN6Gr7hp9MS2MkxM9hNgT&location=${companyName}${location}`,
            method: "GET",
        }).then(function(response) {
            console.log(response);

            //get lat and lon
            lat = response.results[0].locations[0].displayLatLng.lat;
            lon = response.results[0].locations[0].displayLatLng.lng;

            // console.log(lat, lon);

            // call find bytes function with coords
            findBytes(lat, lon)
        })
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
                xhr.setRequestHeader("user-key", "e49950936f801133968055049e30f777");
            }, // This inserts the api key into the HTTP header
            success: function (response) {
                console.log(response);
                restaurantListings.empty();
                for (var i = 0; i < response.nearby_restaurants.length; i++) {
                    restaurantListings.append(`<p>${response.nearby_restaurants[i].restaurant.name}</p>`)
                }
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
    });

    //   target any job listing that is being clicked
    $(document).on("click", "div.jobListingClick", function () {

        // get company name
        let companyName = $(this).attr("data-name");
        // console.log(companyName);

        // get location
        let location = $(this).attr("data-location");
        // console.log(location);

        // call get coords function with name and location
        getCoordinates(companyName, location);
    });

});
