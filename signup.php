<?php
require '/srv/database.php';
header("Content-Type: application/json");

$username = (string)$_POST['username'];
$password = (string)$_POST['password'];
$pass_conf = (string)$_POST['pass_conf'];

// Checks to see if username is input
if(empty($username)) {
	echo json_encode(array(
		"success" => false,
		"message" => "No username entered"
	));
	exit;
}

// Collects all usernames stored in database
$stmt = $mysqli->prepare("SELECT username FROM users");
if(!$stmt) {
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->execute();
$stmt->bind_result($users);

// Checks if username has already been taken
while($stmt->fetch()) {
	if($username === $users) {
		echo json_encode(array(
			"success" => false,
			"message" => "Username already taken"
        ));
		exit;
	}
}

$stmt->close();

// Rejects action on account of password entries not matching
// Sends failure message
if($password != $pass_conf) {
    echo json_encode(array(
		"success" => false,
        "message" => "Passwords do not match"
    ));
	exit;
}

// Salts and hashes password given
$pass_hash = password_hash($password, PASSWORD_BCRYPT);

// Inserts user data into user table in database
$stmt = $mysqli->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
// Sends failure message
if(!$stmt) {
    echo json_encode(array(
        "success" => false,
        "message" => sprintf("Query Prep Failed: %s\n", $mysqli->error)
    ));
	exit;
}

$stmt->bind_param('ss', $username, $pass_hash);
$stmt->execute();
$stmt->close();

// Sends success message
echo json_encode(array(
    "success" => true
));
exit;
?>