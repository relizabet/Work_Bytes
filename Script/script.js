$(document).ready(function () {

    var widget = $("div.widget-wrap");
    var lat;
    var lon;

    var apiKey = "08b0f7f65564475254bb83cd500444bd4cbc421bdbe6f0dc120b7552e822dc21";
    var widgetSRC = `https://www.zomato.com/widgets/res_search_widget.php?lat=${lat}&lon=${lon}&theme=red&hideCitySearch=on&hideResSearch=on&widgetType=small&sort=distance`

    function findJobs() {

        // jobs ajax request
        $.ajax({
            url: `https://www.themuse.com/api/public/jobs?page=1&descending=true&api_key=${apiKey}`,
            method: "GET"
        }).then(function(response) {
            console.log(response)

        })
    }

    // function findBytes() {

        // restaurants ajax request
        $.ajax({
            url: "https://developers.zomato.com/api/v2.1/categories?",
            dataType: 'json',
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('user-key',
                    'e49950936f801133968055049e30f777');
            },  // This inserts the api key into the HTTP header
            success: function (response) {
                console.log(response)



            }
        });
    // }

    // search for jobs button click event
    $("button.find-jobs").on("click", function () {

        // findJobs();

        lat = 25.6;
        lon = 25.6;

        widget.append("src", widgetSRC);
        console.log(widget);

    });



});
