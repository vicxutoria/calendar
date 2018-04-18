
//Clears Calendar
function clearCalendar(){
    for(var i = 0; i < 6; ++i){
        for(var j = 0; j < 7; ++j){
            var pos = "coltop" + i.toString() + j.toString();
            document.getElementById(pos).innerText = "";
            document.getElementById(pos).hidden = false;
            pos = "colbottom" + i.toString() + j.toString();
            document.getElementById(pos).innerText = "";
            document.getElementById(pos).hidden = false;
            pos = "col" + i.toString() + j.toString();
            document.getElementById(pos).hidden = false;
        }
    }
}

//Updates Calendar with days, events, etc.
function updateCalendar(){
    displayMonth.innerText = months[currentMonth.month];
    displayYear.innerText = currentMonth.year;
    clearCalendar();
    var weeks = currentMonth.getWeeks();
    
    for(var w in weeks){
        var days = weeks[w].getDates();
        for(var d in days){
            var dd = days[d];
            document.getElementById('coltop' + w + d).innerText = dd.getDate();
        }
    }
    
    if(weeks.length < 6){
        for(r = weeks.length; r < 6; ++r){
            for(c = 0; c < 7; ++c){
                var e = document.getElementById('coltop' + r + c);
                e.hidden = true;
                document.getElementById('colbottom' + r + c).hidden = true;
                document.getElementById('col' + r + c).hidden = true;
            }
        }
    }
    //displays all events for a user
    if(currentMonthEventsJson !== null){
        var events = currentMonthEventsJson.events;
        if(events.length > 0){
            for(index = 0; index < events.length; ++index){
                var eventDate = events[index].date;
                var eventTime = events[index].time;
                var eventName = events[index].title;
                var eventId = events[index].event_id;
                var dateCell = getDateCell(eventDate);
                
                if(dateCell != null){
                    var dateEvents = dateCell.innerHTML;
                    if(dateEvents == null || dateEvents == ""){
                        dateEvents = createOneEventString(eventId, eventName, eventTime);
                    }
                    else{
                        dateEvents = dateEvents + createOneEventString(eventId, eventName, eventId);
                    }
                    dateCell.innerHTML = dateEvents;
                }
            }
        }
    }
}

//creates event string
function createOneEventString(eventId, eventName, eventTime){
    if(eventTime == "" || eventTime == null){
        return "<div id=\" "+eventId+"\">"+eventName+" @ " + eventTime + "</div>";
    }
    else{
        return "<div id=\" "+eventId+"\">"+eventName+" @ "+eventTime+"</div>";
    }
}

//gets cell date
function getCellDate(cellId){
    var week = cellId.charAt(3);
    var day = cellId.charAt(4);
    return currentMonth.getWeeks()[week].getDates()[day];
}

//gets event data per each cell date
function getCellEventData(cellId){
    var week = cellId.charAt(3);
    var day = cellId.charAt(4);
    var cellDataElem = document.getElementById("colbottom" + week + day);
    var eventdata = cellDataElem.innerHTML;
    return eventdata.replace(/div/g, "option").replace(/id=/g, "value=");
}

//gets date of cell for event date
function getDateCell(eventDate){
    var ymd = new Date(eventDate +"T12:00:00Z");
    var wkday = ymd.getDay();
    var wk = null;
    var weeks = currentMonth.getWeeks();
    
    for(var w in weeks){
        var days = weeks[w].getDates();
        if(days[wkday].getDate() == ymd.getDate() && days[wkday].getMonth() == ymd.getMonth()){
            wk = w;
            break;
        }
    }
    if(wk != null){
        return document.getElementById('colbottom' + wk + wkday);
    }
    else{
        return null;
    }
}
//displays appropriate event editor popup when a day box is clicked
function dayClicked(event){
    var selectedCell = this.id;
    selectedDate = getCellDate(selectedCell);
    var eventlist = getCellEventData(selectedCell);
    eventEditorContent.innerHTML = eventlist;
    eventEditor.style.display = "block";
}
//gets rid of event editor popup
function cancelPopup(){
    eventEditor.style.display = "none";
}
//updates the event selected to edit
function selectedEventChange(){
    var selectedEventText = eventEditorContent[eventEditorContent.selectedIndex].innerHTML;
    var pos = selectedEventText.lastIndexOf("@");
    var eventdesc = "";
    var eventtime = "";
    if(pos == -1){
        eventdesc = selectedEventText;
    }
    else{
        eventdesc = selectedEventText.substring(0, pos);
        eventtime = selectedEventText.substring(pos+1);
    }
    document.getElementById("neweventname").value = eventdesc;
    document.getElementById("neweventtime").value = eventtime;
}

//ajax post event
function postAjax(targeturl, params, successProcessor){
    if(selectedDate != null){
        var mm = selectedDate.getMonth() + 1;
        var dd = selectedDate.getDate();
        var yyyy = selectedDate.getFullYear();
        mm = (mm < 10) ? '0' + mm : mm;
        dd = (dd < 10) ? '0' + dd : dd;
        params = params + "&date=" + dateToString(selectedDate);
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            successProcessor(xhttp.responseText);
        }
    };
    xhttp.open("POST", targeturl, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(params);
}

//changes date into string
function dateToString(date){
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var yyyy = date.getFullYear();
    mm = (mm < 10) ? '0' + mm : mm;
    dd = (dd < 10) ? '0' + dd : dd;
    return yyyy + "-" + mm + "-" + dd;
}

//processes json event data and sends appropriate success/fail messages
function processJsonEventData(responseText){
    try{
        var jsonData = JSON.parse(responseText);
        if(jsonData.success){
            currentMonthEventsJson = jsonData.message;
        }
    } catch(e){
        
    }
    updateCalendar();
}

//updates calendar based on if user logged out or not
function processLogoutResponse(responseText){
    currentMonthEventsJson = null;
    updateCalendar();
}

//checks if register button clicked
function registerClicked(){
    document.getElementById("newusername").value = "";
    document.getElementById("newpassword").value = "";
    document.getElementById("pass_conf").value = "";
    signupform.style.display = "block";
}

//processes registration information request
function processSignupResponse(responseText){
    try{
        var jsonData = JSON.parse(responseText);
        if(jsonData.success){
            alert("User has been created!");
            loginlogoutbtn.innerText = logoutText;
            document.getElementById("usernamelogin").hidden = true;
            document.getElementById("passwordlogin").hidden = true;
            signupform.style.display = "none";
        }
        else{
            alert("User was not created. " + jsonData.message);
        }
    }catch(e){
        alert("Failed to register user. " + e);
    }
}


//gets rid of register popup if cancel button clicked
function cancelRegisterBtnClicked(){
    signupform.style.display = "none";
}

//hides and shows appropriate login/logout/register buttons if login successful or not
function displayLogBtn(login_success){
    if(login_success){
        document.getElementById("login_btn").hidden = true;
        document.getElementById("register_btn").hidden = true;
        document.getElementById("logout_btn").hidden = false;
    }
    else if (!login_success){
        document.getElementById("login_btn").hidden = false;
        document.getElementById("register_btn").hidden = false;
        document.getElementById("logout_btn").hidden = true;
    }
}

//various global variable declarations linked to their appropriate php file
var editEventUrl ="edit_event.php";
var addEventUrl = "add_event.php";
var deleteEventUrl = "delete_event.php";
var fetchEventUrl = "fetch_event.php";
var loginUrl = "login.php";
var logoutUrl = "logout.php";
var signupUrl = "signup.php";

//various global variable declarations
var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
var prevBtn = document.getElementById('prev');
var nextBtn = document.getElementById('next');
var displayMonth = document.getElementById("displayMonth");
var displayYear = document.getElementById("displayYear");
var d = new Date();
var currentMonth = new Month(d.getFullYear(), d.getMonth());
var loginText = "Log In";
var logoutText = "Log Out";

//adds event listener to the next month button and changes calendar to next month
nextBtn.addEventListener("click", function(event){
    currentMonth = currentMonth.nextMonth();
    fetchEvent();
}, false);

//adds event listener to previous month button and changes calendar to previous month
prevBtn.addEventListener("click", function(event){
    currentMonth = currentMonth.prevMonth();
    fetchEvent();
}, false);

//checks to see if dayclicked for each cell date
for(var row = 0; row < 6; ++row){
    for(col = 0; col < 7; ++col){
        var colId = "col" + row.toString() + col.toString();
        document.getElementById(colId).addEventListener("click", dayClicked, false);
    }
}

//global variables
var currentMonthEventsJson = null;
var selectedDate = null;
document.addEventListener("DOMContentLoaded", updateCalendar, false);

var eventEditor = document.getElementById('eventEditor');
var eventEditorContent = document.getElementById('eventlist');
eventEditorContent.addEventListener("change", selectedEventChange, false);
document.getElementById("cancelEventPopup").addEventListener("click", cancelPopup, false);

var editEventBtn = document.getElementById("editEvent");
editEventBtn.addEventListener("click", editEvent, false);

var addEventBtn = document.getElementById("addEvent");
addEventBtn.addEventListener("click", addEvent, false);

var deleteEventBtn = document.getElementById("deleteEvent");
deleteEventBtn.addEventListener("click", deleteEvent, false);

var signupform = document.getElementById("signupform");

var register_btn = document.getElementById("register_btn");
register_btn.addEventListener("click", registerClicked, false);

var cancelRegisterBtn = document.getElementById("cancelRegisterBtn");
cancelRegisterBtn.addEventListener("click", cancelRegisterBtnClicked, false);

updateCalendar();
//?

