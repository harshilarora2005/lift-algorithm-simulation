<?php
$servername = "localhost";
$username = "root";
$password = "";

$conn = mysqli_connect($servername, $username, $password);

if ($conn)
{
    echo "Connection was successful! <br>";
}
else
{
    die("Sorry we failed to connect: ".mysqli_connect_error());
}
$sql = "CREATE DATABASE ElevatorDB";
$result = mysqli_query($conn, $sql);

if ($result)
{
    echo "Database was created successfully! <br>";
}
else
{
    echo "ERROR -> ".mysqli_error($conn);
}
?>

<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "ElevatorDB";

$conn = mysqli_connect($servername, $username, $password, $database);

if ($conn)
{
    echo "Connection was successful! <br>";
}
else
{
    die("Sorry we failed to connect: ".mysqli_connect_error());
}
$result2 = mysqli_query($conn, "CREATE TABLE elevator 
(ElevatorID INT NOT NULL AUTO_INCREMENT, 
ElevatorName VARCHAR(100) NOT NULL , 
ElevatorCapacity INT NOT NULL , 
MaxSpeed FLOAT NOT NULL , 
AlgorithmUsed VARCHAR(200) NOT NULL ,
PRIMARY KEY (ElevatorID))");

if (!$result2)
{
    echo "ERROR -> ".mysqli_error($conn);
}

$result3 = mysqli_query($conn, "INSERT INTO elevator (ElevatorID, ElevatorName, ElevatorCapacity, MaxSpeed, AlgorithmUsed) 
VALUES 
('1', 'Elevator1', '12', '1.5', 'Scan'),
('2', 'Elevator2', '12', '1.5', 'Look'), 
('3', 'Elevator3', '12', '1.5', 'Shortest Seek Time First'), 
('4', 'Elevator4', '12', '1.5', 'First Come First Serve');");

if (!$result3)
{
    echo "ERROR -> ".mysqli_error($conn);
}

$result4 = mysqli_query($conn, "CREATE TABLE buildings 
(BuildingID INT NOT NULL AUTO_INCREMENT , 
BuildingName VARCHAR(100) NOT NULL , 
NumFloors INT NOT NULL , 
Location VARCHAR(100) NOT NULL , 
PRIMARY KEY (BuildingID))");

if (!$result4)
{
    echo "ERROR -> ".mysqli_error($conn);
}

$result5 = mysqli_query($conn, "INSERT INTO buildings (BuildingID, BuildingName, NumFloors, Location) VALUES 
('1', 'Building1', '14', 'CityA'), 
('2', 'Building2', '14', 'CityA'), 
('3', 'Building3', '14', 'CityA'), 
('4', 'Building4', '14', 'CityA')");

if (!$result5)
{
    echo "ERROR -> ".mysqli_error($conn);
}

$result6 = mysqli_query($conn, "CREATE TABLE terrains 
(TerrainID INT NOT NULL AUTO_INCREMENT , 
TerrainName VARCHAR(100) NOT NULL , 
InclineAngle FLOAT NOT NULL , 
TerrainResistanceFactor FLOAT NOT NULL , 
AccessibilityDescription TEXT NOT NULL , 
PRIMARY KEY (TerrainID))");

if (!$result6)
{
    echo "ERROR -> ".mysqli_error($conn);
}

$result7 = mysqli_query ($conn, "INSERT INTO terrains (TerrainID, TerrainName, InclineAngle, TerrainResistanceFactor, AccessibilityDescription) VALUES 
('1', 'Smooth Ramp', '5.0', '', 'Gradual incline with a smooth surface; easy access for elevators.'),
('2', 'Level Platform', '0.0', '', 'Completely flat surface, ideal for loading and unloading.'), 
('3', 'Paved Courtyard', '0.0', '', 'Hard, even ground with clear pathways for easy mobility.')");

if (!$result7)
{
    echo "ERROR -> ".mysqli_error($conn);
}

$result9 = mysqli_query($conn, "CREATE TABLE simulations 
(SimulationID INT NOT NULL AUTO_INCREMENT , 
SimulationNumber INT NOT NULL , 
StartTime DATETIME NOT NULL , 
EndTime DATETIME NOT NULL , 
ElevatorID INT NOT NULL , 
TerrainID INT NOT NULL , 
NumberOfRequests INT NOT NULL , 
TotalWaitTime DATETIME NOT NULL , 
AlgorithmUsed VARCHAR(200) NOT NULL , 
PRIMARY KEY (SimulationID))");

if (!$result9)
{
    echo "ERROR -> ".mysqli_error($conn);
}

$result10 = mysqli_query($conn, "ALTER TABLE simulations 
ADD FOREIGN KEY (ElevatorID) 
REFERENCES elevator(ElevatorID) 
ON DELETE CASCADE ON UPDATE CASCADE");

if (!$result10)
{
    echo "ERROR -> ".mysqli_error($conn);
}

$result11 = mysqli_query($conn, "ALTER TABLE simulations 
ADD FOREIGN KEY (TerrainID) 
REFERENCES terrains(TerrainID) 
ON DELETE CASCADE ON UPDATE CASCADE");

if (!$result11)
{
    echo "ERROR -> ".mysqli_error($conn);
}

$result12 = mysqli_query($conn, "CREATE TABLE simulationresults 
(ResultID INT NOT NULL AUTO_INCREMENT , 
SimulationID INT NOT NULL , 
EfficiencyScore FLOAT NOT NULL , 
OptimalAlgorithm VARCHAR(200) NOT NULL , 
PRIMARY KEY (ResultID)) ");

if (!$result12)
{
    echo "ERROR -> ".mysqli_error($conn);
}

$result13 = mysqli_query($conn, "CREATE TABLE requests 
(RequestID INT NOT NULL AUTO_INCREMENT , 
SimulationID INT NOT NULL , 
ElevatorID INT NOT NULL , 
OriginFloor INT NOT NULL , 
DestinationFloor INT NOT NULL, 
PRIMARY KEY (RequestID))");

if (!$result13)
{
    echo "ERROR -> ".mysqli_error($conn);
}

mysqli_close($conn);
?>