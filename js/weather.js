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
var weekday = new Array(7);
weekday[0] = "Söndag";
weekday[1] = "Måndag";
weekday[2] = "Tisdag";
weekday[3] = "Onsdag";
weekday[4] = "Torsdag";
weekday[5] = "Fredag";
weekday[6] = "Lördag";

var url = "http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/" +
    "point/lon/12.038828/lat/57.714660/data.json";


function startWeatherForecast() {
    $.ajax({
        url: url, dataType: 'json',
        success: function (response) {
            initWeather(response.timeSeries);
        },
        error: function () {
            alert("Something with the request to ''Smhi'' went wrong.")
        }
    });
}

function initWeather(theTimeSerie) {
    $("#today").find('.weather-temperature').text(theTimeSerie[getIndexForToday(theTimeSerie)].parameters[1].values[0].toFixed(1) + " ⁰C");
    $("#tomorrow").find('.weather-temperature').text(theTimeSerie[getIndexForTomorrow(theTimeSerie)].parameters[1].values[0].toFixed(1) + " ⁰C");
    $("#thirdDay").find('.weather-temperature').text(theTimeSerie[getIndexForThirdDay(theTimeSerie)].parameters[1].values[0].toFixed(1) + " ⁰C");

    $("#today").find('.weather-icon').addClass(getWeatherIcon(theTimeSerie[getIndexForToday(theTimeSerie)].parameters[18].values[0]));
    $("#tomorrow").find('.weather-icon').addClass(getWeatherIcon(theTimeSerie[getIndexForTomorrow(theTimeSerie)].parameters[18].values[0]));
    $("#thirdDay").find('.weather-icon').addClass(getWeatherIcon(theTimeSerie[getIndexForThirdDay(theTimeSerie)].parameters[18].values[0]));
}

function getIndexForToday(theTimeSerie) {
    var index = 0;
    var timeForCurrentIndex = theTimeSerie[index].validTime.substring(11,13);
    //console.log(timeForCurrentIndex);


    while( 14 - timeForCurrentIndex != 0) {
        index++;
        timeForCurrentIndex = theTimeSerie[index].validTime.substring(11,13);
    }

    return index;
}
function getIndexForTomorrow(theTimeSerie) {
    var index = getIndexForToday(theTimeSerie) + 1;
    var timeForCurrentIndex = theTimeSerie[index].validTime.substring(11,13);
    while( 14 - timeForCurrentIndex != 0) {
        index++;
        timeForCurrentIndex = theTimeSerie[index].validTime.substring(11,13);
    }
    return index;
}
function getIndexForThirdDay(theTimeSerie) {
    var index = getIndexForTomorrow(theTimeSerie) + 1;
    var timeForCurrentIndex = theTimeSerie[index].validTime.substring(11,13);
    while( 12 - timeForCurrentIndex != 0) {
        index++;
        timeForCurrentIndex = theTimeSerie[index].validTime.substring(11,13);
    }
    return index;
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

function getRainfall() {

}





