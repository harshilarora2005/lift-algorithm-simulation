const floorheight=110;
// const floormap=new Map();
const liftavailable=new Map();
const liftDirection = new Map();
const liftlocation=new Map();
const liftQueue = [];
const liftQueues=new Map();
let algocompleted = 0;
let liftscount,floorscount;
let algorithm="Scan";
let terrain="Level Ground"
const SimulationID = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
function initialize(){
    for (let i = 1; i <= liftscount; i++) {
        liftQueues.set(`lift-${i}`, []);
    }
}
function toggle1(x){
    const element=document.querySelector(`#terrain-option input:nth-of-type(${x})`);
    terrain=element.value;
    for(let i=1;i<=4;i++){
        document.querySelector(`#terrain-option input:nth-of-type(${i})`).classList.remove("selectedbtn");
    }
    element.classList.add("selectedbtn");
}
let floorsNum;
function startComparison(event) {
    event.preventDefault();
    liftlocation.clear();
    document.getElementById("header-info").style.display="flex";
    floorsNum = parseInt(document.getElementById("floors-input").value);
    document.getElementById('landing').style.display = 'none';
    document.getElementById('comparison-area').style.display = 'block';
    document.getElementById('terrain-option').style.visibility = "visible";
    document.getElementById('start-button-section').style.display = 'block';
    const simulationIdDisplay = document.getElementById("simulation-id-display");
    simulationIdDisplay.style.display="flex";
    simulationIdDisplay.innerHTML = `<h3>Simulation ID: ${SimulationID}</h3>`;
}
function beginComparison() {
    liftlocation.clear();
    document.getElementById('start-button-section').style.display = 'none';
    document.getElementById('input-count').style.display = 'flex';
    document.getElementById('terrain-option').style.visibility = "hidden";
    const inputContainer = document.querySelector("#floors-count");
    inputContainer.textContent=`Floors count - ${floorsNum}`;
    const buildingsContainer = document.getElementById("buildings-container");
    buildingsContainer.innerHTML = "";
    for (let i = 1; i <= 4; i++) {
        const buildingWrapper = document.createElement("div");
        buildingWrapper.classList.add("building-wrapper");
        const building = document.createElement("div");
        building.classList.add("building");
        building.id = `building-${i}`;
        const algo_name = document.createElement("h2");
        algo_name.classList.add("algo-name");
        algo_name.id = `algo-name-${i}`; 
        const icon = document.createElement('i');
        switch (i) {
            case 1:
                algo_name.textContent = "Scan Algorithm";
                icon.classList.add('fa-solid', 'fa-barcode');
                algo_name.classList.add("algo-scan");
                break;
            case 2:
                algo_name.textContent = "Look Algorithm";
                algo_name.classList.add("algo-look");
                icon.classList.add('fa-solid', 'fa-eye'); 
                break;
            case 3:
                algo_name.textContent = "Shortest Seek Time First Algorithm";
                algo_name.classList.add("algo-sstf");
                icon.classList.add('fa-solid', 'fa-stopwatch');
                break;
            case 4:
                algo_name.textContent = "First Come First Serve Algorithm";
                algo_name.classList.add("algo-fcfs");
                icon.classList.add('fa-solid', 'fa-users');
                break;
            default:
                algo_name.textContent = "Unknown Algorithm";
                break;
        }
        algo_name.appendChild(icon);
        buildingWrapper.appendChild(algo_name);
        for (let j = floorsNum; j > 0; j--) {
            const floor = document.createElement("div");
            floor.classList.add("floors");
            floor.innerHTML = `
                <div class="floors-details">
                    <p class="floors-number">Floor-${j}</p>
                </div>
            `;
            building.appendChild(floor);
        }
        const groundFloor = document.createElement("div");
        groundFloor.className = "floors";
        groundFloor.id = `floors-0`;
        groundFloor.innerHTML = `
            <div class="floors-details">
                <p class="floors-number">Floor-0</p> 
            </div>
        `;
        building.appendChild(groundFloor);
        const lift = document.createElement("div");
        lift.className = "lifts";
        lift.id = `lifts-${i}`;
        liftlocation.set(`lifts-${i}`, 0);
        lift.innerHTML = `
            <div class='doors left-doors'></div>
            <div class='doors right-doors'></div>
        `;

        building.appendChild(lift);
        buildingWrapper.appendChild(building);
        buildingsContainer.appendChild(buildingWrapper);
        
    }
    generateRandomLiftRequest(floorsNum);
    Promise.all([
        processLiftRequests('lifts-1'),
        processLiftRequests('lifts-2'),
        processLiftRequests('lifts-3'),
        processLiftRequests('lifts-4')
    ]).then(() => {
        console.log("Both lift requests processed.");
    });
}

function generateRandomLiftRequest(numfloors) {
    return new Promise((resolve) => {
        for (let i = 0; i < 5; i++) {
            const origin = Math.floor(Math.random() * (numfloors + 1)); 
            let destination;
            do {
                destination = Math.floor(Math.random() * (numfloors + 1)); 
            } while (destination === origin);
            liftQueue.push({ origin, destination });
        }
        const requestContainer = document.getElementById("requests-count");
        requestContainer.innerHTML = ''; 
        liftQueue.forEach((request, index) => {
            const requestItem = document.createElement('div');
            requestItem.textContent = `Request ${index + 1}: Origin - ${request.origin}, Destination - ${request.destination}`;
            requestContainer.appendChild(requestItem);
        });
        sendRequests();
        resolve();
    });

}
function sendRequests(){
    fetch('log_requests.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            simulationID: SimulationID,
            requests: liftQueue
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.status === 'success') {
            console.log('Requests logged successfully.');
        } else {
            console.error('Failed to log requests:', data ? data.message : 'No response data');
        }
    })
    .catch(error => {
        console.error('Fetch error:', error.message || error);
    });
}
function processLiftRequests(liftId) {
    const choice=liftId.split("-")[1];
    if (liftQueue.length > 0) {
        switch(choice){
            case "1":{
                const path = scanAlgorithm(liftId); 
                if (path) {
                    moveLift(liftId, path);
                }
                break;
            }
            case "2":{
                const path = lookAlgorithm(liftId); 
                if (path) {
                    moveLift(liftId, path);
                }
                break;
            }
            case "3":{
                const path = fcfsAlgorithm(liftId);
                if (path){
                    moveLift(liftId, path);
                }
                break;
            }
            case "4":{
                const path = sstfAlgorithm(liftId);
                if (path) moveLift(liftId, path);
                break;
            }
            default:
                console.log("end");
                break;
        }
    }
}
function scanAlgorithm(liftId) {
    let path = [];
    const requests = liftQueue.map(request => ({
        origin: request.origin,
        destination: request.destination
    }));
    for (let i = 0; i < requests.length; i++) {
        for (let j = 0; j < requests.length - 1 - i; j++) {
            if (requests[j].origin> requests[j + 1].origin) {
                const temp = requests[j];
                requests[j] = requests[j + 1];
                requests[j + 1] = temp;
            }
        }
    }
    const origins = requests.map(request => request.origin);
    let destinations = requests.map(request => request.destination);
    for(let i=0;i<5;i++){
        path.push(origins[i]);
        if(destinations[i]>origins[i]){
            path.push(destinations[i]);
            destinations = destinations.filter(item => item !== destinations[i])
        }
    }
    let uniquePath = [];
    let pathSet = new Set();
    for (let item of path) {
        if (!pathSet.has(item)) {
            pathSet.add(item); 
            uniquePath.push(item); 
        }
    }
    path = uniquePath;
    path.sort((a, b) => a - b);
    path.push(floorsNum);
    destinations.reverse();
    path.push()
    for (const destination of destinations) {
        path.push(destination);
    }
    console.log("Scan path:",path);
    return path;
}
function lookAlgorithm(liftId) {
    let path = [];
    const requests = liftQueue.map(request => ({
        origin: request.origin,
        destination: request.destination
    }));
    for (let i = 0; i < requests.length; i++) {
        for (let j = 0; j < requests.length - 1 - i; j++) {
            if (requests[j].origin> requests[j + 1].origin) {
                const temp = requests[j];
                requests[j] = requests[j + 1];
                requests[j + 1] = temp;
            }
        }
    }
    const origins = requests.map(request => request.origin);
    let destinations = requests.map(request => request.destination);
    for(let i=0;i<5;i++){
        path.push(origins[i]);
        if(destinations[i]>origins[i]){
            path.push(destinations[i]);
            destinations = destinations.filter(item => item !== destinations[i])
        }
    }
    let uniquePath = [];
    let pathSet = new Set();
    for (let item of path) {
        if (!pathSet.has(item)) {
            pathSet.add(item); 
            uniquePath.push(item); 
        }
    }
    path = uniquePath;
    path.sort((a, b) => a - b);
    destinations.reverse();
    path.push()
    for (const destination of destinations) {
        path.push(destination);
    }
    console.log("Look path:",path);
    return path;
}
function fcfsAlgorithm(liftId){
    const path = [];
    console.log(liftlocation);
    let currentFloor = liftlocation.get(liftId) || 0;
    liftQueue.forEach(request => {
        path.push(request.origin); 
        currentFloor = request.origin;
        if (request.destination !== currentFloor) {
            path.push(request.destination); 
            currentFloor = request.destination;
        }
    });
    console.log("FCFS path:", path);
    return path;
}
function sstfAlgorithm(liftId){
    const path = [];
    let currentFloor = liftlocation.get(liftId) || 0;
    let pendingRequests = liftQueue.slice();
    while (pendingRequests.length > 0) {
        pendingRequests.sort((a, b) => Math.abs(a.origin - currentFloor) - Math.abs(b.origin - currentFloor));
        const closestRequest = pendingRequests.shift();
        path.push(closestRequest.origin); 
        currentFloor = closestRequest.origin;
        path.push(closestRequest.destination);
        currentFloor = closestRequest.destination;
    }
    console.log("SSTF path:",path);
    return path;
}

function moveLift(liftId, destinations) {
    const lift = document.getElementById(liftId);
    let currindex = 0; 
    let startTime=performance.now();
    logAlgorithmEvent(liftId, "start");
    function processPull() {
        if (currindex < destinations.length) {
            const destinationFloor = destinations[currindex];
            const currentFloor = liftlocation.get(liftId) || 0;
            const floorDifference = Math.abs(destinationFloor - currentFloor);
            const travelTime = floorDifference * 1000; 
            const currentPosition = currentFloor * 110;
            let inclineAngle;
            switch (terrain) {
                case "Level Ground":
                    inclineAngle = 0;
                    break;
                case "Gentle Slope":
                    inclineAngle = 10;
                    break;
                case "Hilly Path":
                    inclineAngle = 15;
                    break;
                case "Mountainous Slope":
                    inclineAngle = 25;
                    break;
            }
            const inclineRadians = (inclineAngle * Math.PI) / 180;
            const inclineFactor = 1 + Math.sin(inclineRadians);
            let adjustedTravelTime = travelTime;
            if (destinationFloor > currentFloor) {

                adjustedTravelTime *= inclineFactor;
            } else if (destinationFloor < currentFloor) {
                adjustedTravelTime /= inclineFactor;
            }
            lift.style.transition = 'none';
            lift.style.transform = `translateY(-${currentPosition}px)`;
            lift.offsetHeight;
            lift.style.transition = `transform ${adjustedTravelTime / 1000}s`; 
            const newPosition = destinationFloor * 110;
            lift.style.transform = `translateY(-${newPosition}px)`;
            setTimeout(() => {
                liftlocation.set(liftId, destinationFloor); 
                console.log(`${liftId} has arrived at floor ${destinationFloor}.`);
                openLiftDoors(liftId);
                currindex++;
                setTimeout(processPull, 3000); 
            }, travelTime+2000); 
        } else {
            const currentFloor = liftlocation.get(liftId);
            const returnFloor = 0;
            const floorDifference = Math.abs(returnFloor - currentFloor);
            const travelTime = floorDifference * 1000; 
            const newPosition = returnFloor * 110; 
            lift.style.transition = `transform ${travelTime / 1000}s`; 
            lift.style.transform = `translateY(-${newPosition}px)`; 
            algocompleted++;
            setTimeout(() => {
                liftlocation.set(liftId, returnFloor); 
                console.log(`${liftId} has returned to floor 0.`);
                closeLiftDoors(liftId); 
                let endTime = performance.now(); 
                let timeTaken = (endTime - startTime) / 1000; 
                console.log(`Time taken by ${liftId}: ${timeTaken} seconds`);
                const liftNumber = liftId.split('-')[1]; 
                const name = document.getElementById(`algo-name-${liftNumber}`);
                console.log("added");
                if (name) {
                    name.classList.add('completed');
                }
                liftavailable.set(liftId, true);
            }, 2000);
            logAlgorithmEvent(liftId, "end");
        }
    }
    processPull(); 
}
function openLiftDoors(liftId) {
    const lift = document.getElementById(liftId);
    const leftDoor = lift.querySelector('.left-doors');
    const rightDoor = lift.querySelector('.right-doors');
    leftDoor.style.transition = 'transform 2s'; 
    rightDoor.style.transition = 'transform 2s'; 
    leftDoor.style.transform = 'translateX(-50%)'; 
    rightDoor.style.transform = 'translateX(50%)'; 
    setTimeout(() => {
        closeLiftDoors(liftId);
    }, 3000); 
}
function closeLiftDoors(liftId) {
    const lift = document.getElementById(liftId);
    const leftDoor = lift.querySelector('.left-doors');
    const rightDoor = lift.querySelector('.right-doors');
    leftDoor.style.transition = 'transform 0.5s'; 
    rightDoor.style.transition = 'transform 0.5s'; 
    leftDoor.style.transform = 'translateX(0)'; 
    rightDoor.style.transform = 'translateX(0)'; 
}
function logAlgorithmEvent(liftId, event) {
    const liftNumber = liftId.split('-')[1]; 
    console.log(terrain);
    if(event=="end"){
        console.log(`${liftId}-${event}`);
    }
    document.getElementById("form_simulation_number").value = SimulationID;
    document.getElementById("form_terrain").value = terrain;
    document.getElementById("form_lift_id").value = liftNumber; 
    document.getElementById("form_event_type").value = event; 
    document.getElementById("algorithm-event-form").submit();
}