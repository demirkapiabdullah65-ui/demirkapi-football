/* DEMİRKAPI FIT
   Tamamen tarayıcı üzerinde çalışır.
   Veriler localStorage ile telefonda saklanır.
*/

const bodyData = {

"Göğüs":{
emoji:"🏋️",
moves:[
["Şınav","💪",4,"10-15",60,"Göğüs • Triceps","Yüzüstü pozisyonda ellerini omuz genişliğinde aç. Göğsünü kontrollü şekilde aşağı indir ve tekrar yukarı it."],
["Diz Üstü Şınav","💪",3,"12",45,"Göğüs • Triceps","Dizlerini yere koy. Vücudunu düz tutarak göğsünü aşağı indir ve tekrar yukarı çık."],
["Geniş Şınav","💪",3,"10",60,"Göğüs","Ellerini omuz genişliğinden daha açık tutarak kontrollü şekilde şınav yap."],
["Dar Şınav","💪",3,"10",60,"Göğüs • Triceps","Ellerini birbirine yakın tut. Dirseklerini vücuduna yakın tutarak hareketi yap."]
]
},

"Sırt":{
emoji:"🪽",
moves:[
["Dambıl Row","🏋️",4,"12",60,"Sırt • Biceps","Bir elinle destek al. Diğer elindeki dambılı gövdene doğru çek ve kontrollü şekilde indir."],
["Superman","🦸",3,"12",45,"Sırt • Bel","Yüzüstü uzan. Kollarını ve bacaklarını aynı anda hafifçe yukarı kaldır."],
["Ters Snow Angel","🪽",3,"12",45,"Sırt • Omuz","Yüzüstü uzanarak kollarını kontrollü şekilde yanlardan yukarı ve aşağı hareket ettir."]
]
},

"Kol":{
emoji:"💪",
moves:[
["Dambıl Curl","💪",4,"12",60,"Biceps","Dirseklerini sabit tut. Dambılları kontrollü şekilde omuzlarına doğru kaldır ve indir."],
["Hammer Curl","💪",3,"12",45,"Biceps","Avuç içlerin birbirine bakacak şekilde dambılları yukarı kaldır ve indir."],
["Triceps Extension","💪",3,"12",45,"Triceps","Dambılı başının arkasından kontrollü şekilde yukarı kaldır."],
["Bench Dip","💪",3,"10",60,"Triceps","Sağlam bir yüzeyden destek alarak dirseklerini bük ve gövdeni kontrollü şekilde indir."]
]
},

"Omuz":{
emoji:"🏋️",
moves:[
["Dambıl Shoulder Press","🏋️",4,"10",60,"Omuz","Dambılları omuz hizasından başının üzerine doğru kontrollü şekilde kaldır."],
["Lateral Raise","🏋️",3,"12",45,"Yan Omuz","Dambılları iki yana omuz hizasına kadar kaldır ve kontrollü şekilde indir."],
["Front Raise","🏋️",3,"12",45,"Ön Omuz","Dambılları önünden omuz hizasına kadar kontrollü şekilde kaldır."]
]
},

"Bacak":{
emoji:"🦵",
moves:[
["Squat","🦵",4,"15",60,"Bacak • Kalça","Ayaklarını omuz genişliğinde aç. Kalçanı geriye göndererek çömel ve tekrar ayağa kalk."],
["Lunge","🦵",3,"12",60,"Bacak • Kalça","Bir ayağını öne al. Dizlerini kontrollü şekilde büküp başlangıç pozisyonuna dön."],
["Glute Bridge","🦵",3,"15",45,"Kalça","Sırtüstü yat. Dizlerini bük ve kalçanı yukarı kaldırıp kontrollü şekilde indir."],
["Calf Raise","🦵",3,"20",30,"Baldır","Ayakta dur. Topuklarını yerden kaldır ve kontrollü şekilde tekrar indir."]
]
},

"Karın":{
emoji:"🔥",
moves:[
["Mekik","🔥",3,"15",45,"Karın","Sırtüstü yat. Karın kaslarını kullanarak gövdeni kontrollü şekilde kaldır ve indir."],
["Plank","🔥",3,"30 sn",45,"Karın","Dirseklerini omuzlarının altında tut. Vücudunu düz bir çizgide sabit tut."],
["Mountain Climber","🏃",3,"20",45,"Karın • Kardiyo","Şınav pozisyonunda dizlerini sırayla göğsüne doğru çek."],
["Bicycle Crunch","🔥",3,"16",45,"Karın","Sırtüstü yat. Karşı dirsek ve dizi kontrollü şekilde birbirine yaklaştır."]
]
}

};

const equipment=[
["Dambıl Goblet Squat","🏋️",4,"12",60,"Bacak"],
["Dambıl Bench Press","🏋️",4,"10",60,"Göğüs"],
["Dambıl Row","💪",4,"12",60,"Sırt"],
["Dambıl Shoulder Press","🏋️",3,"12",60,"Omuz"],
["Dambıl Curl","💪",3,"12",45,"Biceps"],
["Dambıl Triceps","💪",3,"12",45,"Triceps"]
];

const bodyweight=[
["Squat","🦵",4,"15",60,"Bacak"],
["Şınav","💪",4,"10",60,"Göğüs"],
["Lunge","🦵",3,"12",60,"Bacak"],
["Plank","🔥",3,"30 sn",45,"Karın"],
["Mountain Climber","🏃",3,"20",45,"Karın"],
["Mekik","🔥",3,"15",45,"Karın"]
];


let state=JSON.parse(localStorage.getItem("demirkapiFit")||"{}");

state.program=state.program||"bodyweight";
state.water=state.water||0;
state.workouts=state.workouts||0;
state.exercises=state.exercises||0;
state.minutes=state.minutes||0;
state.streak=state.streak||0;
state.profile=state.profile||{};


let selectedBody="";
let selectedMove=null;
let activeWorkout=[];
let completed=[];
let seconds=0;
let timerInterval=null;


function save(){

localStorage.setItem(
"demirkapiFit",
JSON.stringify(state)
);

}


function $(id){

return document.getElementById(id);

}


function showPage(id){

document.querySelectorAll(".page").forEach(page=>{
page.classList.remove("active");
});

const page=$(id);

if(page){
page.classList.add("active");
}

document.querySelectorAll(".nav").forEach(nav=>{
nav.classList.remove("active");
});

document.querySelectorAll(".nav").forEach(nav=>{
if(nav.dataset.page===id){
nav.classList.add("active");
}
});

window.scrollTo(0,0);

updateHome();

}


function openBodyPart(part){

selectedBody=part;

$("bodyTitle").textContent=part;
$("bodyBannerTitle").textContent=part;
$("bodyEmoji").textContent=bodyData[part].emoji;

const box=$("bodyExercises");

box.innerHTML="";

bodyData[part].moves.forEach((move,index)=>{

const button=document.createElement("button");

button.type="button";
button.className="bodyExercise";

button.innerHTML=`
<div class="exerciseIcon">${move[1]}</div>

<div class="exerciseInfo">
<b>${move[0]}</b>
<small>${move[2]} set • ${move[3]} tekrar • ${move[4]} sn dinlenme</small>
</div>

<div class="openArrow">›</div>
`;

button.addEventListener("click",function(){

openMove(part,index);

});

box.appendChild(button);

});

showPage("bodyPage");

}


function openMove(part,index){

selectedBody=part;
selectedMove=index;

const move=bodyData[part].moves[index];

$("detailIcon").textContent=move[1];
$("detailMuscle").textContent=move[5];
$("detailName").textContent=move[0];
$("detailSets").textContent=move[2];
$("detailReps").textContent=move[3];
$("detailRest").textContent=move[4];
$("detailDescription").textContent=move[6];

showPage("detailPage");

}


function startSelectedMove(){

const move=bodyData[selectedBody].moves[selectedMove];

activeWorkout=[[
move[0],
move[1],
move[2],
move[3],
move[4],
move[5]
]];

completed=[false];

$("workoutTitle").textContent=move[0];

seconds=0;
resetTimerDisplay();

renderWorkout();

showPage("workoutPage");

}


function startFullWorkout(){

activeWorkout=state.program==="equipment"
?equipment
:bodyweight;

completed=new Array(activeWorkout.length).fill(false);

$("workoutTitle").textContent=
state.program==="equipment"
?"Ekipmanlı Full Body"
:"Ekipmansız Full Body";

seconds=0;
resetTimerDisplay();

renderWorkout();

showPage("workoutPage");

}


function renderWorkout(){

const box=$("workoutExercises");

box.innerHTML="";

activeWorkout.forEach((move,index)=>{

const div=document.createElement("div");

div.className=
"workoutExercise "+
(completed[index]?"done":"");

div.innerHTML=`
<div class="exerciseIcon">${move[1]}</div>

<div class="workoutInfo">
<b>${move[0]}</b>
<small>${move[2]} set • ${move[3]} tekrar • ${move[5]}</small>
</div>

<button class="check" type="button">
${completed[index]?"✓":"○"}
</button>
`;

div.querySelector(".check").addEventListener("click",function(){

completed[index]=!completed[index];

if(completed[index]){
state.exercises++;
save();
}

renderWorkout();
updateProgress();

});

box.appendChild(div);

});

updateProgress();

}


function updateProgress(){

const total=activeWorkout.length;
const done=completed.filter(Boolean).length;

$("progressText").textContent=
done+" / "+total;

$("progressBar").style.width=
(total?done/total*100:0)+"%";

}


function startTimer(){

if(timerInterval)return;

timerInterval=setInterval(()=>{

seconds++;

resetTimerDisplay();

},1000);

}


function pauseTimer(){

clearInterval(timerInterval);

timerInterval=null;

}


function resetTimer(){

pauseTimer();

seconds=0;

resetTimerDisplay();

}


function resetTimerDisplay(){

const m=String(Math.floor(seconds/60)).padStart(2,"0");
const s=String(seconds%60).padStart(2,"0");

$("timer").textContent=m+":"+s;

}


function finishWorkout(){

const done=completed.filter(Boolean).length;

if(done===0){

alert("Önce en az bir hareket tamamla 💪");
return;

}

pauseTimer();

state.workouts++;
state.streak++;
state.minutes+=Math.max(1,Math.round(seconds/60));

save();

alert("Antrenman tamamlandı! 🔥");

startHome();

}


function addWater(amount){

state.water=Math.min(
2500,
Number(state.water)+amount
);

save();

updateWater();
updateHome();

}


function undoWater(){

state.water=Math.max(
0,
Number(state.water)-250
);

save();

updateWater();
updateHome();

}


function updateWater(){

const amount=Number(state.water)||0;

const percent=Math.min(
100,
Math.round(amount/2500*100)
);

$("waterAmount").textContent=amount;

$("waterBar").style.width=percent+"%";

$("waterPercent").textContent=
"%"+percent+" tamamlandı";

}


function saveProfile(){

const name=$("profileName").value.trim();
const age=$("profileAge").value;
const height=$("profileHeight").value;
const weight=$("profileWeight").value;
const goal=$("profileGoal").value;
const level=$("profileLevel").value;

if(!name){

$("saveMessage").textContent=
"Lütfen adını yaz.";

return;

}

state.profile={
name,
age,
height,
weight,
goal,
level
};

save();

$("saveMessage").textContent=
"✓ Profil başarıyla kaydedildi";

updateHome();

setTimeout(()=>{

$("saveMessage").textContent="";

},3000);

}


function loadProfile(){

const p=state.profile||{};

$("profileName").value=p.name||"";
$("profileAge").value=p.age||"";
$("profileHeight").value=p.height||"";
$("profileWeight").value=p.weight||"";
$("profileGoal").value=p.goal||"kas";
$("profileLevel").value=p.level||"beginner";

}


function updateHome(){

$("streakHome").textContent=state.streak;
$("homeWater").textContent=(state.water||0)+" ml";
$("homeWeight").textContent=
state.profile.weight
?state.profile.weight+" kg"
:"-- kg";

$("homeWorkoutCount").textContent=state.workouts;

$("statStreak").textContent=state.streak;
$("statWorkouts").textContent=state.workouts;
$("statExercises").textContent=state.exercises;
$("statMinutes").textContent=state.minutes;

}


function selectProgram(type){

state.program=type;

save();

$("homeProgram").classList.toggle(
"selected",
type==="bodyweight"
);

$("equipmentProgram").classList.toggle(
"selected",
type==="equipment"
);

}


function renderWeekly(){

const box=$("weekly");

const days=[
"Pzt","Sal","Çar","Per",
"Cum","Cmt","Paz"
];

const today=new Date().getDay();
const todayIndex=today===0?6:today-1;

box.innerHTML=`
<div class="dayGrid">
${days.map((day,i)=>`
<div class="day ${i===todayIndex?"today":""}">
<b>${day}</b>
<small>${i===todayIndex?"BUGÜN":"Plan"}</small>
</div>
`).join("")}
</div>
`;

}


function toggleTheme(){

document.body.classList.toggle("dark");

localStorage.setItem(
"demirkapiTheme",
document.body.classList.contains("dark")
?"dark"
:"light"
);

}


function resetApp(){

const answer=confirm(
"Tüm Demirkapı Fit verileri silinsin mi?"
);

if(!answer)return;

localStorage.removeItem("demirkapiFit");

location.reload();

}


function startHome(){

showPage("home");

}


function connectEvents(){

/* ANA SAYFA */

$("startHomeWorkout").addEventListener(
"click",
startFullWorkout
);


/* BÖLGE BUTONLARI */

document.querySelectorAll(".bodyBtn").forEach(button=>{

button.addEventListener("click",function(){

const part=this.dataset.body;

openBodyPart(part);

});

});


/* GERİ */

$("bodyBack").addEventListener(
"click",
startHome
);

$("detailBack").addEventListener(
"click",
()=>showPage("bodyPage")
);

$("workoutBack").addEventListener(
"click",
startHome
);


/* HAREKET */

$("startDetailWorkout").addEventListener(
"click",
startSelectedMove
);


/* PROGRAM */

$("homeProgram").addEventListener(
"click",
()=>selectProgram("bodyweight")
);

$("equipmentProgram").addEventListener(
"click",
()=>selectProgram("equipment")
);

$("startProgramWorkout").addEventListener(
"click",
startFullWorkout
);


/* ANTRENMAN */

$("timerStart").addEventListener(
"click",
startTimer
);

$("timerPause").addEventListener(
"click",
pauseTimer
);

$("timerReset").addEventListener(
"click",
resetTimer
);

$("finishWorkout").addEventListener(
"click",
finishWorkout
);


/* SU */

$("water250").addEventListener(
"click",
()=>addWater(250)
);

$("water500").addEventListener(
"click",
()=>addWater(500)
);

$("waterUndo").addEventListener(
"click",
undoWater
);


/* PROFİL */

$("saveProfile").addEventListener(
"click",
saveProfile
);


/* AYARLAR */

$("settingsBtn").addEventListener(
"click",
()=>showPage("settingsPage")
);

$("themeBtn").addEventListener(
"click",
toggleTheme
);

$("profileSettingsBtn").addEventListener(
"click",
()=>showPage("profilePage")
);

$("resetBtn").addEventListener(
"click",
resetApp
);


/* ALT MENÜ */

document.querySelectorAll(".nav").forEach(nav=>{

nav.addEventListener("click",function(){

if(this.id==="navWorkout"){

startFullWorkout();
return;

}

const page=this.dataset.page;

if(page){
showPage(page);
}

});

});

}


function init(){

if(localStorage.getItem("demirkapiTheme")==="dark"){
document.body.classList.add("dark");
}

loadProfile();

selectProgram(state.program);

updateWater();

updateHome();

renderWeekly();

connectEvents();

}


document.addEventListener(
"DOMContentLoaded",
init
);
