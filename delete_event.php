<?php
ini_set("session.cookie_httponly", 1);
session_start();
require '/srv/database.php';
header("Content-Type: application/json");

$event_id = (int)$_POST['event_id'];
$token = (string)$_POST['token'];
$username = (string)(!empty($_SESSION['username']) ? $_SESSION['username'] : null);

// Checks to see if tokens match
if($token != $_SESSION['token']) {
	echo json_encode(array(
        "success" => false,
        "message" => "tokens do not match"
    ));
	exit;	
}

// Check to see if the username for that event id valid
$stmt = $mysqli->prepare("SELECT username FROM events WHERE event_id=?");
// Sends failure message
if(!$stmt) {
	echo json_encode(array(
        "success" => false,
        "message" => sprintf("Query Prep Failed: %s\n", $mysqli->error)
    ));
	exit;
}

$stmt->bind_param('i', $event_id);
$stmt->execute();
$stmt->bind_result($user);
$stmt->fetch();

// Sends failure message
if($username != $user) {
    echo json_encode(array(
        "success" => false,
        "message" => "Users do not match"
    ));
	exit;
}

$stmt->close();

// Deletes event from database
$stmt = $mysqli->prepare("DELETE FROM events WHERE event_id=?");
// Sends failure message
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => sprintf("Query Prep Failed: %s\n", $mysqli->error)
    ));
	exit;
}
$stmt->bind_param('i', $event_id);
$stmt->execute();
$stmt->close();

// Sends success message
echo json_encode(array(
    "success" => true
));
exit;
?>