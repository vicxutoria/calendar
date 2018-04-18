function signup(event) {
    var username = document.getElementById("newusername").value; // Get the username from the form
    var password = document.getElementById("newpassword").value; // Get the password from the form
    var pass_conf = document.getElementById("pass_conf").value; // Gets a second password from the form to confirm the first

    // Make a URL-encoded string for passing POST data:
    var dataString = "username=" + encodeURIComponent(username) +
        "&password=" + encodeURIComponent(password) +
        "&pass_conf=" + encodeURIComponent(pass_conf);
    
    var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
    xmlHttp.open("POST", "signup.php", true); // Starting a POST request
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event) {
        var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
        // Reports success or failure
        if(jsonData.success) {
            alert("User has been created!");
            cancelRegisterBtnClicked();
        }
        else {
            alert("User was not created. " + jsonData.message);
        }
    }, false); // Bind the callback to the load event
    xmlHttp.send(dataString); // Send the data
}

function login(event) {
    var username = document.getElementById("login_user").value; // Get the username from the form
    var password = document.getElementById("login_password").value; // Get the password from the form

    // Make a URL-encoded string for passing POST data:
    var dataString = "username=" + encodeURIComponent(username) +
        "&password=" + encodeURIComponent(password);
    
    var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
    xmlHttp.open("POST", "login.php", true); // Starting a POST request
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.addEventListener("load", function(event) {
        var jsonData = JSON.parse(event.target.responseText); // parse the JSON into a JavaScript object
        // Reports success or failure
        if(jsonData.success) {
            alert("You've been logged in!");
            // Creates CSRF token
            document.getElementsByName("token")[0].value = jsonData.token;

            // Hides login button
            document.getElementById("login_btn").hidden = true;
            document.getElementById("register_btn").hidden = true;
            document.getElementById("logout_btn").hidden = false;
            fetchEvent();
        }
        else {
            alert("You were not logged in. " + jsonData.message);
        }
    }, false); // Bind the callback to the load event
    xmlHttp.send(dataString); // Send the data 
}

function logout(event) {
    var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
    xmlHttp.open("POST", "logout.php", true); // Starting a POST request (NEVER send passwords as GET variables!!!)
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // It's easy to forget this line for POST requests
    alert("You have been logged out");
    xmlHttp.send(null);
    document.getElementById("login_btn").hidden = false;
    document.getElementById("register_btn").hidden = false;
    document.getElementById("logout_btn").hidden = true;
    currentMonthEventsJson = null;
    updateCalendar();
}

function addEvent(event) {
    var title = document.getElementById("neweventname").value; // Get the title from the form
    var time = document.getElementById("neweventtime").value; // Gets the time from the form
    var dayString;
    var token = document.getElementsByName("token")[0].value;
    
    if(selectedDate != null){
        dayString = dateToString(selectedDate);
    }
    
    // Make a URL-encoded string for passing POST data:
    var dataString = "title=" + encodeURIComponent(title) +
        "&date=" + encodeURIComponent(dayString) +
        "&time=" + encodeURIComponent(time) +
        "&token=" + encodeURIComponent(token);
        
    var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
    xmlHttp.open("POST", "add_event.php", true); // Starting a POST request
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
        var jsonData = JSON.parse(xmlHttp.responseText); // parse the JSON into a JavaScript object
        // Reports success or failure
        if(jsonData.success) {
            alert("Event has been created!");
            cancelPopup();
            fetchEvent();
        }
        else {
            alert("Event was not created. " + jsonData.message);
        }
    } // Bind the callback to the load event
    };
    xmlHttp.send(dataString); // Send the data
}

function editEvent(event) {
    
    var event_id = document.getElementById("eventlist").value;
    var title = document.getElementById("neweventname").value; // Get the title from the form
    var time = document.getElementById("neweventtime").value; // Gets the time from the form
    var token = document.getElementsByName("token")[0].value;
    
    // Make a URL-encoded string for passing POST data:
    var dataString = "event_id=" + encodeURIComponent(event_id) +
        "&title=" + encodeURIComponent(title) +
        "&time=" + encodeURIComponent(time) +
        "&token=" + encodeURIComponent(token);
        
    var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
    xmlHttp.open("POST", "edit_event.php", true); // Starting a POST request
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
        var jsonData = JSON.parse(xmlHttp.responseText); // parse the JSON into a JavaScript object
        // Reports success or failure
        if(jsonData.success) {
            alert("Event has been edited!");
            cancelPopup();
            fetchEvent();
        }
        else {
            alert("Event was not edited. " + jsonData.message);
        }
    } // Bind the callback to the load event
    };
    xmlHttp.send(dataString); // Send the data
}

function deleteEvent(event) {
    
    var event_id = document.getElementById("eventlist").value;
    var token = document.getElementsByName("token")[0].value;
    
    // Make a URL-encoded string for passing POST data:
    var dataString = "event_id=" + encodeURIComponent(event_id) +
        "&token=" + encodeURIComponent(token);
    
    
    var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
    xmlHttp.open("POST", "delete_event.php", true); // Starting a POST request
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200) {
        
        var jsonData = JSON.parse(xmlHttp.responseText); // parse the JSON into a JavaScript object
        // Reports success or failure
        if(jsonData.success) {
            alert("Event has been deleted!");
            cancelPopup();
            fetchEvent();
        }
        else {
            alert("Event was not deleted.  " + jsonData.message);
        }
        
    } // Bind the callback to the load event
    };
    xmlHttp.send(dataString); // Send the data
}

function fetchEvent() {
    // Make a URL-encoded string for passing POST data:
    var wks = currentMonth.getWeeks();
    var dataString = "fromdate=" + encodeURIComponent(dateToString(wks[0].getDates()[0])) + "&todate=" + encodeURIComponent(dateToString(wks[wks.length - 1].getDates()[6]));
    
    var xmlHttp = new XMLHttpRequest(); // Initialize our XMLHttpRequest instance
    xmlHttp.open("POST", "fetch_event.php", true); // Starting a POST request
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xmlHttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var jsonData = JSON.parse(xmlHttp.responseText); // parse the JSON into a JavaScript object
            // Reports success or failure
            if(!jsonData.success) {
                alert("Problems!");
            }
            else{
                currentMonthEventsJson = JSON.parse(jsonData.message);
                updateCalendar();
            }}
    };
    xmlHttp.send(dataString); // Send the data
}

document.getElementById("login_btn").addEventListener("click", login, false);
document.getElementById("logout_btn").addEventListener("click", logout, false);
document.getElementById("signup_btn").addEventListener("click", signup, false);
document.getElementById("addEvent").addEventListener("click", addEvent, false);
document.getElementById("editEvent").addEventListener("click", editEvent, false);
document.getElementById("deleteEvent").addEventListener("click", deleteEvent, false);
// Spacing
