<?php
$mysqli = new mysqli('localhost', 'calendar_user', 'calendar_pass', 'calendar');

if($mysqli->connect_errno) {
	printf("Connection Failed: %s\n", $mysqli->connect_error);
	exit;
}
?>