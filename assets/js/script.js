getLocalStorageInfo();
$("#search-button").on("click", getSearchedCity);

function getSearchedCity(){ //Getting weather data from searched city
    let searchedCity = $("#city-search").val();
    getWeather(searchedCity);
};

function getRecentCity(){ //Getting weather data from recent city
    let recentCity = $(this).text();
    getWeather(recentCity);
}

function getWeather(city){
    let currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=bc0e6a9a6e2ed4c45d519d424670be13&units=imperial"; //API url for current weather
    let fiveDayQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + ",us&mode=json&APPID=bc0e6a9a6e2ed4c45d519d424670be13&units=imperial"; //API url for five-day forecast
    
    $.ajax({
        url: currentQueryURL,
        method: "GET"
    }).then(function(response){
        setDates();
        getCurrentWeather(response);
        // handleLocalStorage();
        getUvIndex(response);
        handleRecents(response);
    });

    $.ajax({
        url: fiveDayQueryURL,
        method: "GET"
    }).then(function(response){
        getFiveDayForecast(response);
    });
}

let recentsArray = [];
function handleRecents(res){
    $("#recent-searches-header").addClass("d-block");
    
    let recentLink = $("<a>").addClass("list-group-item");
    recentLink.attr("href", "#");

    // Only prepends link if it's not already viewable in recent searches
    if (recentsArray.includes(res.name) == false){
        recentsArray.push(res.name);
        recentLink.text(res.name);
        $("#recent-searches").prepend(recentLink);

        // Preventing page from being flooded with recent searches
        if ($("#recent-searches").children().length > 8){
            $("#recent-searches").children().last().remove();
        }
    }
    recentLink.on("click", getRecentCity);
}

function getCurrentWeather(res){
    let cityName = res.name;
    let currentWeatherIcon = res.weather[0].icon;
    let currentTemp = res.main.temp;
    let currentHumidity = res.main.humidity;
    let currentWindSpeed = res.wind.speed;

    // Appends weather data to page
    $("#city-name").text(cityName);
    $("#current-weather").attr("src", "http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png");
    $("#current-temperature").text(currentTemp.toFixed() + " °F");
    $("#current-humidity").text(currentHumidity + "%");
    $("#current-wind-speed").text(currentWindSpeed.toFixed(1) + " mph");

    localStorage.setItem("cityNameVal", cityName);
    localStorage.setItem("currentWeatherIconVal", currentWeatherIcon);
    localStorage.setItem("currentTempVal", currentTemp.toFixed() + " °F");
    localStorage.setItem("currentHumidityVal", currentHumidity + "%");
    localStorage.setItem("currentWindSpeedVal", currentWindSpeed.toFixed(1) + " mph");
}

function getUvIndex(res){
    let uvIndexURL = "http://api.openweathermap.org/data/2.5/uvi?appid=" + "bc0e6a9a6e2ed4c45d519d424670be13" + "&lat=" + res.coord.lat + "&lon=" + res.coord.lon;
    $.ajax({
        url: uvIndexURL,
        method: "GET"
    }).then(function(response){
        $("#current-uv-index").text(response.value);
        $("#current-uv-index").css("display", "initial");
        localStorage.setItem("UVindexVal", response.value);
    })
}

function getFiveDayForecast(res){
    let weatherIntervals = res.list;

    // Declaring variables for high and low temperatures for five day forecast
    let dayOneLow = null;
    let dayOneHigh = null;
    let dayTwoLow = null;
    let dayTwoHigh = null;
    let dayThreeLow = null;
    let dayThreeHigh = null;
    let dayFourLow = null;
    let dayFourHigh = null;
    let dayFiveLow = null;
    let dayFiveHigh = null;

    // Declaring variables for humidity for five day forecast
    let dayOneHumidity = 0;
    let dayTwoHumidity = 0;
    let dayThreeHumidity = 0;
    let dayFourHumidity = 0;
    let dayFiveHumidity = 0;

    // Getting high and low temperatures of day one
    for (i = 0; i < 8; i++){
        dayOneHumidity += weatherIntervals[i].main.humidity;
        if (dayOneLow > weatherIntervals[i].main.temp_min || dayOneLow == null){
            dayOneLow = weatherIntervals[i].main.temp_min;
        }
        if (dayOneHigh < weatherIntervals[i].main.temp_max || dayOneHigh == null){
            dayOneHigh = weatherIntervals[i].main.temp_max;
        }
    }

    dayOneHumidity = dayOneHumidity / 8; //Averaging out humidity for the day
    $("#day-one-high").text(dayOneHigh.toFixed() + " °F");
    $("#day-one-low").text(dayOneLow.toFixed() + " °F");
    $("#day-one-humidity").text(dayOneHumidity.toFixed() + "%");
    $("#day-one-weather").attr("src", "http://openweathermap.org/img/wn/" + weatherIntervals[5].weather[0].icon + "@2x.png");
    localStorage.setItem("dayOneHighVal", dayOneHigh.toFixed() + " °F");
    localStorage.setItem("dayOneLowVal", dayOneLow.toFixed() + " °F");
    localStorage.setItem("dayOneHumidityVal", dayOneHumidity.toFixed() + "%");
    localStorage.setItem("dayOneWeatherIconVal", weatherIntervals[5].weather[0].icon);

    // Getting high and low temperatures of day two
    for (i = 8; i < 16; i++){
        dayTwoHumidity += weatherIntervals[i].main.humidity;
        if (dayTwoLow > weatherIntervals[i].main.temp_min || dayTwoLow == null){
            dayTwoLow = weatherIntervals[i].main.temp_min;
        }
        if (dayTwoHigh < weatherIntervals[i].main.temp_max || dayTwoHigh == null){
            dayTwoHigh = weatherIntervals[i].main.temp_max;
        }
    }
    
    dayTwoHumidity = dayTwoHumidity / 8; //Averaging out humidity for the day
    $("#day-two-high").text(dayTwoHigh.toFixed() + " °F");
    $("#day-two-low").text(dayTwoLow.toFixed() + " °F");
    $("#day-two-humidity").text(dayTwoHumidity.toFixed() + "%");
    $("#day-two-weather").attr("src", "http://openweathermap.org/img/wn/" + weatherIntervals[13].weather[0].icon + "@2x.png");
    localStorage.setItem("dayTwoHighVal", dayTwoHigh.toFixed() + " °F");
    localStorage.setItem("dayTwoLowVal", dayTwoLow.toFixed() + " °F");
    localStorage.setItem("dayTwoHumidityVal", dayTwoHumidity.toFixed() + "%");
    localStorage.setItem("dayTwoWeatherIconVal", weatherIntervals[13].weather[0].icon);

    // Getting high and low temperatures of day three
    for (i = 16; i < 24; i++){
        dayThreeHumidity += weatherIntervals[i].main.humidity;
        if (dayThreeLow > weatherIntervals[i].main.temp_min || dayThreeLow == null){
            dayThreeLow = weatherIntervals[i].main.temp_min;
        }
        if (dayThreeHigh < weatherIntervals[i].main.temp_max || dayThreeHigh == null){
            dayThreeHigh = weatherIntervals[i].main.temp_max;
        }
    }

    dayThreeHumidity = dayThreeHumidity / 8; //Averaging out humidity for the day
    $("#day-three-high").text(dayThreeHigh.toFixed() + " °F");
    $("#day-three-low").text(dayThreeLow.toFixed() + " °F");
    $("#day-three-humidity").text(dayThreeHumidity.toFixed() + "%");
    $("#day-three-weather").attr("src", "http://openweathermap.org/img/wn/" + weatherIntervals[21].weather[0].icon + "@2x.png");
    localStorage.setItem("dayThreeHighVal", dayThreeHigh.toFixed() + " °F");
    localStorage.setItem("dayThreeLowVal", dayThreeLow.toFixed() + " °F");
    localStorage.setItem("dayThreeHumidityVal", dayThreeHumidity.toFixed() + "%");
    localStorage.setItem("dayThreeWeatherIconVal", weatherIntervals[21].weather[0].icon);

    // Getting high and low temperatures of day four
    for (i = 24; i < 32; i++){
        dayFourHumidity += weatherIntervals[i].main.humidity;
        if (dayFourLow > weatherIntervals[i].main.temp_min || dayFourLow == null){
            dayFourLow = weatherIntervals[i].main.temp_min;
        }
        if (dayFourHigh < weatherIntervals[i].main.temp_max || dayFourHigh == null){
            dayFourHigh = weatherIntervals[i].main.temp_max;
        }
    }

    dayFourHumidity = dayFourHumidity / 8; //Averaging out humidity for the day
    $("#day-four-high").text(dayFourHigh.toFixed() + " °F");
    $("#day-four-low").text(dayFourLow.toFixed() + " °F");
    $("#day-four-humidity").text(dayFourHumidity.toFixed() + "%");
    $("#day-four-weather").attr("src", "http://openweathermap.org/img/wn/" + weatherIntervals[29].weather[0].icon + "@2x.png");
    localStorage.setItem("dayFourHighVal", dayFourHigh.toFixed() + " °F");
    localStorage.setItem("dayFourLowVal", dayFourLow.toFixed() + " °F");
    localStorage.setItem("dayFourHumidityVal", dayFourHumidity.toFixed() + "%");
    localStorage.setItem("dayFourWeatherIconVal", weatherIntervals[29].weather[0].icon);

    // Getting high and low temperatures of day five
    for (i = 32; i < 40; i++){
        dayFiveHumidity += weatherIntervals[i].main.humidity;
        if (dayFiveLow > weatherIntervals[i].main.temp_min || dayFiveLow == null){
            dayFiveLow = weatherIntervals[i].main.temp_min;
        }
        if (dayFiveHigh < weatherIntervals[i].main.temp_max || dayFiveHigh == null){
            dayFiveHigh = weatherIntervals[i].main.temp_max;
        }
    }

    dayFiveHumidity = dayFiveHumidity / 8; //Averaging out humidity for the day
    $("#day-five-high").text(dayFiveHigh.toFixed() + " °F");
    $("#day-five-low").text(dayFiveLow.toFixed() + " °F");
    $("#day-five-humidity").text(dayFiveHumidity.toFixed() + "%");
    $("#day-five-weather").attr("src", "http://openweathermap.org/img/wn/" + weatherIntervals[37].weather[0].icon + "@2x.png");
    localStorage.setItem("dayFiveHighVal", dayFiveHigh.toFixed() + " °F");
    localStorage.setItem("dayFiveLowVal", dayFiveLow.toFixed() + " °F");
    localStorage.setItem("dayFiveHumidityVal", dayFiveHumidity.toFixed() + "%");
    localStorage.setItem("dayFiveWeatherIconVal", weatherIntervals[37].weather[0].icon);
}

function setDates(){
    //Setting up current date
    let date = new Date();
    let currentDay = date.getDate();
    let currentMonth = date.getMonth() + 1;
    let currentYear = date.getFullYear();
    let currentDate = + currentMonth + "-" + currentDay + "-" + currentYear;
    $("#current-date").text(currentDate);
    let currentDateLS = currentDate;
    localStorage.setItem("currentDateVal", currentDateLS);

    //Declaring variables for each forecast date
    let fcOne = new Date();
    let fcTwo = new Date();
    let fcThree = new Date();
    let fcFour = new Date();
    let fcFive = new Date();

    //Setting each forecast date variable one day beyond the previous
    fcOne.setDate(fcOne.getDate(currentDate) + 1);
    fcTwo.setDate(fcTwo.getDate(currentDate) + 2);
    fcThree.setDate(fcThree.getDate(currentDate) + 3);
    fcFour.setDate(fcFour.getDate(currentDate) + 4);
    fcFive.setDate(fcFive.getDate(currentDate) + 5);

    //Setting the month for each forecast date variable
    let fcOneMonth = fcOne.getMonth() + 1;
    let fcTwoMonth = fcTwo.getMonth() + 1;
    let fcThreeMonth = fcThree.getMonth() + 1;
    let fcFourMonth = fcFour.getMonth() + 1;
    let fcFiveMonth = fcFive.getMonth() + 1;

    //Setting the day for each forecast date variable
    let fcOneDay = fcOne.getDate();
    let fcTwoDay = fcTwo.getDate();
    let fcThreeDay = fcThree.getDate();
    let fcFourDay = fcFour.getDate();
    let fcFiveDay = fcFive.getDate();

    //Setting the year for each forecast date variable
    let fcOneYear = fcOne.getFullYear();
    let fcTwoYear = fcTwo.getFullYear();
    let fcThreeYear = fcThree.getFullYear();
    let fcFourYear = fcFour.getFullYear();
    let fcFiveYear = fcFive.getFullYear();

    //Declaring variables to hold a formatted string of each forecast date
    let fcOneDate = + fcOneMonth + "-" + fcOneDay + "-" + fcOneYear;
    let fcTwoDate = + fcTwoMonth + "-" + fcTwoDay + "-" + fcTwoYear;
    let fcThreeDate = + fcThreeMonth + "-" + fcThreeDay + "-" + fcThreeYear;
    let fcFourDate = + fcFourMonth + "-" + fcFourDay + "-" + fcFourYear;
    let fcFiveDate = + fcFiveMonth + "-" + fcFiveDay + "-" + fcFiveYear;

    localStorage.setItem("fcOneDateVal", fcOneDate);
    localStorage.setItem("fcTwoDateVal", fcTwoDate);
    localStorage.setItem("fcThreeDateVal", fcThreeDate);
    localStorage.setItem("fcFourDateVal", fcFourDate);
    localStorage.setItem("fcFiveDateVal", fcFiveDate);

    //Appending forecast dates to page
    $("#day-one-date").text(fcOneDate);
    $("#day-two-date").text(fcTwoDate);
    $("#day-three-date").text(fcThreeDate);
    $("#day-four-date").text(fcFourDate);
    $("#day-five-date").text(fcFiveDate);
};

function getLocalStorageInfo(){
    $("#city-name").text(localStorage.getItem("cityNameVal"));

    if ($("#city-name").text()){
        $("#current-temperature").text(localStorage.getItem("currentTempVal"));
        $("#current-humidity").text(localStorage.getItem("currentHumidityVal"));
        $("#current-wind-speed").text(localStorage.getItem("currentWindSpeedVal"));
        $("#current-weather").attr("src", "http://openweathermap.org/img/wn/" + localStorage.getItem("currentWeatherIconVal") + "@2x.png");
        $("#current-uv-index").css("display", "initial");
        $("#current-date").text(localStorage.getItem("currentDateVal"));
        $("#current-uv-index").text(localStorage.getItem("UVindexVal"));

        $("#day-one-date").text(localStorage.getItem("fcOneDateVal"));
        $("#day-two-date").text(localStorage.getItem("fcTwoDateVal"));
        $("#day-three-date").text(localStorage.getItem("fcThreeDateVal"));
        $("#day-four-date").text(localStorage.getItem("fcFourDateVal"));
        $("#day-five-date").text(localStorage.getItem("fcFiveDateVal"));

        $("#day-one-high").text(localStorage.getItem("dayOneHighVal"));
        $("#day-one-low").text(localStorage.getItem("dayOneLowVal"));
        $("#day-one-humidity").text(localStorage.getItem("dayOneHumidityVal"));
        $("#day-one-weather").attr("src", "http://openweathermap.org/img/wn/" + localStorage.getItem("dayOneWeatherIconVal") + "@2x.png");

        $("#day-two-high").text(localStorage.getItem("dayTwoHighVal"));
        $("#day-two-low").text(localStorage.getItem("dayTwoLowVal"));
        $("#day-two-humidity").text(localStorage.getItem("dayTwoHumidityVal"));
        $("#day-two-weather").attr("src", "http://openweathermap.org/img/wn/" + localStorage.getItem("dayTwoWeatherIconVal") + "@2x.png");

        $("#day-three-high").text(localStorage.getItem("dayThreeHighVal"));
        $("#day-three-low").text(localStorage.getItem("dayThreeLowVal"));
        $("#day-three-humidity").text(localStorage.getItem("dayThreeHumidityVal"));
        $("#day-three-weather").attr("src", "http://openweathermap.org/img/wn/" + localStorage.getItem("dayThreeWeatherIconVal") + "@2x.png");

        $("#day-four-high").text(localStorage.getItem("dayFourHighVal"));
        $("#day-four-low").text(localStorage.getItem("dayFourLowVal"));
        $("#day-four-humidity").text(localStorage.getItem("dayFourHumidityVal"));
        $("#day-four-weather").attr("src", "http://openweathermap.org/img/wn/" + localStorage.getItem("dayFourWeatherIconVal") + "@2x.png");

        $("#day-five-high").text(localStorage.getItem("dayFiveHighVal"));
        $("#day-five-low").text(localStorage.getItem("dayFiveLowVal"));
        $("#day-five-humidity").text(localStorage.getItem("dayFiveHumidityVal"));
        $("#day-five-weather").attr("src", "http://openweathermap.org/img/wn/" + localStorage.getItem("dayFiveWeatherIconVal") + "@2x.png");
    }
}