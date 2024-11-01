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
            align-items: center;
            justify-content: center;
            background-color: #f4f4f9;
            margin: 0;
            padding: 0;
            height: 100vh;
        }

        h2 {
            text-align: center;
            color: #333;
        }

        .results-container {
            width: 90%;
            max-width: 800px;
            margin: 20px auto;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            overflow: hidden;
        }

        table {
            width: 100%;
            border-collapse: collapse;
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

        .back-button {
            display: inline-block;
            margin: 20px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            cursor: pointer;
        }

        .back-button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="results-container">
        <h2>Simulation Results</h2>
        <table>
            <tr>
                <th>Result ID</th>
                <th>Simulation ID</th>
                <th>Efficiency Score</th>
                <th>Optimal Algorithm</th>
            </tr>
            <?php
            // Database connection
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
                        <td>{$row['EfficiencyScore']}</td>
                        <td>{$row['OptimalAlgorithm']}</td>
                        </tr>";
            }

            // Close the database connection
            mysqli_close($conn);
            ?>
        </table>
        <div style="text-align: center;">
            <a href="index.html" class="back-button">Back to Landing Page</a>
        </div>
    </div>
</body>
</html>
