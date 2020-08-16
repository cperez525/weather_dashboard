function setInfo() {

    var apiKey = "eb427715aaf53ff889a6c5764adf94e1"
    var cityName = $("#text-area").val()
    var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=6&appid=" + apiKey

    $.ajax({
        url: weatherUrl,
        method: "GET"
    }).then(function (response) {
        
    })
}

$("#search-btn").on("click", function () {
    setInfo()
})

