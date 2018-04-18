<?php
ini_set("session.cookie_httponly", 1);
session_start();
require '/srv/database.php';
header("Content-Type: application/json");

$event_id = (int)$_POST['event_id'];
$title = (string)$_POST['title'];
$date = (string)$_POST['date'];
$time = (string)$_POST['time'];
$token = (string)$_POST['token'];
$username = (string)(!empty($_SESSION['username']) ? $_SESSION['username'] : null);
$userDNE = true;

// Checks to see if tokens match
if($token != $_SESSION['token']) {
    echo json_encode(array(
        "success" => false,
        "message" => "tokens do not match"
    ));
	exit;
}

// Reads through all users in database
$stmt = $mysqli->prepare("SELECT username FROM users");
if(!$stmt) {
    echo json_encode(array(
        "success" => false,
        "message" => sprintf("Query Prep Failed: %s\n", $mysqli->error)
    ));
	exit;
}

$stmt->execute();
$stmt->bind_result($users);

// Checks if username exists
while($stmt->fetch()) {
	if($username === $users){
		$userDNE = false;
	}
}

$stmt->close();

// Rejects action on account of user not logged in
// Sends failure message
if($userDNE) {
    echo json_encode(array(
        "success" => false,
        "message" => "Not logged in"
    ));
    exit;
}

// Inserts event data into event table in database
$stmt = $mysqli->prepare("INSERT INTO events (title, date, time, username) VALUES (?, ?, ?, ?)");
// Sends failure message
if(!$stmt) {
    echo json_encode(array(
        "success" => false,
        "message" => sprintf("Query Prep Failed: %s\n", $mysqli->error)
    ));
	exit;
}

$stmt->bind_param('ssss', $title, $date, $time, $username);
$stmt->execute();
$stmt->close();

// Sends success message
echo json_encode(array(
    "success" => true
));
exit;
?>