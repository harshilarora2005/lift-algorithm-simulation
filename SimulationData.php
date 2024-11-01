<?php
session_start();
date_default_timezone_set('Asia/Kolkata'); 

$servername = "localhost";
$username = "root";
$password = "";
$database = "elevatordb";
$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
$simulationNumber = $_POST['simulation_number'];
$terrainName = $_POST['terrain'];
$liftId = $_POST['lift_id'];
$eventType = $_POST['event_type'];
$terrainID = 0;
switch ($terrainName) {
    case "SmoothRamp":
        $terrainID = 1;
        break;
    case "LevelPlatform":
        $terrainID = 2;
        break;
    case "PavedCourtyard":
        $terrainID = 3;
        break;
}

$algorithmUsed = '';
switch ($liftId) {
    case '1':
        $algorithmUsed = "Scan";
        break;
    case '2':
        $algorithmUsed = "Look";
        break;
    case '3':
        $algorithmUsed = "Shortest Seek Time First";
        break;
    case '4':
        $algorithmUsed = "First Come First Serve";
        break;
    default:
        echo "Invalid lift ID.";
        exit;
}

if ($eventType === "start") {
    $startTime = microtime(true); 
    $_SESSION["start_time_$liftId"] = $startTime;  
    $startDateTime = date("Y-m-d H:i:s", $startTime);
    $sql = "INSERT INTO Simulations (SimulationNumber, StartTime, ElevatorID, TerrainID, NumberOfRequests, TotalWaitTime, AlgorithmUsed)
            VALUES ($simulationNumber, '$startDateTime', $liftId, $terrainID, 5, 0, '$algorithmUsed')";

    if (mysqli_query($conn, $sql)) {
        echo "Start time recorded for lift $liftId with algorithm $algorithmUsed.<br>";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

} elseif ($eventType === "end") {
    $endTime = microtime(true);  // Get the end time in microseconds

    // Check if start time is stored in the session
    if (isset($_SESSION["start_time_$liftId"])) {
        $startTime = $_SESSION["start_time_$liftId"];
        $elapsedTime = $endTime - $startTime;

        // Format start and end times for MySQL
        $startDateTime = date("Y-m-d H:i:s", $startTime);
        $endDateTime = date("Y-m-d H:i:s", $endTime);

        // Update the simulation row with the end time and total elapsed time
        $sql = "UPDATE Simulations 
                SET EndTime = '$endDateTime', TotalWaitTime = $elapsedTime 
                WHERE SimulationNumber = $simulationNumber AND ElevatorID = $liftId";

        if (mysqli_query($conn, $sql)) {
            echo "End time recorded for lift $liftId with algorithm $algorithmUsed. Total wait time: $elapsedTime seconds.<br>";
        } else {
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }

        // Remove the start time from the session
        unset($_SESSION["start_time_$liftId"]);
    } else {
        echo "Start time not found for lift $liftId. Please start the simulation first.";
    }
}

// Close the database connection
mysqli_close($conn);
?>
