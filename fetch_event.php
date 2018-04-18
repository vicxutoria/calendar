<?php
ini_set("session.cookie_httponly", 1);
session_start();
require '/srv/database.php';
header("Content-Type: application/json");

$fromdate = (string)$_POST['fromdate'];
$todate = (string)$_POST['todate'];
$username = (string)(!empty($_SESSION['username']) ? $_SESSION['username'] : null);

if($username === null){
    echo json_encode(array(
        "success" => false,
        "message" => "Not logged in."
    ));
    exit;
}

//Query event data from event table in database
$stmt = $mysqli->prepare("SELECT * FROM events WHERE username=? and date>=? and date<=?");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => sprintf("Query Prep Failed: %s\n", $mysqli->error)
    ));
    exit;
}

$stmt->bind_param('sss', $username, $fromdate, $todate);
$stmt->execute();

//Convert data results into json
$eventData = array();
$result = $stmt->get_result();
while($row = $result->fetch_assoc()){
    $eventData["events"][] = $row;
}

$stmt->close();

echo json_encode(array(
    "success" => true,
    "message" => json_encode($eventData)
));
exit;
?>
