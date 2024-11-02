const floorheight=110;
const floormap=new Map();
const liftavailable=new Map();
const liftDirection = new Map();
const liftlocation=new Map();
const liftQueue = [];
const liftQueues=new Map();
let algocompleted = 0;
let liftscount,floorscount;
let algorithm="Scan";
let terrain="Smooth Ramp"
const SimulationID = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
function toggle(x){
    location.reload();
    liftQueues.clear();
    initialize();
    const element=document.querySelector(`#option input:nth-of-type(${x})`);
    algorithm=element.value;
    for(let i=1;i<=4;i++){
        document.querySelector(`#option input:nth-of-type(${i})`).classList.remove("selectedbtn");
    }
    element.classList.add("selectedbtn");
}
function initialize(){
    for (let i = 1; i <= liftscount; i++) {
        liftQueues.set(`lift-${i}`, []);
    }
}
function toggle1(x){
    const element=document.querySelector(`#terrain-option input:nth-of-type(${x})`);
    terrain=element.value;
    for(let i=1;i<=3;i++){
        document.querySelector(`#terrain-option input:nth-of-type(${i})`).classList.remove("selectedbtn");
    }
    element.classList.add("selectedbtn");
}
function startSimulation(event){
    event.preventDefault();
    document.getElementById("option").style.visibility="visible";
    document.getElementById("input-count").style.display="flex";
    const floors=parseInt(document.getElementById("floors-input").value);
    const elevators=parseInt(document.getElementById("elevator-input").value);
    if(floors <= 0 || floors> 100 || elevators <= 0 || elevators > 10) {
        alert("Invalid input! Try again.");
        return;
    }
    floorscount=floors;
    liftscount=elevators;
    const landing = document.querySelector("#landing");
    landing.style.display = "none";
    const inputContainer = document.querySelector("#floors-count");
    const liftCount = document.querySelector("#lifts-count");
    inputContainer.textContent = `Floors count - ${floors}`;
    liftCount.textContent = `Lifts count - ${elevators}`;
    addfloors(floors);
    addlifts(elevators);
    
}

function addfloors(totalFloors){
    const floorscontainer=document.querySelector('#floors-container');
    floorscontainer.style.visibility="visible";
    for(let i=totalFloors;i>0;i--){
        const currfloor=document.createElement("div");
        currfloor.className="floor";
        const floorId=`floor-${i}`;
        currfloor.id=floorId;
        currfloor.innerHTML=
        `
            <div class="floor-details">
                <button class="lift-button up"><i class="fa-solid fa-arrow-up"></i>UP</button>
                <p class="floor-number">Floor-${i}</p>
                <button class="lift-button down"><i class="fa-solid fa-arrow-down"></i>DOWN</button>
            </div>
        `;
        currfloor.querySelector(".up").addEventListener("click", (event) => liftcall(event,"up"));
        currfloor.querySelector(".down").addEventListener("click",(event)=> liftcall(event,"down"));
        floorscontainer.appendChild(currfloor);
        floormap.set(floorId,null);
    }
    const groundFloor = document.createElement("div");
    groundFloor.className = "floor";
    groundFloor.id = `floor-0`;
    groundFloor.innerHTML = 
    `
            <div class="floor-details">
                <button class="lift-button up" ><i class="fa-solid fa-arrow-up"></i>UP</button>
                <p class="floor-number">Floor-0</p> 
            </div>
    `;
    groundFloor.querySelector(".up").addEventListener("click", (event) => liftcall(event,"up"));
    floorscontainer.appendChild(groundFloor);
    floormap.set("floor-0",null);
    floorscontainer.style.visibility = "visible";
    floorscontainer.style.border = `2px solid var(--primary-color)`;
}

function addlifts(totalLifts){
    const groundFloor=document.querySelector('#floor-0');
    for(let i=1;i<=totalLifts;i++){
        const currlift=document.createElement('div');
        currlift.className="lift";
        currlift.id=`lift-${i}`;
        currlift.innerHTML=
        `
            <div class='door left-doors'></div>
            <div class='door right-doors'></div>
        `;
        liftavailable.set(`lift-${i}`,true);
        liftlocation.set(`lift-${i}`,0);
        liftQueues.set(`lift-${i}`, []);
        groundFloor.appendChild(currlift);
    }   
}
function liftcall(event,direction) {
    const currentFloor = parseInt(event.target.closest('.floor').id.split('-')[1]);
    destinationPanel(currentFloor,direction);
}

function destinationPanel(currentFloor, direction) {
    const modal = document.getElementById("destination-modal");
    const floorSelect = document.getElementById("floor-select");
    floorSelect.innerHTML = ""; 
    if (direction === 'up') {
        for (let i = currentFloor + 1; i <= floorscount; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `Floor ${i}`;
            floorSelect.appendChild(option);
        }
    } else if (direction === 'down') {
        for (let i = currentFloor - 1; i >= 0; i--) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `Floor ${i}`;
            floorSelect.appendChild(option);
        }
    }

    modal.dataset.callFloor = currentFloor;
    modal.style.display = "block";
}
document.querySelector(".close").onclick = function() {
    document.getElementById("destination-modal").style.display = "none";
};
document.getElementById("submit-destination").onclick = function() {
    const callFloor = parseInt(document.getElementById("destination-modal").dataset.callFloor);
    const destinationFloor = parseInt(document.getElementById("floor-select").value);
    document.getElementById("destination-modal").style.display = "none";
    addLiftRequest(callFloor,destinationFloor);
};
function addLiftRequest(origin, destination) {
    const request = { origin, destination };
    let assignedLiftId = null;
    for (let i = 1; i <= liftscount; i++) {
        const liftId = `lift-${i}`;
        const liftLocation = liftlocation.get(liftId);
        const isAvailable = liftavailable.get(liftId);
        if (isAvailable && (assignedLiftId === null || Math.abs(liftLocation - origin) < Math.abs(liftlocation.get(assignedLiftId) - origin))) {
            assignedLiftId = liftId;
            break;
        }
    }

    if (assignedLiftId) {
        liftQueues.get(assignedLiftId).push(request); 
        liftavailable.set(assignedLiftId, false);
        let path = [];
        switch(algorithm){
            case 'Scan':
                path = scan(assignedLiftId);
                break;
            case 'Look':
                path = look(assignedLiftId);
                break;
            case 'Shortest Seek Time First':
                path = sstf(assignedLiftId);
                break;
            case 'First Come First Serve':
                path = fcfs(assignedLiftId);
                break;
        } 
        if (path) {
            moveLift1(assignedLiftId, path).then(() => { 
                liftavailable.set(assignedLiftId, true); 
            });
        }
    } else {
        console.log("No available lift to handle the request at this moment.");
    }
}

function scan(liftId) {
    let path = [];
    const Queue = liftQueues.get(liftId);
    const currentFloor = liftlocation.get(liftId) || 0;
    const requests = Queue.map(request => ({
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
    for (let i = 0; i < origins.length; i++) {
        path.push(origins[i]); 
        if (destinations[i] > origins[i]) { 
            path.push(destinations[i]);
            destinations = destinations.filter(item => item !== destinations[i]); 
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
    path.push(floorscount);
    destinations.reverse().forEach(destination => path.push(destination));
    console.log("Scan path:", path);
    liftQueues.set(liftId, []);
    return path;
}
function look(liftId) {
    let path = [];
    const Queue = liftQueues.get(liftId);
    const currentFloor = liftlocation.get(liftId) || 0;
    const requests = Queue.map(request => ({
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
    for (let i = 0; i < origins.length; i++) {
        path.push(origins[i]); 
        if (destinations[i] > origins[i]) { 
            path.push(destinations[i]);
            destinations = destinations.filter(item => item !== destinations[i]); 
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
    destinations.reverse().forEach(destination => path.push(destination));
    console.log("Scan path:", path);
    liftQueues.set(liftId, []);
    return path;
}
function sstf(origin,destination){
    const path = [];
    let currentFloor = liftlocation.get(liftId) || 0;
    const Queue = liftQueues.get(liftId).slice(); 
    while (Queue.length > 0) {
        Queue.sort((a, b) => Math.abs(a.origin - currentFloor) - Math.abs(b.origin - currentFloor));
        const closestRequest = Queue.shift(); 
        path.push(closestRequest.origin);
        currentFloor = closestRequest.origin;
        path.push(closestRequest.destination);
        currentFloor = closestRequest.destination;
    }
    console.log(`SSTF path for ${liftId}:`, path);
    liftQueues.set(liftId, []);
    return path;
}
function fcft(origin,destination){
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
function moveLift1(liftId, destinations) {
    return new Promise((resolve) => {
        const lift = document.getElementById(liftId);
        let currindex = 0;
        function processPull() {
            if (currindex < destinations.length) {
                const destinationFloor = destinations[currindex];
                const currentFloor = liftlocation.get(liftId) || 0;
                const floorDifference = Math.abs(destinationFloor - currentFloor);
                const travelTime = floorDifference * 1000;

                lift.style.transition = `transform ${travelTime / 1000}s`;
                const newPosition = destinationFloor * 110;
                lift.style.transform = `translateY(-${newPosition}px)`;

                setTimeout(() => {
                    liftlocation.set(liftId, destinationFloor);
                    console.log(`${liftId} has arrived at floor ${destinationFloor}.`);
                    openLiftDoors(liftId);

                    currindex++;
                    setTimeout(processPull, 3000); 
                }, travelTime + 2000); 
            } else {
                const returnFloor = 0;
                const newPosition = returnFloor * 110;
                lift.style.transition = 'transform 2s';
                lift.style.transform = `translateY(-${newPosition}px)`;

                setTimeout(() => {
                    liftlocation.set(liftId, returnFloor);
                    console.log(`${liftId} has returned to floor 0.`);
                    closeLiftDoors(liftId);
                    resolve();
                }, 2000);
            }
        }

        processPull();
    });
}
let floorsNum;
function startComparison() {
    liftlocation.clear();
    document.getElementById('landing').style.display = 'none';
    document.getElementById('comparison-area').style.display = 'block';
    document.getElementById('terrain-option').style.visibility = "visible";
    document.getElementById('option').style.display = 'none';
    document.getElementById('start-button-section').style.display = 'block';
}
function beginComparison() {
    liftlocation.clear();
    document.getElementById('start-button-section').style.display = 'none';
    document.getElementById('input-count').style.display = 'flex';
    floorsNum =  Math.floor(Math.random() * (25 - 10 + 1)) + 10; 
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
    submitBuildingForm();
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
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Requests logged successfully.');
        } else {
            console.error('Failed to log requests:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
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
            lift.style.transition = 'none';
            lift.style.transform = `translateY(-${currentPosition}px)`;
            lift.offsetHeight;
            lift.style.transition = `transform ${travelTime / 1000}s`; 
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
function submitBuildingForm() {
    document.getElementById('num_floors').value = floorsNum;
    document.getElementById('building-form').submit(); 
}
