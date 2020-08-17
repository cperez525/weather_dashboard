// Global variables
var apiKey = "eb427715aaf53ff889a6c5764adf94e1"

var currentCityDate = $("#city-name-date")
var currentTempEl = $("#current-temp")

var weatherIconEl = $("#weather-icon")
var cityLat = ""
var cityLon = ""

function onPageLoad() {

    // checks if cities exist in local storage, and renders them as buttons if so
    if (localStorage.length >= 1) {
        for (i = localStorage.length - 1; i >= 0; i--) {
            var searchedCity = $("<button>").addClass("searched-city")
            $(".search-history").append(searchedCity.text(localStorage.key(i)))
        }

        // runs ajax query with the last stored city as the searched city
        var cityName = localStorage.key(localStorage.length - 1)
        var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey

        $.ajax({
            url: currentURL,
            method: "GET"
        }).then(function (response) {

            console.log(response)

            // gets city name and sets both the city name and current date to current weather header
            var returnedCity = response.name
            var currentDate = moment().format("MM/DD/YYYY")
            currentCityDate.text(returnedCity + " (" + currentDate + ")")

            // gets weather and adds src url to render icon
            var currentIcon = response.weather[0].icon
            weatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png")

            // gets current temperature and colors temperature font based on temperature returned
            var currentTemp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(0)
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

            // gets and renders current humidity
            var currentHumidityEl = $("#current-humidity")
            var returnedHumidity = response.main.humidity
            currentHumidityEl.text("Humidity: " + returnedHumidity + "%")

            // gets and renders current wind speed
            var currentWindEl = $("#current-wind-speed")
            var returnedWindSpeed = response.wind.speed.toFixed(0)
            currentWindEl.text("Wind speed: " + returnedWindSpeed + " mph")

            // gets coordinates to pass into UVI api url
            cityLat = response.coord.lat
            cityLon = response.coord.lon

            var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon

            $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function (response) {

                // gets uv index value
                var currentUvEl = $("#current-uv-index")
                var currentUV = response.value
                currentUvEl.text("UV Index: " + currentUV)
                $("#uv-link").css("display", "block")

                // colors uv index button based on what the uv index value is
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

        // getting and setting forcast for next 5 days
        var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=40&appid=" + apiKey

        $.ajax({
            url: forcastUrl,
            method: "GET"
        }).then(function (response) {

            $(".forcast-boxes").empty()

            // increments i variable by 8 to skip to constant time of each day, loops through each day returned by API
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
        })
    }
}

function setInfo() {

    // sets city name for api call based on text entered by user in text box
    var cityName = $("#text-area").val()

    // most of the following is repeated from the ajax functions in the onPageLoad() function
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey

    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(function (response) {

        var returnedCity = response.name
        var currentDate = moment().format("MM/DD/YYYY")
        currentCityDate.text(returnedCity + " (" + currentDate + ")")

        // creates button with city name set as button text and added to top of search history list
        var searchedCity = $("<button>").addClass("searched-city")
        $(".search-history").prepend(searchedCity.text(returnedCity))
        localStorage.setItem(returnedCity, returnedCity)

        var currentIcon = response.weather[0].icon
        weatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png")

        var currentTemp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(0)
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
        var returnedHumidity = response.main.humidity
        currentHumidityEl.text("Humidity: " + returnedHumidity + "%")

        var currentWindEl = $("#current-wind-speed")
        var returnedWindSpeed = response.wind.speed.toFixed(0)
        currentWindEl.text("Wind speed: " + returnedWindSpeed + " mph")

        cityLat = response.coord.lat
        cityLon = response.coord.lon

        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon

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



    var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=40&appid=" + apiKey

    $.ajax({
        url: forcastUrl,
        method: "GET"
    }).then(function (response) {


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
    })

}

onPageLoad()

// click listener for search icon
$("#search-btn").on("click", function () {
    setInfo()
})

// enter key listener for text box to cover use case as users will typically press enter instinctively
$("#text-area").on("keypress", function(e) {
    if (e.which === 13) {
        setInfo()
    }
})

// click listener for clear history button to clear local storage and search-history buttons
$("#clear-history").on("click", function () {
    $(".search-history").empty()
    localStorage.clear()
})

// renders current weather and future forcast data for search history button's city name
$(".searched-city").on("click", function () {

    var cityName = $(this).text()
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey

    $.ajax({
        url: currentURL,
        method: "GET"
    }).then(function (response) {

        var returnedCity = response.name
        var currentDate = moment().format("MM/DD/YYYY")
        currentCityDate.text(returnedCity + " (" + currentDate + ")")

        var currentIcon = response.weather[0].icon
        weatherIconEl.attr("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png")

        var currentTemp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(0)
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
        var returnedHumidity = response.main.humidity
        currentHumidityEl.text("Humidity: " + returnedHumidity + "%")

        var currentWindEl = $("#current-wind-speed")
        var returnedWindSpeed = response.wind.speed.toFixed(0)
        currentWindEl.text("Wind speed: " + returnedWindSpeed + " mph")

        cityLat = response.coord.lat
        cityLon = response.coord.lon

        var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon

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

    var forcastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=40&appid=" + apiKey

    $.ajax({
        url: forcastUrl,
        method: "GET"
    }).then(function (response) {

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
    })
})
