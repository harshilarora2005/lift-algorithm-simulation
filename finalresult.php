<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "ElevatorDB";
$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) 
{
    die("Connection failed: " . mysqli_connect_error());
}

$simulationNumber = $_POST['simulation_number']; 

$sql = "SELECT SimulationID, AlgorithmUsed, TotalWaitTime AS MinElapsedTime
        FROM Simulations
        WHERE SimulationNumber = $simulationNumber
        ORDER BY TotalWaitTime ASC
        LIMIT 1";

$result = mysqli_query($conn, $sql);

if ($result && mysqli_num_rows($result) > 0) 
{
    $row = mysqli_fetch_assoc($result);
    $bestSimulationID = $row['SimulationID'];
    $bestAlgorithm = $row['AlgorithmUsed'];
    $bestElapsedTime = $row['MinElapsedTime'];

    $efficiencyScore = 1 / $bestElapsedTime;

    
    $sqlInsert = "INSERT INTO SimulationResults (SimulationID, EfficiencyScore, OptimalAlgorithm) 
    VALUES ($bestSimulationID, $efficiencyScore, '$bestAlgorithm')";

    $result2 = mysqli_query($conn, $sqlInsert);
    if (!$result2) 
    {
        echo "Error inserting into SimulationResults: " . mysqli_error($conn);
        
    } 
    else 
    {
        echo "Optimal algorithm '$bestAlgorithm' with SimulationID $bestSimulationID and EfficiencyScore $efficiencyScore has been recorded in SimulationResults.";
    }
} 
else 
{
    echo "No simulation records found for SimulationNumber $simulationNumber.";
}

mysqli_close($conn);
?>