<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$database = "ElevatorDB";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$numFloors = $_POST['num_floors'];
$sql = "UPDATE Buildings SET NumFloors = $numFloors";
if ($conn->query($sql) === TRUE) {
    echo "All buildings updated successfully with NumFloors set to " . $numFloors . ".";
} else {
    echo "Error updating buildings: " . $conn->error;
}
$conn->close();
?>
