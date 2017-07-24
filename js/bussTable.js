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
            useData(recievedData);
        },
        error: function() {
            console.log("https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id=" + data.access_token + "&date=" + date + "&time=" + time)
        }
    })
}},10000);

function useData(recievedData) {
    console.log(recievedData);
    var departures = recievedData.getElementsByTagName("Departure");
    var filteredStops = filterDepatureBoard(departures);

    //$("#buss1").text(departures[0].getAttribute("name"));
    $("#buss1").children(".departure").text(filteredStops[0]);
    //$("#buss2").text(departures[1].getAttribute("name"));
    $("#buss2").children(".departure").text(filteredStops[1]);
    //$("#buss3").text(departures[2].getAttribute("name"));
    $("#buss3").children(".departure").text(filteredStops[2]);

}

function filterDepatureBoard(data) {
    var filteredStops = [];
    for(i = 0; i < data.length; i++) {
        if(data[i].getAttribute("track").localeCompare("A") == 0) {
            filteredStops.push(data[i].getAttribute("time"));
        }
    }
    return filteredStops;
}