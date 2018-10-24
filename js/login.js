// Code for the form interactions

$('.form').find('input, textarea').on('keyup blur focus', function (e) {

    var $this = $(this),
        label = $this.prev('label');

    if (e.type === 'keyup') {
        if ($this.val() === '') {
            label.removeClass('active highlight');
        } else {
            label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
        if( $this.val() === '' ) {
            label.removeClass('active highlight');
        } else {
            label.removeClass('highlight');
        }
    } else if (e.type === 'focus') {

        if( $this.val() === '' ) {
            label.removeClass('highlight');
        }
        else if( $this.val() !== '' ) {
            label.addClass('highlight');
        }
    }

});

$('.tab a').on('click', function (e) {

    e.preventDefault();

    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');

    target = $(this).attr('href');

    $('.tab-content > div').not(target).hide();

    $(target).fadeIn(600);

});

// Constants
const baseUrl = "http://localhost:8000";

// Helper functions
function check_login()
{
    if(localStorage.getItem("isLoggedIn")!== "true") {
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
        localStorage.removeItem(key);
    }

    var j = sessionStorage.length, key2;
    while(j--)
    {
        key2 = sessionStorage.key(j);
        sessionStorage.removeItem(key);
    }
}


// Onload handlers
$(document).ready(function() {

    if(check_login())
    {
        window.location.replace('dashboard.html');
    }
    else
    {
        safeRemoval();
    }
});


// Event handlers
function login(){
    console.log("hi");
    var email = $("#login_email").val();
    var password = $("#login_password").val();

    var data = {"email":email, "password":password};
    data = JSON.stringify(data);

    var headers = {"Content-Type":"application/json"};
    console.log(data);
    $.ajax({
        url: 'http://localhost:8000/userAuth/signIn',
        type:"POST",
        headers:headers,
        data:data
    }).done(function(response) {
        console.log(response);
        localStorage.setItem("token",response.data.token);
        localStorage.setItem("userId",email);
        localStorage.setItem("isLoggedIn","true");
        window.location.replace('dashboard.html');

    }).fail(function(error) {
        console.log(error.status);
        if(error.status === 500)
            alert("Please check the email and password correctly");
        else if(error.status === 404)
            alert("User does not exist. Please register first");
    });
}

function register(){
    console.log("hello");
    var email = $("#register_email").val();
    var password = $("#register_password").val();
    var role = $("#register_role").val();

    var data = {"email":email, "password":password, "role":role };
    data = JSON.stringify(data);

    var headers = {"Content-Type":"application/json"};

    console.log(data);
    $.ajax({
        url: 'http://localhost:8000/userAuth/signUp',
        type:"POST",
        headers:headers,
        data:data
    }).done(function(response) {
        console.log(response);
        localStorage.setItem("token",response.data.token);
        localStorage.setItem("userId",email);
        localStorage.setItem("isLoggedIn","true");
        window.location.replace('dashboard.html');

    }).fail(function(error) {
        if(error.status === 500)
            alert("User already exists with the email. Try logging in")
    });

}