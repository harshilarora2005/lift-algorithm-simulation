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


$result2 = mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `elevator`
(`ElevatorID` INT NOT NULL AUTO_INCREMENT,
`ElevatorName` VARCHAR(100) NOT NULL ,
`ElevatorCapacity` INT NOT NULL ,
`MaxSpeed` FLOAT NOT NULL ,
`AlgorithmUsed` VARCHAR(200) NOT NULL ,
PRIMARY KEY (`ElevatorID`))");


if (!$result2)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result3 = mysqli_query($conn, "INSERT INTO `elevator` (`ElevatorID`, `ElevatorName`, `ElevatorCapacity`, `MaxSpeed`, `AlgorithmUsed`)
VALUES
('1', 'Elevator1', '12', '1.5', 'Scan'),
('2', 'Elevator2', '12', '1.5', 'Look'),
('3', 'Elevator3', '12', '1.5', 'Shortest Seek Time First'),
('4', 'Elevator4', '12', '1.5', 'First Come First Serve');");


if (!$result3)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result4 = mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `buildings`
(`BuildingID` INT NOT NULL AUTO_INCREMENT ,
`BuildingName` VARCHAR(100) NOT NULL ,
`NumFloors` INT NOT NULL ,
PRIMARY KEY (`BuildingID`))");


if (!$result4)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result5 = mysqli_query($conn, "INSERT INTO `buildings` (`BuildingID`, `BuildingName`, `NumFloors`) VALUES
('1', 'Building1', '14'),
('2', 'Building2', '14'),
('3', 'Building3', '14'),
('4', 'Building4', '14')");


if (!$result5)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result6 = mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `terrains`
(`TerrainID` INT NOT NULL AUTO_INCREMENT ,
`TerrainName` VARCHAR(100) NOT NULL ,
`InclineAngle` FLOAT NOT NULL ,
`TerrainResistanceFactor` FLOAT NOT NULL ,
`AccessibilityDescription` TEXT NOT NULL ,
PRIMARY KEY (`TerrainID`))");


if (!$result6)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result7 = mysqli_query ($conn, "INSERT INTO `terrains` (`TerrainID`, `TerrainName`, `InclineAngle`, `TerrainResistanceFactor`, `AccessibilityDescription`) VALUES
('1', 'Level Ground', '0.0', '1', 'A flat, smooth surface with no incline, providing optimal conditions for lift operation. This terrain offers the least resistance, allowing for the fastest and most energy-efficient performance.'),
('2', 'Gentle Slope', '10.0', '1', 'A slight incline, similar to a gently sloping pathway or driveway. This terrain introduces a minor resistance that slightly slows down the lift’s movement, simulating conditions where additional power is needed to counteract the slope.'),
('3', 'Hilly Path', '15.0', '1', ' A moderate incline, like a hilly road. The lift encounters noticeable resistance here, requiring more energy and time to ascend, while descents are slightly faster due to gravity.'),
('4', 'Mountainous Slope', '25.0', '1', 'A steep incline, comparable to a mountainous or rugged path. This terrain offers high resistance, resulting in significantly slower lift speeds on upward trips and faster descents, simulating the challenges of operating on extreme slopes.')");


if (!$result7)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result9 = mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `simulations`
(`SimulationID` INT NOT NULL AUTO_INCREMENT ,
`SimulationNumber` INT NOT NULL ,
`StartTime` DATETIME NOT NULL ,
`EndTime` DATETIME NOT NULL ,
`ElevatorID` INT NOT NULL ,
`TerrainID` INT NOT NULL ,
`NumberOfRequests` INT NOT NULL ,
`TotalWaitTime` DATETIME NOT NULL ,
`AlgorithmUsed` VARCHAR(200) NOT NULL ,
PRIMARY KEY (`SimulationID`))");


if (!$result9)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result10 = mysqli_query($conn, "ALTER TABLE `simulations`
ADD FOREIGN KEY (`ElevatorID`)
REFERENCES `elevator`(`ElevatorID`)
ON DELETE CASCADE ON UPDATE CASCADE");


if (!$result10)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result12 = mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `simulationresults`
(`ResultID` INT NOT NULL AUTO_INCREMENT ,
`SimulationID` INT NOT NULL ,
`Terrain` VARCHAR(100) NOT NULL ,
`EfficiencyScore` FLOAT NOT NULL ,
`OptimalAlgorithm` VARCHAR(200) NOT NULL ,
PRIMARY KEY (`ResultID`)) ");


if (!$result12)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result13 = mysqli_query($conn, "CREATE TABLE IF NOT EXISTS`requests`
(`RequestID` INT NOT NULL AUTO_INCREMENT ,
`SimulationNumber` INT NOT NULL ,
`ElevatorID` INT NOT NULL ,
`OriginFloor` INT NOT NULL ,
`DestinationFloor` INT NOT NULL,
PRIMARY KEY (`RequestID`))");


if (!$result13)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result14 = mysqli_query($conn, "CREATE TABLE IF NOT EXISTS `locatedin`
(`ElevatorID` INT NOT NULL ,
`TerrainID` INT NOT NULL ,
`BuildingID` INT NOT NULL ,
`Location` VARCHAR(100) NOT NULL ,
PRIMARY KEY (`ElevatorID`,`TerrainID`, `BuildingID`))");


if (!$result14)
{
    echo "ERROR -> ".mysqli_error($conn);
}


$result15 = mysqli_query($conn, "INSERT INTO locatedin (ElevatorID, BuildingID, TerrainID, Location) VALUES
(1, 1, 1, 'Ground A'), (2, 1, 1, 'Ground B'), (3, 1, 1, 'Ground C'), (4, 1, 1, 'Ground D'),
(1, 2, 1, 'Ground E'), (2, 2, 1, 'Ground F'), (3, 2, 1, 'Ground G'), (4, 2, 1, 'Ground H'),
(1, 3, 1, 'Ground I'), (2, 3, 1, 'Ground J'), (3, 3, 1, 'Ground K'), (4, 3, 1, 'Ground L'),
(1, 4, 1, 'Ground M'), (2, 4, 1, 'Ground N'), (3, 4, 1, 'Ground O'), (4, 4, 1, 'Ground P'),

(1, 1, 2, 'Slope A'), (2, 1, 2, 'Slope B'), (3, 1, 2, 'Slope C'), (4, 1, 2, 'Slope D'),
(1, 2, 2, 'Slope E'), (2, 2, 2, 'Slope F'), (3, 2, 2, 'Slope G'), (4, 2, 2, 'Slope H'),
(1, 3, 2, 'Slope I'), (2, 3, 2, 'Slope J'), (3, 3, 2, 'Slope K'), (4, 3, 2, 'Slope L'),
(1, 4, 2, 'Slope M'), (2, 4, 2, 'Slope N'), (3, 4, 2, 'Slope O'), (4, 4, 2, 'Slope P'),

(1, 1, 3, 'Hill A'), (2, 1, 3, 'Hill B'), (3, 1, 3, 'Hill C'), (4, 1, 3, 'Hill D'),
(1, 2, 3, 'Hill E'), (2, 2, 3, 'Hill F'), (3, 2, 3, 'Hill G'), (4, 2, 3, 'Hill H'),
(1, 3, 3, 'Hill I'), (2, 3, 3, 'Hill J'), (3, 3, 3, 'Hill K'), (4, 3, 3, 'Hill L'),
(1, 4, 3, 'Hill M'), (2, 4, 3, 'Hill N'), (3, 4, 3, 'Hill O'), (4, 4, 3, 'Hill P'),

(1, 1, 4, 'Mountain A'), (2, 1, 4, 'Mountain B'), (3, 1, 4, 'Mountain C'), (4, 1, 4, 'Mountain D'),
(1, 2, 4, 'Mountain E'), (2, 2, 4, 'Mountain F'), (3, 2, 4, 'Mountain G'), (4, 2, 4, 'Mountain H'),
(1, 3, 4, 'Mountain I'), (2, 3, 4, 'Mountain J'), (3, 3, 4, 'Mountain K'), (4, 3, 4, 'Mountain L'),
(1, 4, 4, 'Mountain M'), (2, 4, 4, 'Mountain N'), (3, 4, 4, 'Mountain O'), (4, 4, 4, 'Mountain P')
;");


if (!$result15)
{
    echo "ERROR -> ".mysqli_error($conn);
}


mysqli_close($conn);
?>

