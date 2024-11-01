<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$database = "elevatordb";
$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$simulationNumber = 123;
$startDateTime = date("Y-m-d H:i:s");
$liftId = 1;
$terrainID = 1;
$algorithmUsed = "Scan";

$sql = "INSERT INTO Simulations (SimulationNumber, StartTime, ElevatorID, TerrainID, NumberOfRequests, TotalWaitTime, AlgorithmUsed)
        VALUES ($simulationNumber, '$startDateTime', $liftId, $terrainID, 5, 0, '$algorithmUsed')";

if (mysqli_query($conn, $sql)) {
    echo "Data inserted successfully.";
} else {
    echo "Error: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
