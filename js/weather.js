/**
 * Created by Dator on 2017-07-05.
 */

/*
 Studiegången
 Latitud: 57.7146607
 Longitud: 12.038828800000033
 Parsed
 Latitud: 57.714660
 Longitud: 12.038828

 Kan köra både pmp2g och pmp3g Kör pmp2g han blandar den var datan ligger.

 // "2017-07-05T18:00:00Z"
 */


var url = "http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/" +
    "point/lon/12.038828/lat/57.714660/data.json";


function startWeatherForecast() {
    $.ajax({
        url: url, dataType: 'json',
        success: function (response) {
            initWeather(response);
        },
        error: function () {
            alert("Something with the request to ''Smhi'' went wrong.")
        }
    });

}

var tempLowHigh;
var rainfall;
var wind;
var dayNames;

function initWeather(response) {

    theTimeSerie = response.timeSeries;

    tempLowHigh = getLowHigh(theTimeSerie);
    rainfall = getRainfall(theTimeSerie);
    wind = getWind(theTimeSerie);
    dayNames = ["Idag","Imorgon",getThirdDay()];
    weatherIcons = getWeatherIcons(theTimeSerie);
    populateWeather()
}

function populateWeather() {

    $(".day").each(function(index){
        // Set day name
        $(this).children(".day_name").text(dayNames[index]);
        // Set weather icon
        $(this).children(".weather_icon").addClass(getWeatherIcon(weatherIcons[index]));

    });
    $(".weather-info").each(function (index) {
        // Set temperature
        $(this).find(".temp_low").text(tempLowHigh[2*index].toString() + "°C");
        $(this).find(".temp_high").text(tempLowHigh[2*index+1].toString()+ "°C");
        // Set rainfall
        $(this).find(".rainfall").text(rainfall[index].toString()+ " mm");
        // Set wind_direction
        //$(this).children(".wind_direction").text(rainfall(index));
        // Set wind average and gust
        $(this).find(".wind_average").text(wind[2*index].toString());
        $(this).find(".wind_gust").text("("+wind[2*index+1].toString()+")");
    })
}

function getWeatherDataFromDate(timeSerie,code) {
    return timeSerie.filter(
        function(timeSerie){return timeSerie.validTime.substring(0,9) == code}
    );
}


function getWeatherIcon(iconNumber) {
    switch(iconNumber) {
        case 1:
        case 2:
            return "wi wi-day-sunny";
            break;
        case 3:
        case 6:
            return "wi wi-day-sunny-overcast";
            break;
        case 4:
            return "wi wi-day-cloudy";
            break;
        case 5:
            return "wi wi-cloudy";
            break;
        case 7:
            return "wi wi-fog";
            break;
        case 8:
            return "wi wi-showers";
            break;
        case 9:
            return "wi wi-thunderstorm";
            break;
        case 10:
        case 14:
            return "wi wi-sleet";
            break;
        case 11:
        case 15:
            return "wi wi-snow";
            break;
        case 12:
            return "wi wi-rain";
            break;
        case 13:
            return "wi wi-lightning";
            break;
    }
}

function getThirdDay(){
    var weekday=new Array(7);
    weekday[0] = "Söndag";
    weekday[1] = "Måndag";
    weekday[2] = "Tisdag";
    weekday[3] = "Onsdag";
    weekday[4] = "Torsdag";
    weekday[5] = "Fredag";
    weekday[6] = "Lördag";
    dayIndex = new Date().getDay();
    dayAfterTomorrow = (dayIndex + 2) % 7;
    return weekday[dayAfterTomorrow]

}

function getLowHigh(timeSerie) {
    // Någon liten bugg kvar med tredje dagen med den höga temperaturen
    var date = 0;
    var temperature = 0;
    var today = getTodayDate();
    var tomorrow = getTomorrowDate();
    var afterTomorrow = getDayAfterTomorrowDate();
    // today low,today high, tomorrow low....
    var tempLowHigh = [100, -100, 100, -100, 100, -100];
    for(var i = 0; i < timeSerie.length; i++){
        // Current index date
        date = timeSerie[i].validTime.substring(0,10);
        // Current index temperature
        //timeSerie[i].parameters[1].values[0].toFixed(0);
        temperature = Math.round(timeSerie[i].parameters[1].values[0]);

        // Parse today date
        if(date == today){
            //Set Low Temp
            if (temperature < tempLowHigh[0])  tempLowHigh[0] = temperature;
            //Set High Temp
            if (temperature > tempLowHigh[1])  tempLowHigh[1] = temperature;
        }
        // Parse tomorrows date
        if(date == tomorrow) {
            //Set Low Temp
            if (temperature < tempLowHigh[2])  tempLowHigh[2] = temperature;
            //Set High Temp
            if (temperature > tempLowHigh[3])  tempLowHigh[3] = temperature;
        }
        // Parse after tomorrows date
        if(date == afterTomorrow) {
            //Set Low Temp
            if (temperature < tempLowHigh[4])  tempLowHigh[4] = temperature;
            //Set High Temp
            if (temperature > tempLowHigh[5])  tempLowHigh[5] = temperature;
        }
    }
    return tempLowHigh;
}

function getRainfall(timeSerie) {
    var date = 0;
    var today = getTodayDate();
    var tomorrow = getTomorrowDate();
    var afterTomorrow = getDayAfterTomorrowDate();
    var rainfall = 0;
    //Rainfall today,tomorrow,afterTomorrow
    var totalRainfall = [0,0,0];

    for(var i = 0; i < timeSerie.length; i++){
        date = timeSerie[i].validTime.substring(0,10);
        // Medelvärdet
        rainfall = timeSerie[i].parameters[16].values[0];

        if(date == today){
            totalRainfall[0] += rainfall;
        }
        if(date == tomorrow) {
            totalRainfall[1] += rainfall;
        }
        if(date == afterTomorrow) {
            totalRainfall[2] += rainfall;
        }
    }

    for(var j = 0; j < totalRainfall.length; j++){
        totalRainfall[j] = parseFloat(Math.round(totalRainfall[j] * 10) / 10).toFixed(1);
    }
    return totalRainfall;
}

function getWind(timeSerie) {
    var today = getTodayDate()+ "T" + new Date().hour()+":00:00Z";
    var tomorrow = getTomorrowDate()+ "T13:00:00Z";
    var afterTomorrow = getDayAfterTomorrowDate()+ "T12:00:00Z";
    // Today wind, today gust, tomorrow wind...
    var windData = [0,0,0,0,0,0];

    var todayData = getWeatherData(timeSerie,today);
    var tomorrowData = getWeatherData(timeSerie,tomorrow);
    var afterTomorrowData = getWeatherData(timeSerie,afterTomorrow);

    windData[0] = todayData[0].parameters[4].values[0];
    windData[1] = todayData[0].parameters[11].values[0];
    windData[2] = tomorrowData[0].parameters[4].values[0];
    windData[3] = tomorrowData[0].parameters[11].values[0];
    windData[4] = afterTomorrowData[0].parameters[4].values[0];
    windData[5] = afterTomorrowData[0].parameters[11].values[0];

    return windData;

}

function getWeatherIcons(timeSerie) {
    var today = getTodayDate()+ "T" + new Date().hour()+":00:00Z";
    var tomorrow = getTomorrowDate()+ "T13:00:00Z";
    var afterTomorrow = getDayAfterTomorrowDate()+ "T12:00:00Z";

    var weatherIcons = [0,0,0];

    var todayData = getWeatherData(timeSerie,today);
    var tomorrowData = getWeatherData(timeSerie,tomorrow);
    var afterTomorrowData = getWeatherData(timeSerie,afterTomorrow);

    weatherIcons[0] = todayData[0].parameters[18].values[0];
    weatherIcons[1] = tomorrowData[0].parameters[18].values[0];
    weatherIcons[2] = afterTomorrowData[0].parameters[18].values[0];

    return weatherIcons;
}

Date.prototype.today = function () {
    return this.getFullYear() + "-" +(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-" +((this.getDate() < 10)?"0":"") + this.getDate();
};

Date.prototype.hour = function () {
    return ((this.getHours() < 10)?"0":"") + this.getHours();
};

function getTodayDate() {
    return new Date().today();// + "T" + new Date().hour()+":00:00Z";
}

function getTomorrowDate() {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    return currentDate.today();// + "T13:00:00Z";
}

function getDayAfterTomorrowDate() {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 2);
    return currentDate.today();// + "T12:00:00Z";
}

function getWeatherData(timeSerie,code) {
    return timeSerie.filter(
        function(timeSerie){return timeSerie.validTime == code}
    );
}



