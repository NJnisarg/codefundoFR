// Constants
const baseUrl = 'http://localhost:8000';
var socket = io(baseUrl);

var headers = {"Content-Type":"application/json"};

// Helper functions
function check_login()
{
    if(localStorage.getItem("isLoggedIn")!=="true") {
        safeRemoval();
        return false;
    }
    if(localStorage.getItem("userId") === null || localStorage.getItem("userId") === undefined) {
        safeRemoval();
        return false;
    }
    if(localStorage.getItem("token") === null || localStorage.getItem("token") === undefined) {
        safeRemoval();
        return false;
    }

    return true;
}

function safeRemoval()
{
    var i = localStorage.length, key;
    while (i--)
    {
        key = localStorage.key(i);
        if(key!=="roomId")
            localStorage.removeItem(key);
    }

    var j = sessionStorage.length, key2;
    while(j--)
    {
        key2 = sessionStorage.key(j);
        if(key!=="roomId")
            localStorage.removeItem(key);
    }
}

// Onload handlers
$(document).ready(function(){

    if(check_login() && localStorage.getItem("roomId") !== null)
    {
        window.location.replace("event_room.html");
    }
    else if(check_login() && (localStorage.getItem("roomId")===null || localStorage.getItem("roomId")===undefined))
    {
        window.location.replace("dashboard.html");
    }
    else if(localStorage.getItem("roomId")===null || localStorage.getItem("roomId")===undefined)
    {
        window.location.replace("index.html");
    }
    else
    {
        // stay on this page
    }

    $.ajax({
        url: baseUrl + '/pingRoom/getMsgs/' + localStorage.getItem("roomId"),
        type:"GET",
        headers:headers
    }).done(function(response){
        console.log(response);

        var msgArr = response.data.msgArray;
        msgArr.forEach(function(data){
            var msgElement = $("<p><span style=\"margin:10px; font-weight: bold;\">@" + data.handle + ":</span><span>" + data.msg + "</span></p>");
            $("#ping-room").append(msgElement);
        });
    }).fail(function(error){
        console.log(error);
    });


    // Handling the incoming messages
    socket.on('ping_msg', function(data)
    {
        var msgElement = $("<p><span style=\"margin:10px; font-weight: bold;\">@" + data.handle + ":</span><span>" + data.msg + "</span></p>");
        $("#ping-room").append(msgElement);

    });
});


// Event Handlers

// Ping handling
function ping_handle()
{
    var room_id = localStorage.getItem("roomId");
    var msg = $("#msg").val();
    var handle = $("#ping_to").val();

    var data  = {roomId:room_id, handle:handle, msg:msg};

    socket.emit('ping_msg',data);
    $("#msg").val('');
    $("#ping_to").val('');
}