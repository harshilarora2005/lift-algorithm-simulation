const floorheight=110;
const floormap=new Map();
const liftavailable=new Map();
const liftlocation=new Map();
const liftQueue = [];
let liftscount,floorscount;
let algorithm="Scan";

function toggle(x){
    const element=document.querySelector(`#option input:nth-of-type(${x})`);
    algorithm=element.value;
    for(let i=1;i<=4;i++){
        document.querySelector(`#option input:nth-of-type(${i})`).classList.remove("selectedbtn");
    }
    element.classList.add("selectedbtn");
}
function startSimulation(event){
    event.preventDefault();
    document.getElementById("option").style.visibility="visible";
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
    const floorsCountContainer = document.querySelector("#floors-count");
    const liftsCountContainer = document.querySelector("#lifts-count");
    floorsCountContainer.textContent = `Floors count - ${floors}`;
    liftsCountContainer.textContent = `Lifts count - ${elevators}`;
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
        currfloor.querySelector(".up").addEventListener("click", (event) => liftcall(event));
        currfloor.querySelector(".down").addEventListener("click",(event)=> liftcall(event));
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
    groundFloor.querySelector(".up").addEventListener("click", (event) => liftcall(event));
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
            <div class='door left-door'></div>
            <div class='door right-door'></div>
        `;
        liftavailable.set(`lift-${i}`,true);
        liftlocation.set(`lift-${i}`,0);
        groundFloor.appendChild(currlift);
    }   
}
function liftcall(event) {
    const currentFloor = parseInt(event.target.closest('.floor').id.split('-')[1]);
    destinationPanel(currentFloor);
}

function destinationPanel(currentFloor) {
    const modal = document.getElementById("destination-modal");
    const floorSelect = document.getElementById("floor-select");
    floorSelect.innerHTML = "";
    for (let i = floorscount; i >= 0; i--) {
        if (i !== currentFloor) { 
            const option = document.createElement("option");
            option.value = i;
            option.textContent = `Floor ${i}`;
            floorSelect.appendChild(option);
        }
    }
    modal.dataset.callFloor = floorSelect;
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

function addLiftRequest(origin,destination){
    switch(algorithm){
        case 'Scan':
            algorithm1(origin,destination);
        case 'Look':
            algorithm2(origin,destination);
        case 'Shortest Seek Time First':
            algorithm3(origin,destination);
        case 'Collective Control':
            algorithm4(origin,destination);
    }
}
function algorithm1(origin,destination){
    //for SCAN 
}
function algorithm2(origin,destination){
    //for LOOK
}
function algorithm3(origin,destination){
    //for SHORTEST SEEK TIME FIRST
}
function algorithm4(origin,destination){
    //for COLLECTIVE CONTROL
}
let floorsPerBuilding;
function startComparison() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('comparison-area').style.display = 'block';
    const numBuildings = 4; 
    floorsPerBuilding =  Math.floor(Math.random() * (25 - 10 + 1)) + 10; 
    const floorsCountContainer = document.querySelector("#floors-count");
    floorsCountContainer.textContent=`Floors count - ${floorsPerBuilding}`;
    const buildingsContainer = document.getElementById("buildings-container");
    buildingsContainer.innerHTML = "";
    for (let i = 1; i <= numBuildings; i++) {
        const building = document.createElement("div");
        building.classList.add("building");
        building.id = `building-${i}`;
        liftlocation.set(`lifts-${i}`, 0);
        for (let j = floorsPerBuilding; j > 0; j--) {
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
        lift.innerHTML = `
            <div class='doors left-doors'></div>
            <div class='doors right-doors'></div>
        `;

        building.appendChild(lift);
        buildingsContainer.appendChild(building);
    }
    Promise.all([
        generateRandomLiftRequest('lifts-1', floorsPerBuilding),
        generateRandomLiftRequest('lifts-2', floorsPerBuilding)
    ]).then(() => {
        console.log("Both lift requests processed.");
    });
}

function generateRandomLiftRequest(liftid, numfloors) {
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
        console.log(liftQueue);
        processLiftRequests(liftid);
        resolve();
    });
}

function scanAlgorithm(liftId) {
    const currentLocation = liftlocation.get(liftId);
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
    path = [...new Set(path)];
    path.sort((a, b) => a - b);
    path.push(floorsPerBuilding);
    destinations.reverse();
    path.push()
    for (const destination of destinations) {
        path.push(destination);
    }
    return path;
}
function lookAlgorithm(liftId) {
    const currentLocation = liftlocation.get(liftId);
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
    path = [...new Set(path)];
    path.sort((a, b) => a - b);
    destinations.reverse();
    path.push()
    for (const destination of destinations) {
        path.push(destination);
    }
    return path;
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
                
                break;
            }
            case "4":{
                
                break;
            }
            default:
                console.log("end");
                break;
        }
    }
}

function moveLift(liftId, destinations) {
    const lift = document.getElementById(liftId);
    let currindex = 0; 
    function processPull() {
        if (currindex < destinations.length) {
            const destinationFloor = destinations[currindex];
            const newPosition = destinationFloor * 110; 
            lift.style.transition = 'transform 5s'; 
            lift.style.transform = `translateY(-${newPosition}px)`; 
            setTimeout(() => {
                liftlocation.set(liftId, destinationFloor); 
                console.log(`${liftId} has arrived at floor ${destinationFloor}.`);
                openLiftDoors(liftId);
                currindex++;
                setTimeout(processPull, 3000); 
            }, 5000); 
        } else {
            const returnFloor = 0;
            const newPosition = returnFloor * 110; 
            lift.style.transition = 'transform 2s'; 
            lift.style.transform = `translateY(-${newPosition}px)`; 

            setTimeout(() => {
                liftlocation.set(liftId, returnFloor); 
                console.log(`${liftId} has returned to floor 0.`);
                closeLiftDoors(liftId); 
            }, 2000); 
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
    console.log(`Doors of ${liftId} are opening...`);
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
    console.log(`Doors of ${liftId} are closing...`);
}