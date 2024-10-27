
const floormap=new Map();
const liftavailable=new Map();
const liftlocation=new Map();
let liftscount,floorscount;
let algorithm="Scan or Look";
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
    const inputBox = document.querySelector("#input-box");
    inputBox.style.display = "none";
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