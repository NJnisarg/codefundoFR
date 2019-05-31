// Constants
var token_required = true;
const baseUrl = "http://localhost:8000";
var socket = io(baseUrl);
const headers = {"Content-Type":"application/json", "Authorization": token_required ? localStorage.getItem("token") : undefined };

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

function generateActiveRooms(room)
{
    var roomElement = $("<div class=\"col-md-offset-1 col-md-2 event-room-card\" id=" + room.roomId + "  onclick=\"loadEventRoom(this.id)\">\n" +
        "                <h2>" + room.title + "</h2>\n" +
        "                <p>" + room.description + "</p>\n" +
        "            </div>");
    $("#active-rooms").append(roomElement);
}

function generateInActiveRooms(room)
{
    var roomElement = $("<div class=\"col-md-offset-1 col-md-2 event-room-card\" id=\" + room.roomId + \" >\n" +
        "                <h2>" + room.title + "</h2>\n" +
        "                <p>" + room.description + "</p>\n" +
        "            </div>");
    $("#inactive-rooms").append(roomElement);
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

// On Load handlers
$(document).ready(function () {

    // Login check login
    if(!check_login())
    {
        window.location.replace("index.html");
    }

    // Load Event Rooms
    var rooms = [];
    token_required = true;
    $.ajax({
        url:baseUrl+ "/userAuth/getUser/"+localStorage.getItem("userId"),
        headers:headers,
        type:"GET"
    }).done(function(response){

        rooms = response.data.activeRooms;
        rooms.forEach(function(room){
            $.ajax({
                url: baseUrl+ '/eventRoom/'+room,
                type:"GET",
                headers:headers
            }).done(function(response){
                generateActiveRooms(response.data);
            });
        });

        rooms = response.data.inActiveRooms;
        rooms.forEach(function(room){
            $.ajax({
                url: baseUrl+ '/eventRoom/'+room,
                type:"GET",
                headers:headers
            }).done(function(response){
                generateInActiveRooms(response.data);
            });
        });
    })
        .fail(function(error){
            rooms = null;
            console.log(error);
        });

});

// Events handlers

// Handling clicking on an event room
function loadEventRoom(id)
{
    localStorage.setItem("roomId",id);
    if(check_login())
        window.location.replace('event_room.html');
    else
        window.location.replace('unauth_event_room.html');
}

// Handling event for create-room
function createRoom()
{
    var title = $("#rm_title").val();
    var description = $("#rm_des").val();
    var country = $("#rm_country").val();
    var state = $("#rm_state").val();
    var city = $("#rm_city").val();

    var input_providers = $("#rm_providers").val();
    var providers = [];
    if(input_providers!=="")
        providers = input_providers.split(',');
    else
        providers = [];
    providers.push(localStorage.getItem("userId"));

    var data = {title:title, description:description,country:country,city:city,state:state,serviceProviders:providers};
    data = JSON.stringify(data);

    console.log(data);
    token_required = false;

    $.ajax({
        url:baseUrl+'/eventRoom/createRoom',
        type:"POST",
        headers:headers,
        data:data
    }).done(function(response){
        console.log(response);
        generateActiveRooms(response.data)
    }).fail(function(error){
        alert('Could Not create the room. Please try again')
    });


}