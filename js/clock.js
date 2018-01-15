
var month = ["Januari","Februari","Mars","April","Maj","Juni","Juli","Augusti","September","Oktober","November","December"];

function populateClock() {
    var d=new Date();
    var hour=d.getHours(),min=d.getMinutes();
    if(min<=9) min="0"+min;
    var date = d.getDate();
    var monthIndex = d.getMonth();
    $(".time").text(hour+":"+min);
    $(".date").text(date +" "+ month[monthIndex])

}

