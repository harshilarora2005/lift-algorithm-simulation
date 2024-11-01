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

$buildingName = $_POST['building_name'];
$numFloors = $_POST['num_floors'];
$terrain = $_POST['terrain'];

$locations = [
    "Smooth Ramp" => ["City Center", "East Side", "Greenfield Park"],
    "Level Platform" => ["Downtown", "West End", "Harbor District"],
    "Paved Courtyard" => ["Tech Valley", "Industrial Park", "Old Town"]
];

if (array_key_exists($terrain, $locations)) {
    $location = $locations[$terrain][array_rand($locations[$terrain])];
} else {
    $location = "Unknown"; 
}

$sql = "INSERT INTO Buildings (BuildingName, NumFloors, Location) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sis", $buildingName, $numFloors, $location);

if ($stmt->execute()) {
    echo "Building record updated successfully.";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
