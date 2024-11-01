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
echo $eventType;
$terrainID = 0;
switch ($terrainName) {
    case "Smooth Ramp":
        $terrainID = 1;
        break;
    case "Level Platform":
        $terrainID = 2;
        break;
    case "Paved Courtyard":
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

if ($eventType === "start") 
{
    $startTime = microtime(true); 
    $SESSION["start_time$liftId"] = $startTime;  
    $startDateTime = date("Y-m-d H:i:s", $startTime);

    $sql1 = "INSERT INTO Simulations (SimulationNumber, StartTime, ElevatorID, TerrainID, NumberOfRequests, TotalWaitTime, AlgorithmUsed)
            VALUES ($simulationNumber, '$startDateTime', 1, $terrainID, 5, 0, 'Scan')";

    $result1 = mysqli_query($conn, $sql1);
    if ($result1) 
    {
        echo "Start time recorded for lift $liftId with algorithm Scan.<br>";
    } 
    else 
    {
        echo "Error: " . mysqli_error($conn);
    }

    $sql2 = "INSERT INTO Simulations (SimulationNumber, StartTime, ElevatorID, TerrainID, NumberOfRequests, TotalWaitTime, AlgorithmUsed)
            VALUES ($simulationNumber, '$startDateTime', 2, $terrainID, 5, 0, 'Look')";

    $result2 = mysqli_query($conn, $sql2);
    if ($result2) 
    {
        echo "Start time recorded for lift $liftId with algorithm Look.<br>";
    } 
    else 
    {
        echo "Error: " . mysqli_error($conn);
    }

    $sql3 = "INSERT INTO Simulations (SimulationNumber, StartTime, ElevatorID, TerrainID, NumberOfRequests, TotalWaitTime, AlgorithmUsed)
            VALUES ($simulationNumber, '$startDateTime', 3, $terrainID, 5, 0, 'Shortest Seek Time First')";

    $result3 = mysqli_query($conn, $sql3);
    if ($result3) 
    {
        echo "Start time recorded for lift $liftId with algorithm Shortest Seek Time First.<br>";
    } 
    else 
    {
        echo "Error: " . mysqli_error($conn);
    }

    $sql4 = "INSERT INTO Simulations (SimulationNumber, StartTime, ElevatorID, TerrainID, NumberOfRequests, TotalWaitTime, AlgorithmUsed)
            VALUES ($simulationNumber, '$startDateTime', 4, $terrainID, 5, 0, 'First Come First Serve')";

    $result4 = mysqli_query($conn, $sql4);
    if ($result4) 
    {
        echo "Start time recorded for lift $liftId with algorithm First Come First Serve.<br>";
    } 
    else 
    {
        echo "Error: " . mysqli_error($conn);
    }

} elseif ($eventType === "end") {
    $endTime = microtime(true);
    $sqlFetch = "SELECT StartTime FROM Simulations WHERE SimulationNumber = $simulationNumber AND ElevatorID = $liftId";
    $fetchResult = mysqli_query($conn, $sqlFetch);
    if ($fetchResult && mysqli_num_rows($fetchResult) > 0) {
        $row = mysqli_fetch_assoc($fetchResult);
        $startTime = strtotime($row['StartTime']);  
        $elapsedTime = $endTime - $startTime;  
        $endDateTime = date("Y-m-d H:i:s", $endTime);
        $sqlUpdate = "UPDATE Simulations 
                    SET EndTime = '$endDateTime', TotalWaitTime = $elapsedTime 
                    WHERE SimulationNumber = $simulationNumber AND ElevatorID = $liftId";
        $updateResult = mysqli_query($conn, $sqlUpdate);
        if ($updateResult) {
            echo "End time recorded for lift $liftId with algorithm $algorithmUsed. <br>Total wait time: $elapsedTime seconds.<br>";
        } else {
            echo "Error updating record: " . mysqli_error($conn);
        }
    } else {
        echo "Start time not found in database for lift $liftId. Please start the simulation first.";
    }
}
$checkCountSql = "SELECT COUNT(TotalWaitTime) as recordCount FROM Simulations WHERE SimulationNumber = $simulationNumber";
$countResult = mysqli_query($conn, $checkCountSql);
$row = mysqli_fetch_assoc($countResult);

if ($row['recordCount'] == 4) 
{
    $sql6 = "SELECT SimulationID, AlgorithmUsed, TotalWaitTime AS MinElapsedTime
        FROM Simulations
        WHERE SimulationNumber = $simulationNumber
        ORDER BY TotalWaitTime ASC
        LIMIT 1";

    $result6 = mysqli_query($conn, $sql6);

    if ($result6 && mysqli_num_rows($result6) > 0) 
    {
        $row = mysqli_fetch_assoc($result6);
        $bestSimulationID = $row['SimulationID'];
        $bestAlgorithm = $row['AlgorithmUsed'];
        $bestElapsedTime = $row['MinElapsedTime'];
        $efficiencyScore = (1 / $bestElapsedTime)*100;    
        $sqlInsert = "INSERT INTO SimulationResults (SimulationID, EfficiencyScore, OptimalAlgorithm)
                VALUES ($bestSimulationID, $efficiencyScore, '$bestAlgorithm')";

        $result7 = mysqli_query($conn, $sqlInsert);
        if (!$result7) 
        {
            echo "Error inserting into SimulationResults: " . mysqli_error($conn);
        } 
        else 
        {
            echo "Optimal algorithm '$bestAlgorithm' with SimulationID $bestSimulationID and EfficiencyScore $efficiencyScore has been recorded in SimulationResults.";
        }
    }   
}


mysqli_close($conn);
?>