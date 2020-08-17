var apiKey = "eb427715aaf53ff889a6c5764adf94e1"

var currentCityDate = $("#city-name-date")
var currentTempEl = $("#current-temp")

var weatherIconEl = $("#weather-icon")
var cityLat = ""
var cityLon = ""

function onPageLoad() {

    if (localStorage.length >= 1) {
        for (i = localStorage.length - 1; i >= 0; i--) {
            var searchedCity = $("<button>").addClass("searched-city")
            $(".search-history").append(searchedCity.text(localStorage.key(i)))
        }

        var cityName = localStorage.key(localStorage.length - 1)
        var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=40&appid=" + apiKey


        $.ajax({
            url: forcastUrl,
            method: "GET"
        }).then(function (response) {

            var returnedCity = response.city.name
            var currentDate = moment(response.list[0].dt_text).format("MM/DD/YYYY")
            currentCityDate.text(returnedCity + " (" + currentDate + ")")

            var currentIcon = response.list[0].weather[0].icon
            weatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png")

            var currentTemp = ((response.list[0].main.temp - 273.15) * 1.80 + 32).toFixed(0)
            currentTempEl.text(currentTemp + "ºF")

            if (currentTemp <= 45) {
                currentTempEl.css("color", "blue")
            } else if (currentTemp >= 46 && currentTemp < 60) {
                currentTempEl.css("color", "skyblue")
            } else if (currentTemp >= 61 && currentTemp <= 79) {
                currentTempEl.css("color", "green")
            } else if (currentTemp >= 80 && currentTemp < 95) {
                currentTempEl.css("color", "orange")
            } else if (currentTemp >= 95) {
                currentTempEl.css("color", "red")
            }

            var currentHumidityEl = $("#current-humidity")
            var returnedHumidity = response.list[0].main.humidity
            currentHumidityEl.text("Humidity: " + returnedHumidity + "%")

            var currentWindEl = $("#current-wind-speed")
            var returnedWindSpeed = response.list[0].wind.speed.toFixed(0)
            currentWindEl.text("Wind speed: " + returnedWindSpeed + " mph")

            $(".forcast-boxes").empty()
            console.log(response)

            for (i = 3; i < response.list.length; i += 8) {

                console.log(response.list[i].dt_txt)
                var futureWeatherBox = $("<div>").attr("data-number", i)
                futureWeatherBox.addClass("future-weather-box")

                var futureDt = $("<h3>").addClass("date")
                futureDt.text(moment(response.list[i].dt_txt).format("MM/DD/YYYY"))

                var futureIconEl = $("<img>").addClass("weatherIcon")
                var futureIcon = response.list[i].weather[0].icon
                futureIconEl.attr("src", "http://openweathermap.org/img/wn/" + futureIcon + "@2x.png")

                var temperatureEl = $("<p>").addClass("temperature")
                var futureTemp = ((response.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(0)
                temperatureEl.text(futureTemp + "ºF")

                if (futureTemp <= 45) {
                    temperatureEl.css("color", "blue")
                } else if (futureTemp >= 46 && futureTemp < 60) {
                    temperatureEl.css("color", "skyblue")
                } else if (futureTemp >= 61 && futureTemp <= 79) {
                    temperatureEl.css("color", "green")
                } else if (futureTemp >= 80 && futureTemp < 95) {
                    temperatureEl.css("color", "orange")
                } else if (futureTemp >= 95) {
                    temperatureEl.css("color", "red")
                }

                var humidityEl = $("<p>").addClass("humidity")
                var futureHumidity = response.list[i].main.humidity
                humidityEl.text("Humidity: " + futureHumidity + "%")

                $(".forcast-boxes").append(futureWeatherBox.append(futureDt, futureIconEl, temperatureEl, humidityEl))
            }

            cityLat = response.city.coord.lat
            cityLon = response.city.coord.lon

            var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (response) {

                var currentUvEl = $("#current-uv-index")
                var currentUV = response.value
                currentUvEl.text("UV Index: " + currentUV)
                $("#uv-link").css("display", "block")

                if (currentUV < 3) {
                    currentUvEl.css("background-color", "green")
                } else if (currentUV >= 3 && currentUV < 6) {
                    currentUvEl.css("background-color", "yellow")
                } else if (currentUV >= 6 && currentUV < 8) {
                    currentUvEl.css("background-color", "orange")
                } else if (currentUV >= 8 && currentUV < 11) {
                    currentUvEl.css("background-color", "red")
                } else if (currentUV >= 11) {
                    currentUvEl.css("background-color", "violet")
                }
            })
        })
    }
}

function setInfo() {

    var cityName = $("#text-area").val()
    var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=40&appid=" + apiKey

    $.ajax({
        url: forcastUrl,
        method: "GET"
    }).then(function (response) {

        var returnedCity = response.city.name
        var currentDate = moment(response.list[0].dt_text).format("MM/DD/YYYY")
        currentCityDate.text(returnedCity + " (" + currentDate + ")")

        var currentIcon = response.list[0].weather[0].icon
        weatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png")

        var currentTemp = ((response.list[0].main.temp - 273.15) * 1.80 + 32).toFixed(0)
        currentTempEl.text(currentTemp + "ºF")

        if (currentTemp <= 45) {
            currentTempEl.css("color", "blue")
        } else if (currentTemp >= 46 && currentTemp < 60) {
            currentTempEl.css("color", "skyblue")
        } else if (currentTemp >= 61 && currentTemp <= 79) {
            currentTempEl.css("color", "green")
        } else if (currentTemp >= 80 && currentTemp < 95) {
            currentTempEl.css("color", "orange")
        } else if (currentTemp >= 95) {
            currentTempEl.css("color", "red")
        }

        var searchedCity = $("<button>").addClass("searched-city")
        $(".search-history").prepend(searchedCity.text(returnedCity))
        localStorage.setItem(returnedCity, returnedCity)

        var currentHumidityEl = $("#current-humidity")
        var returnedHumidity = response.list[0].main.humidity
        currentHumidityEl.text("Humidity: " + returnedHumidity + "%")

        var currentWindEl = $("#current-wind-speed")
        var returnedWindSpeed = response.list[0].wind.speed.toFixed(0)
        currentWindEl.text("Wind speed: " + returnedWindSpeed + " mph")

        $(".forcast-boxes").empty()

        for (i = 3; i < response.list.length; i += 8) {

            var futureWeatherBox = $("<div>").attr("data-number", i)
            futureWeatherBox.addClass("future-weather-box")

            var futureDt = $("<h3>").addClass("date")
            futureDt.text(moment(response.list[i].dt_txt).format("MM/DD/YYYY"))

            var futureIconEl = $("<img>").addClass("weatherIcon")
            var futureIcon = response.list[i].weather[0].icon
            futureIconEl.attr("src", "http://openweathermap.org/img/wn/" + futureIcon + "@2x.png")

            var temperatureEl = $("<p>").addClass("temperature")
            var futureTemp = ((response.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(0)
            temperatureEl.text(futureTemp + "ºF")

            if (futureTemp <= 45) {
                temperatureEl.css("color", "blue")
            } else if (futureTemp >= 46 && futureTemp < 60) {
                temperatureEl.css("color", "skyblue")
            } else if (futureTemp >= 61 && futureTemp <= 79) {
                temperatureEl.css("color", "green")
            } else if (futureTemp >= 80 && futureTemp < 95) {
                temperatureEl.css("color", "orange")
            } else if (futureTemp >= 95) {
                temperatureEl.css("color", "red")
            }

            var humidityEl = $("<p>").addClass("humidity")
            var futureHumidity = response.list[i].main.humidity
            humidityEl.text("Humidity: " + futureHumidity + "%")

            $(".forcast-boxes").append(futureWeatherBox.append(futureDt, futureIconEl, temperatureEl, humidityEl))
        }

        cityLat = response.city.coord.lat
        cityLon = response.city.coord.lon

        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (response) {

            var currentUvEl = $("#current-uv-index")
            var currentUV = response.value
            currentUvEl.text("UV Index: " + currentUV)
            $("#uv-link").css("display", "block")

            if (currentUV < 3) {
                currentUvEl.css("background-color", "green")
            } else if (currentUV >= 3 && currentUV < 6) {
                currentUvEl.css("background-color", "yellow")
            } else if (currentUV >= 6 && currentUV < 8) {
                currentUvEl.css("background-color", "orange")
            } else if (currentUV >= 8 && currentUV < 11) {
                currentUvEl.css("background-color", "red")
            } else if (currentUV >= 11) {
                currentUvEl.css("background-color", "violet")
            }
        })
    })

}

onPageLoad()

$("#search-btn").on("click", function () {
    setInfo()
})

$("#clear-history").on("click", function() {
    $(".search-history").empty()
    localStorage.clear()
})

$(".searched-city").on("click", function () {

    var cityName = $(this).text()
    var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=40&appid=" + apiKey

    $.ajax({
        url: forcastUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response)

        var returnedCity = response.city.name
        var currentDate = moment(response.list[0].dt_text).format("MM/DD/YYYY")
        currentCityDate.text(returnedCity + " (" + currentDate + ")")

        var currentIcon = response.list[0].weather[0].icon
        weatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png")

        var currentTemp = ((response.list[0].main.temp - 273.15) * 1.80 + 32).toFixed(0)
        currentTempEl.text(currentTemp + "ºF")

        if (currentTemp <= 45) {
            currentTempEl.css("color", "blue")
        } else if (currentTemp >= 46 && currentTemp < 60) {
            currentTempEl.css("color", "skyblue")
        } else if (currentTemp >= 61 && currentTemp <= 79) {
            currentTempEl.css("color", "green")
        } else if (currentTemp >= 80 && currentTemp < 95) {
            currentTempEl.css("color", "orange")
        } else if (currentTemp >= 95) {
            currentTempEl.css("color", "red")
        }

        var currentHumidityEl = $("#current-humidity")
        var returnedHumidity = response.list[0].main.humidity
        currentHumidityEl.text("Humidity: " + returnedHumidity + "%")

        var currentWindEl = $("#current-wind-speed")
        var returnedWindSpeed = response.list[0].wind.speed.toFixed(0)
        currentWindEl.text("Wind speed: " + returnedWindSpeed + " mph")

        $(".forcast-boxes").empty()

        for (i = 3; i < response.list.length; i += 8) {

            var futureWeatherBox = $("<div>").attr("data-number", i)
            futureWeatherBox.addClass("future-weather-box")

            var futureDt = $("<h3>").addClass("date")
            futureDt.text(moment(response.list[i].dt_txt).format("MM/DD/YYYY"))

            var futureIconEl = $("<img>").addClass("weatherIcon")
            var futureIcon = response.list[i].weather[0].icon
            futureIconEl.attr("src", "http://openweathermap.org/img/wn/" + futureIcon + "@2x.png")

            var temperatureEl = $("<p>").addClass("temperature")
            var futureTemp = ((response.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(0)
            temperatureEl.text(futureTemp + "ºF")

            if (futureTemp <= 45) {
                temperatureEl.css("color", "blue")
            } else if (futureTemp >= 46 && futureTemp < 60) {
                temperatureEl.css("color", "skyblue")
            } else if (futureTemp >= 61 && futureTemp <= 79) {
                temperatureEl.css("color", "green")
            } else if (futureTemp >= 80 && futureTemp < 95) {
                temperatureEl.css("color", "orange")
            } else if (futureTemp >= 95) {
                temperatureEl.css("color", "red")
            }

            var humidityEl = $("<p>").addClass("humidity")
            var futureHumidity = response.list[i].main.humidity
            humidityEl.text("Humidity: " + futureHumidity + "%")

            $(".forcast-boxes").append(futureWeatherBox.append(futureDt, futureIconEl, temperatureEl, humidityEl))
        }

        cityLat = response.city.coord.lat
        cityLon = response.city.coord.lon

        var uvURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function (response) {

            var currentUvEl = $("#current-uv-index")
            var currentUV = response.value
            currentUvEl.text("UV Index: " + currentUV)
            $("#uv-link").css("display", "block")

            if (currentUV < 3) {
                currentUvEl.css("background-color", "green")
            } else if (currentUV >= 3 && currentUV < 6) {
                currentUvEl.css("background-color", "yellow")
            } else if (currentUV >= 6 && currentUV < 8) {
                currentUvEl.css("background-color", "orange")
            } else if (currentUV >= 8 && currentUV < 11) {
                currentUvEl.css("background-color", "red")
            } else if (currentUV >= 11) {
                currentUvEl.css("background-color", "violet")
            }
        })
    })
})
