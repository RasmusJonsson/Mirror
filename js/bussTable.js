var stopId= "9021014007160001";

/**
 * 	Studiegången, Läge A
 * 	Går in till stan
 */
setInterval(function(){

credentials = "X5R90HfgANE9RcV2tZJXlhwakFca" + ":" + "dMppIvPtP_9GvmzSk3Utyl3l8hoa";
encodedCrentedials = btoa(credentials);

var data2= '{"grant_type":"client_credentials", "scope":"X5R90HfgANE9RcV2tZJXlhwakFca"}';
var data1 = JSON.parse(data2);


var xhr = $.ajax({
    type: "POST",
    url: "https://api.vasttrafik.se/token",
    headers: {
        'Authorization' : 'Basic ' + encodedCrentedials,
    },
    contentType: "application/x-www-form-urlencoded",
    data: data1,
    success: function(data) {
        getData(data);
        console.log(data);
    }
});
console.log(xhr);


function getData(data) {
    var currentdate = new Date();
    var date =  currentdate.getFullYear() + "-"
        + (currentdate.getMonth()+1) + "-"
        + currentdate.getDate();
    var time = currentdate.getHours() + ":"
        + currentdate.getMinutes();

    $.ajax({
        type:"GET",
        url: "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=" + "9021014007160001" + "&date=" + date + "&time=" + time ,
        headers: {
            'Authorization' : 'Bearer ' + data.access_token,
        },
        success: function(recievedData) {
            populateTimeTable(recievedData);
        },
        error: function() {
            console.log("https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=" + data.access_token + "&date=" + date + "&time=" + time)
        }
    })
}},10000);

function populateTimeTable(recievedData) {
    console.log(recievedData);

    var departures = recievedData.getElementsByTagName("Departure");
    var filtredDepatureBoard = filterDepatureBoard(departures);
    var filteredStops = filtredDepatureBoard[0];
    var filteredDestinations = filtredDepatureBoard[1];

    $(".buss_container").each(function (index) {
        $(this).children(".departure_time").text(filteredStops[index]);
        $(this).children(".destination").text(filteredDestinations[index]);
    });

}

function filterDepatureBoard(data) {
    var filteredStops = [];
    var filteredDestinations = [];
    for(i = 0; i < data.length; i++) {
        if(data[i].getAttribute("track").localeCompare("A") == 0) {
            filteredStops.push(data[i].getAttribute("time"));
            filteredDestinations.push(data[i].getAttribute("direction"))
        }
    }
    return [filteredStops, filteredDestinations];
}