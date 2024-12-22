<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lift Simulation Preview</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="https://kit.fontawesome.com/9433e2092d.js" crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <h1>Welcome to Lift Simulation</h1>
        <div id="header-info">
            <section id="simulation-id-display">
            </section>
            <section id="terrain-option">
                <input type="button" class="selectedbtn" onclick="toggle1(1)" value="Level Ground">
                <input type="button" onclick="toggle1(2)" value="Gentle Slope">
                <input type="button" onclick="toggle1(3)" value="Hilly Path">
                <input type="button" onclick="toggle1(4)" value="Mountainous Slope">
            </section>
            <section id="start-button-section">
                <button id="start-button" onclick="beginComparison()">Start</button>
            </section>
            <section id="input-count">
                <h2 id="floors-count"></h2>
                <h2 id="lifts-count"></h2>
                <h2 id="requests-count"></h2>
            </section>
        </div>
    </header>
    <main>
        <div id="landing">
            <div id="input-box">
                <div id="glass">
                    <div id="inner-input-box">
                        <h2>Enter input parameters:-</h2>
                        <form id="user-input" onsubmit="startComparison(event)" method="POST" action="">
                            <div id="input-boxes">
                                <div>
                                    <input type="number" min="10" max="100" name="floors-input" id="floors-input" placeholder="Floors:" required>
                                </div>
                            </div>
                            <input type="submit" id="compare-btn" name="compare-btn" value="Compare">
                        </form>
                        <?php
                            if($_SERVER["REQUEST_METHOD"]=="POST"){
                                $servername="localhost";
                                $username="root";
                                $password="";
                                $database = "ElevatorDB";
                                $conn = new mysqli($servername, $username, $password, $database);
                                if ($conn->connect_error) {
                                    die("Connection failed: " . $conn->connect_error);
                                }
                                $numFloors = $_POST['floors-input'];
                                $sql = "UPDATE Buildings SET NumFloors = $numFloors";
                                if ($conn->query($sql) === TRUE) {
                                    echo "All buildings updated successfully with NumFloors set to " . $numFloors . ".";
                                } else {
                                    echo "Error updating buildings: " . $conn->error;
                                }
                                $conn->close();
                            }
                        ?>
                        <button onclick="window.location.href='result.php'" id="result-button">View Results</button>
                        <h3>
                            <span class="emphasis">NOTE:</span>
                            <span>Floor can be varied from 10-100</span>
                        </h3>
                    </div>
                </div>
            </div>
        </div>
        <div id="comparison-area">
            <div id="buildings-container"></div>
            <form id="algorithm-event-form" action="SimulationData.php" method="POST" style="display: none;" target="hidden_iframe">
                <input type="hidden" name="simulation_number" id="form_simulation_number">
                <input type="hidden" name="terrain" id="form_terrain">
                <input type="hidden" name="lift_id" id="form_lift_id">
                <input type="hidden" name="event_type" id="form_event_type">
            </form>
            <iframe name="hidden_iframe" style="display: none;"></iframe>
        </div>
    </main>
    <script src="main.js"></script>
</body>
</html>