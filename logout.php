<?php
ini_set("session.cookie_httponly", 1);
session_start();
unset($_SESSION['username']);
session_destroy();
exit;
?>