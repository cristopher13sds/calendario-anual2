let currentEventId = null;
const months = [
"Enero","Febrero","Marzo","Abril",
"Mayo","Junio","Julio","Agosto",
"Septiembre","Octubre","Noviembre","Diciembre"
];

const weekdays = [
"Lun","Mar","Mié","Jue","Vie","Sáb","Dom"
];

let events =
JSON.parse(
localStorage.getItem("events") || "[]"
);

events = events.map(ev=>{

if(!ev.year){

ev.year =
new Date().getFullYear();

}

return ev;

});

const yearInput =
document.getElementById("yearInput");

yearInput.value =
localStorage.getItem("calendarYear")
|| new Date().getFullYear();

const monthSelect =
document.getElementById("month");

months.forEach((m,i)=>{

const op =
document.createElement("option");

op.value=i;
op.textContent=m;

monthSelect.appendChild(op);

});

function saveYear(){

localStorage.setItem(
"calendarYear",
yearInput.value
);

updateDayLimits();

renderCalendar();

}

yearInput.addEventListener(
"change",
saveYear
);

function daysInMonth(month,year){

return new Date(
year,
month+1,
0
).getDate();

}

function addEvent(){

updateDayLimits();

document.getElementById(
"modal"
).style.display="flex";

}
function openNewEvent(){

document.getElementById(
"modalTitle"
).textContent =
"Nuevo Evento";

addEvent();

}
function closeModal(){

document.getElementById("modal")
.style.display="none";

}

window.onclick=function(e){

if(e.target.id==="modal"){
//closeModal();
}

};

let selectedEmoji="";

document
.querySelectorAll("#iconPicker span")
.forEach(icon=>{

icon.addEventListener("click",()=>{

document
.querySelectorAll("#iconPicker span")
.forEach(i=>
i.classList.remove(
"selected-icon"
)
);

icon.classList.add(
"selected-icon"
);

selectedEmoji=
icon.textContent;

document.getElementById(
"icon"
).value=
selectedEmoji;

});

});

template.addEventListener(
"change",
()=>{

switch(template.value){

case "cumple":

title.value="Cumpleaños";
color.value="yellow";
icon.value="🎂";

break;

case "viaje":

title.value="Viaje";
color.value="blue";
icon.value="✈️";

break;

case "vacaciones":

title.value="Vacaciones";
color.value="green";
icon.value="🏖";

break;

case "reunion":

title.value="Reunión";
color.value="orange";
icon.value="💼";

break;

case "medico":

title.value="Cita Médica";
color.value="pink";
icon.value="🏥";

break;

case "estudio":

title.value="Estudio";
color.value="purple";
icon.value="📚";

break;

}

});

function saveEvent(){

const start =
parseInt(dayStart.value);

const end =
parseInt(dayEnd.value);

const maxDays =
daysInMonth(
parseInt(month.value),
parseInt(yearInput.value)
);

if(start > maxDays){

alert(
`Ese mes solo tiene ${maxDays} días`
);

return;

}

if(end > maxDays){

alert(
`Ese mes solo tiene ${maxDays} días`
);

return;

}

if(end < start){

alert(
"El día final no puede ser menor al día inicial"
);

return;

}

if(
!title.value ||
!start ||
!end
){
alert(
"Complete los datos"
);
return;
}

events.push({

id:Date.now(),

year:+yearInput.value,

title:title.value,

cumplido:false,

month:+month.value,

dayStart:start,

dayEnd:end,

description:description.value,

icon:icon.value,

color:color.value

});

saveEvents();

closeModal();

title.value="";
description.value="";
dayStart.value="";
dayEnd.value="";
icon.value="";

}

function saveEvents(){

localStorage.setItem(
"events",
JSON.stringify(events)
);
updateDashboard();
renderCalendar();

}

function renderCalendar(){

const year =
parseInt(yearInput.value);

const calendar =
document.getElementById("calendar");

calendar.innerHTML="";

calendar.appendChild(
document.createElement("div")
);

for(let d=1; d<=31; d++){

const h =
document.createElement("div");

h.className="day-header";

const date =
new Date(year,0,d);

h.innerHTML =
d + "<br>" +
weekdays[(date.getDay()+6)%7];

calendar.appendChild(h);

}
const monthRows = {};
months.forEach((monthName,m)=>{

const monthCell =
document.createElement("div");

monthCell.className =
"month-name";

monthCell.textContent =
monthName;

calendar.appendChild(monthCell);

const totalDays =
daysInMonth(m,year);

for(let d=1; d<=31; d++){

const cell =
document.createElement("div");

cell.className="cell";

if(d>totalDays){

cell.classList.add("invalid");

calendar.appendChild(cell);

continue;

}

const num =
document.createElement("div");

num.className =
"day-number";

num.textContent=d;

cell.appendChild(num);

const dayEvents =
events.filter(ev=>

ev.year === year &&

ev.month === m &&

ev.dayStart === d

);

dayEvents.forEach(ev=>{
if(!monthRows[m]){
    monthRows[m] = [];
}

let row = 0;

while(
    monthRows[m][row] !== undefined &&
    ev.dayStart <= monthRows[m][row]
){
    row++;
}

monthRows[m][row] = ev.dayEnd;
const post =
document.createElement("div");

post.className =
"range-event " + ev.color;

const daysSpan =
(ev.dayEnd - ev.dayStart + 1);

post.style.width =
`calc(${daysSpan * 100}% - 4px)`;

post.style.top =
`${18 + (row * 32)}px`;
post.innerHTML =
`
${ev.icon || ""}

${ev.title}

${getEventStatus(ev)}
`;

post.title =
`
${ev.title}

${ev.description || ""}

Del ${ev.dayStart}
al ${ev.dayEnd}
`;

post.onclick=()=>{

showEvent(ev);

};

cell.appendChild(post);

});

calendar.appendChild(cell);

}

});

}

function getEventStatus(ev){

if(ev.cumplido){
return "✅ Cumplido";
}

const today = new Date();

today.setHours(0,0,0,0);

const eventDate = new Date(
ev.year,
ev.month,
ev.dayEnd
);

eventDate.setHours(0,0,0,0);

if(eventDate < today){

return "❌ No Cumplido";

}

return "⏳ Pendiente";

}



function exportData(){

const data={

year:
yearInput.value,

events

};

const blob=
new Blob(

[
JSON.stringify(
data,
null,
2
)
],

{
type:
"application/json"
}

);

const a=
document.createElement(
"a"
);

a.href=
URL.createObjectURL(
blob
);

a.download=
"calendario.json";

a.click();

}

document
.getElementById(
"importFile"
)
.addEventListener(
"change",
e=>{

const file=
e.target.files[0];

if(!file)
return;

const reader=
new FileReader();

reader.onload=
function(){

const data=
JSON.parse(
reader.result
);

yearInput.value=
data.year;

events=
data.events || [];

localStorage.setItem(
"calendarYear",
data.year
);

saveEvents();

};

reader.readAsText(file);

}
);

function showEvent(ev){

currentEventId = ev.id;

document.getElementById(
"eventInfo"
).innerHTML =

`
<div class="event-icon">
${ev.icon || "📌"}
</div>

<div class="event-title">
${ev.title}
</div>

<div class="event-date">

📅 Del ${ev.dayStart}
al ${ev.dayEnd}

</div>

<div style="
margin-bottom:15px;
font-weight:bold;
">

${getEventStatus(ev)}

</div>

<div class="event-desc">

${ev.description || "Sin descripción"}

</div>
`;

document.getElementById(
"eventModal"
).style.display="flex";

}


document
.getElementById(
"editEventBtn"
)
.addEventListener(
"click",
()=>{

const ev =
events.find(
x=>x.id===currentEventId
);

if(!ev)
return;

title.value =
ev.title;

month.value =
ev.month;

dayStart.value =
ev.dayStart;

dayEnd.value =
ev.dayEnd;

description.value =
ev.description;

color.value =
ev.color;

icon.value =
ev.icon;

events =
events.filter(
x=>x.id!==ev.id
);

document.getElementById(
"eventModal"
).style.display="none";

document.getElementById(
"modalTitle"
).textContent =
"Editar Evento";

addEvent();

addEvent();

});


document
.getElementById(
"deleteEventBtn"
)
.addEventListener(
"click",
()=>{

if(currentEventId == null){
return;
}

events =
events.filter(
x=>x.id!==currentEventId
);

localStorage.setItem(
"events",
JSON.stringify(events)
);

document.getElementById(
"eventModal"
).style.display="none";

currentEventId = null;

renderCalendar();
updateDashboard();
});




document
.getElementById(
"doneEventBtn"
)
.addEventListener(
"click",
()=>{

const ev =
events.find(
x=>x.id===currentEventId
);

if(!ev)
return;

ev.cumplido = true;

localStorage.setItem(
"events",
JSON.stringify(events)
);

renderCalendar();

document.getElementById(
"eventModal"
).style.display="none";

}
);

function updateDayLimits(){

const year =
parseInt(yearInput.value);

const selectedMonth =
parseInt(month.value);

const maxDays =
daysInMonth(
selectedMonth,
year
);

dayStart.max =
maxDays;

dayEnd.max =
maxDays;

if(
parseInt(dayStart.value) > maxDays
){
dayStart.value =
maxDays;
}

if(
parseInt(dayEnd.value) > maxDays
){
dayEnd.value =
maxDays;
}

}

function closeEventModal(){

document.getElementById(
"eventModal"
).style.display="none";

}


function updateDashboard(){

const completed =
events.filter(
e => e.cumplido === true
).length;

const pending =
events.filter(
e => getEventStatus(e).includes("Pendiente")
).length;

const failed =
events.filter(
e => getEventStatus(e).includes("No Cumplido")
).length;

document.getElementById(
"completedCount"
).textContent = completed;

document.getElementById(
"pendingCount"
).textContent = pending;

document.getElementById(
"failedCount"
).textContent = failed;

document.getElementById(
"notificationCount"
).textContent = events.length;

}

function openNotifications(){

const list =
document.getElementById(
"notificationList"
);

list.innerHTML="";

const sorted =
[...events].sort(
(a,b)=>{

const da =
new Date(
a.year,
a.month,
a.dayStart
);

const db =
new Date(
b.year,
b.month,
b.dayStart
);

return da-db;

}
);

sorted.forEach(ev=>{

list.innerHTML +=
`
<div class="notification-item">

<strong>
${ev.icon || "📌"}
${ev.title}
</strong>

<br>

📅
${ev.dayStart}/
${ev.month+1}/
${ev.year}

<br>

${getEventStatus(ev)}

</div>
`;

});

document.getElementById(
"notificationModal"
).style.display =
"flex";

}

function closeNotifications(){

document.getElementById(
"notificationModal"
).style.display =
"none";

}
renderCalendar();
updateDashboard();
