let currentEventId = null;
let evidenceData = null;
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

if(hasOtherUncompletedEvents()){

alert(
"⚠️ Tienes eventos NO CUMPLIDOS. Debes resolverlos antes de crear nuevos eventos."
);

return;

}

document.getElementById(
"modalTitle"
).textContent =
"Nuevo Evento";
evidenceData = null;

document.getElementById(
"evidenceFile"
).value = ""; 

document.getElementById(
"evidencePreview"
).innerHTML =
`

<div class="no-evidence">

Sin evidencia adjunta

</div>
`;

document.getElementById(
"downloadEvidenceBtn"
).style.display =
"none";

document.getElementById(
"removeEvidenceBtn"
).style.display =
"none";

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

month:+month.value,

dayStart:start,

dayEnd:end,

description:description.value,

icon:icon.value,

color:color.value,

evidence:evidenceData,

cumplido:
evidenceData
? true
: false

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

${
ev.evidence
?

`

<div class="event-evidence">

<h4>
📎 Evidencia
</h4>

${
ev.evidence.type.includes("image")

?

`<img
src="${ev.evidence.data}"
class="event-evidence-image">`

:

`

<div class="event-evidence-file">

📄 ${ev.evidence.name}

</div>
`
}

<a
href="${ev.evidence.data}"
download="${ev.evidence.name}"
class="download-btn">

⬇️ Descargar evidencia

</a>

</div>
`

:

`

<div class="event-evidence-empty">

📎 Sin evidencia adjunta

</div>
`
}

`;


/*const doneBtn =
document.getElementById(
"doneEventBtn"
);

if(ev.cumplido){

doneBtn.style.display =
"none";

}else{

doneBtn.style.display =
"inline-flex";

}*/

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

const currentEvent =
events.find(
x=>x.id===currentEventId
);

const hasOtherUncompleted =
events.some(ev=>

ev.id !== currentEventId &&

getEventStatus(ev)
.includes("No Cumplido")

);

if(hasOtherUncompleted){

alert(
"⚠️ No puedes editar este evento mientras existan otros eventos NO CUMPLIDOS."
);

return;

}

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

/* ===== EVIDENCIA ===== */

evidenceData =
ev.evidence || null;

if(evidenceData){

showEvidencePreview(
evidenceData
);

}else{

document.getElementById(
"evidencePreview"
).innerHTML =
`

<div class="no-evidence">

Sin evidencia adjunta

</div>
`;

document.getElementById(
"downloadEvidenceBtn"
).style.display =
"none";

document.getElementById(
"removeEvidenceBtn"
).style.display =
"none";

}


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

}
);



document
.getElementById(
"deleteEventBtn"
)
.addEventListener(
"click",
()=>{

const ev =
events.find(
x=>x.id===currentEventId
);

if(!ev){

alert(
"No se encontró el evento."
);

return;

}

const currentIsUncompleted =

getEventStatus(ev)
.includes("No Cumplido");

if(

hasUncompletedEvents() &&

!currentIsUncompleted

){

alert(
"⚠️ Existe al menos un evento NO CUMPLIDO. Debes resolverlo antes de eliminar otros eventos."
);

return;

}

if(
!confirm(
`¿Eliminar "${ev.title}"?`
)
){
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
).style.display =
"none";

currentEventId = null;

renderCalendar();

updateDashboard();

});




/*
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


);*/

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

function hasOtherUncompletedEvents(
currentId
){

return events.some(ev=>{

return (

ev.id !== currentId &&

getEventStatus(ev)
.includes("No Cumplido")

);

});

}

function hasUncompletedEvents(){

return events.some(ev=>{

return getEventStatus(ev)
.includes("No Cumplido");

});

}


document
.getElementById(
"evidenceFile"
)
.addEventListener(
"change",
e=>{

const file =
e.target.files[0];

if(!file)
return;

const reader =
new FileReader();

reader.onload =
function(ev){

evidenceData = {

name:file.name,

type:file.type,

data:ev.target.result

};

showEvidencePreview(
evidenceData
);

};

reader.readAsDataURL(
file
);

}
);

function showEvidencePreview(
evidence
){

const preview =
document.getElementById(
"evidencePreview"
);

const downloadBtn =
document.getElementById(
"downloadEvidenceBtn"
);

const removeBtn =
document.getElementById(
"removeEvidenceBtn"
);

if(
evidence.type.includes(
"image"
)
){

preview.innerHTML =
`<img src="${evidence.data}">`;

}else{

preview.innerHTML =
`

<div class="pdf-preview">

<span>📄</span>

<div>
${evidence.name}
</div>

</div>
`;

}

downloadBtn.href =
evidence.data;

downloadBtn.download =
evidence.name;

downloadBtn.style.display =
"inline-block";

removeBtn.style.display =
"inline-block";

}

document
.getElementById(
"removeEvidenceBtn"
)
.addEventListener(
"click",
()=>{

evidenceData = null;

document.getElementById(
"evidenceFile"
).value = "";

document.getElementById(
"evidencePreview"
).innerHTML =
`

<div class="no-evidence">

Sin evidencia adjunta

</div>
`;

document.getElementById(
"downloadEvidenceBtn"
).style.display =
"none";

document.getElementById(
"removeEvidenceBtn"
).style.display =
"none";

}
);


var maxDaysInput;

document
.getElementById("month")
.addEventListener(
"change",
function(){

const mes =
parseInt(this.value);

const anio =
parseInt(yearInput.value);

const ultimoDia =
new Date(
anio,
mes + 1,
0
).getDate();

dayStart.max =
ultimoDia;

dayEnd.max =
ultimoDia;

}
);

dayStart.addEventListener(
"input",
function(){

const max =
parseInt(this.max);

if(
parseInt(this.value) > max
){

this.value = max;

}

}
);

dayEnd.addEventListener(
"input",
function(){

const max =
parseInt(this.max);

if(
parseInt(this.value) > max
){

this.value = max;

}

}
);

renderCalendar();
updateDashboard();