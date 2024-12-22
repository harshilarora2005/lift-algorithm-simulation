<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulation Results</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f4f4f9;
            margin: 0;
            padding: 20px;
        }
        h2, h3 {
            text-align: center;
            color: #333;
        }
        .results-container {
            width: 90%;
            max-width: 800px;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            overflow: hidden;
            margin-top: 20px;
        }
        .table-wrapper {
            overflow-x: auto;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            min-width: 800px;
        }
        th, td {
            padding: 15px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #007bff;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .action-buttons {
            margin-top: 10px;
            display: flex;
            justify-content: center;
        }
        .action-button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            cursor: pointer;
            text-align: center;
        }
        .action-button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="action-buttons">
        <form method="GET" style="display: inline;">
            <input type="hidden" name="latest_results" value="true">
            <button type="submit" class="action-button">View Latest Simulation Results</button>
        </form>

        <a href="index.php" class="action-button">Back to Landing Page</a>
    </div>

    <div class="results-container">
        <h2>Simulation Results</h2>
        <div class="table-wrapper">
            <table>
                <tr>
                    <th>Result ID</th>
                    <th>Simulation ID</th>
                    <th>Terrain</th>
                    <th>Efficiency Score</th>
                    <th>Optimal Algorithm</th>
                </tr>
                <?php
                $servername = "localhost";
                $username = "root";
                $password = "";
                $database = "elevatordb";
                $conn = mysqli_connect($servername, $username, $password, $database);
                if (!$conn) {
                    die("Connection failed: " . mysqli_connect_error());
                }
                $sql = "SELECT * FROM simulationResults";
                $result = mysqli_query($conn, $sql);
                while ($row = mysqli_fetch_assoc($result)) {
                    echo "<tr>
                            <td>{$row['ResultID']}</td>
                            <td>{$row['SimulationID']}</td>
                            <td>{$row['Terrain']}</td>
                            <td>{$row['EfficiencyScore']}</td>
                            <td>{$row['OptimalAlgorithm']}</td>
                        </tr>";
                }
                mysqli_close($conn);
                ?>
            </table>
        </div>
    </div>

    <?php
    if (isset($_GET['latest_results']) && $_GET['latest_results'] == 'true') {
        echo '<div id="latestResultsContainer" style="margin-top: 20px;">';
        echo "<h3>Algorithm Results for Latest Simulation</h3>";

        $conn = mysqli_connect($servername, $username, $password, $database);
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error());
        }

        $sql_latest = "SELECT * FROM Simulations ORDER BY SimulationID DESC LIMIT 4";
        $result_latest = mysqli_query($conn, $sql_latest);

        if (mysqli_num_rows($result_latest) > 0) {
            echo "<div class='table-wrapper'><table>
                    <tr>
                        <th>SimulationID</th>
                        <th>SimulationNumber</th>
                        <th>StartTime</th>
                        <th>EndTime</th>
                        <th>ElevatorID</th>
                        <th>TerrainID</th>
                        <th>NumberOfRequests</th>
                        <th>TotalWaitTime</th>
                        <th>AlgorithmUsed</th>
                    </tr>";
            
            while($row = mysqli_fetch_assoc($result_latest)) {
                echo "<tr>
                        <td>{$row['SimulationID']}</td>
                        <td>{$row['SimulationNumber']}</td>
                        <td>{$row['StartTime']}</td>
                        <td>{$row['EndTime']}</td>
                        <td>{$row['ElevatorID']}</td>
                        <td>{$row['TerrainID']}</td>
                        <td>{$row['NumberOfRequests']}</td>
                        <td>{$row['TotalWaitTime']}</td>
                        <td>{$row['AlgorithmUsed']}</td>
                      </tr>";
            }
            echo "</table></div>";
        } else {
            echo "<p>No records found.</p>";
        }
        mysqli_close($conn);
        echo '</div>';
    }
    ?>
</body>
</html>
