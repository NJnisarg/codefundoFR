// Constants
var token_required = true;
const baseUrl = "http://localhost:8000";
const headers = {"Content-Type":"application/json", "Authorization": token_required ? localStorage.getItem("token") : undefined };

// Helper functions
function check_login()
{
    if(localStorage.getItem("isLoggedIn")!==true)
        return false;
    if(localStorage.getItem("userId") === null || localStorage.getItem("userId") === undefined)
        return false;
    if(localStorage.getItem("token") === null || localStorage.getItem("token") === undefined)
        return false;

    return true;
}

function generateActiveRooms(activeRooms)
{
    var roomElement = null;
    activeRooms.forEach(function(room){
    roomElement = $("<div class=\"col-md-offset-1 col-md-2 event-room-card\" id=" + room.roomId + "  onclick=\"loadEventRoom(this.id)\">\n" +
        "                <h2>" + room.title + "</h2>\n" +
        "                <p>" + room.description + "</p>\n" +
        "            </div>");
        $("#active-rooms").append(roomElement);
    });
}

function generateInActiveRooms(inActiveRooms)
{
    var roomElement = null;
    inActiveRooms.forEach(function(room){
        roomElement = $("<div class=\"col-md-offset-1 col-md-2 event-room-card\" id=\" + room.roomId + \" >\n" +
            "                <h2>" + room.title + "</h2>\n" +
            "                <p>" + room.description + "</p>\n" +
            "            </div>");
        $("#inactive-rooms").append(roomElement);
    });
}

// On Load handlers
$(document).ready(function () {

    // Login check login
    if(check_login())
    {
        window.location.replace("dashboard.html");
    }


    // Load Event Rooms
    var rooms = [];
    var activeRooms = [];
    var inActiveRooms = [];
    token_required = false;
    $.ajax({
        url:baseUrl+ "/eventRoom/all",
        headers:headers,
        type:"GET"
    }).done(function(response){
            rooms = response.data;
            rooms.forEach(function(room){
                if(room.isActive)
                    activeRooms.push(room);
                else
                    inActiveRooms.push(room);
            });

            generateActiveRooms(activeRooms);
            generateInActiveRooms(inActiveRooms);
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