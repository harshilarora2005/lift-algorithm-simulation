<?php
header('Content-Type: application/json');
$inputJSON = file_get_contents('php://input');
$data = json_decode($inputJSON, true);
if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'No data received']);
    exit();
}

$simulationID = $data['simulationID'];
$requests = $data['requests'];

if (!isset($simulationID) || !is_array($requests)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid data received']);
    exit();
}
$servername = "localhost";
$username = "root";
$password = "";
$database = "ElevatorDB";

$conn = mysqli_connect($servername, $username, $password, $database);
if (!$conn) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed: ' . mysqli_connect_error()
    ]);
    exit();
}
$elevators = ['lifts-1', 'lifts-2', 'lifts-3', 'lifts-4'];
foreach ($elevators as $elevatorID) {
    foreach ($requests as $request) {
        $originFloor = $request['origin'];
        $destinationFloor = $request['destination'];
        $simulationID1 = mysqli_real_escape_string($conn, $simulationID);
        $elevatorID1 = mysqli_real_escape_string($conn, $elevatorID);
        $originFloor1 = mysqli_real_escape_string($conn, $originFloor);
        $destinationFloor1 = mysqli_real_escape_string($conn, $destinationFloor);
        $sql = "INSERT INTO requests (simulationNumber, elevatorID, originFloor, destinationFloor) 
                VALUES ('$simulationID1', '$elevatorID1', '$originFloor1', '$destinationFloor1')";

        if (!mysqli_query($conn, $sql)) {
            echo json_encode([
                'status' => 'error',
                'message' => 'Data insertion failed: ' . mysqli_error($conn)
            ]);
            mysqli_close($conn);
            exit();
        }
    }
}
mysqli_close($conn);
echo json_encode(['status' => 'success', 'message' => 'Requests logged successfully']);
?>
