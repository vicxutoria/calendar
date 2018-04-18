<?php

require '/srv/database.php';
header("Content-Type: application/json");

$username = (string)$_POST['username'];
$password = (string)$_POST['password'];

// Check to see if the username and password are valid
$stmt = $mysqli->prepare("SELECT count(*), password FROM users WHERE username=?");
// Sends failure message
if(!$stmt) {
	echo json_encode(array(
        "success" => false,
        "message" => sprintf("Query Prep Failed: %s\n", $mysqli->error)
    ));
	exit;
}

$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($count, $pass_hash);
$stmt->fetch();

// Sends success message
if($count == 1 && password_verify($password, $pass_hash)) {
	ini_set("session.cookie_httponly", 1);
	session_start();
	$_SESSION['username'] = $username;
	$_SESSION['token'] = substr(md5(rand()), 0, 10);
	echo json_encode(array(
		"success" => true,
		"token" => $_SESSION['token']
	));
	exit;
}
// Rejects action on account of incorrect username or password
// Sends failure message
else {
	echo json_encode(array(
		"success" => false,
		"message" => "Incorrect Username or Password"
	));
	unset($_SESSION['username']);
	destroy_session();
	exit;
}
?>