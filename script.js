const exercises={
  "Göğüs":[
    ["Şınav","💪","4","10","60","Göğüs • Triceps","Yüzüstü pozisyonda ellerini omuz genişliğinde aç. Göğsünü kontrollü şekilde yere yaklaştır ve tekrar yukarı it."],
    ["Diz Üstü Şınav","💪","3","12","45","Göğüs • Kol","Dizlerini yere koy. Vücudunu düz tutarak göğsünü aşağı indir ve tekrar yukarı it."],
    ["Geniş Şınav","💪","3","10","60","Göğüs","Ellerini omuzlardan daha geniş aç. Göğsünü kontrollü şekilde aşağı indir ve yukarı çık."],
    ["Dar Şınav","💪","3","10","60","Göğüs • Triceps","Ellerini birbirine daha yakın konumlandır. Dirseklerini vücuduna yakın tutarak şınav yap."]
  ],

  "Sırt":[
    ["Dambıl Row","🏋️","4","12","60","Sırt • Biceps","Bir elini destekleyerek diğer elindeki dambılı gövdene doğru çek."],
    ["Superman","🦸","3","12","45","Bel • Sırt","Yüzüstü uzan. Kollarını ve bacaklarını aynı anda hafifçe yukarı kaldır."],
    ["Ters Snow Angel","🪽","3","12","45","Sırt • Omuz","Yüzüstü uzanarak kollarını kontrollü biçimde yanlardan yukarı ve aşağı hareket ettir."]
  ],

  "Kol":[
    ["Dambıl Curl","💪","4","12","60","Biceps","Dirseklerini sabit tut. Dambılları kontrollü şekilde omuzlarına doğru kaldır ve indir."],
    ["Hammer Curl","💪","3","12","45","Biceps","Avuç içlerin birbirine bakacak şekilde dambılları yukarı kaldır."],
    ["Triceps Extension","💪","3","12","45","Triceps","Dambılı başının arkasından kontrollü şekilde yukarı kaldır ve indir."],
    ["Bench Dip","💪","3","10","60","Triceps","Sağlam bir yüzeyin kenarından destek alarak dirseklerini büküp gövdeni aşağı indir."]
  ],

  "Omuz":[
    ["Dambıl Shoulder Press","🏋️","4","10","60","Omuz","Dambılları omuz hizasından kontrollü şekilde başının üzerine doğru kaldır."],
    ["Lateral Raise","🏋️","3","12","45","Yan Omuz","Kollarını hafif bükülü tutarak dambılları iki yana omuz hizasına kadar kaldır."],
    ["Front Raise","🏋️","3","12","45","Ön Omuz","Dambılı kontrollü şekilde önünden omuz hizasına kadar kaldır."]
  ],

  "Bacak":[
    ["Squat","🦵","4","15","60","Bacak • Kalça","Ayaklarını omuz genişliğinde aç. Kalçanı geriye göndererek çömel ve tekrar ayağa kalk."],
    ["Lunge","🦵","3","12","60","Bacak • Kalça","Bir ayağını öne al. İki dizini kontrollü şekilde büküp başlangıç pozisyonuna dön."],
    ["Glute Bridge","🦵","3","15","45","Kalça","Sırtüstü yat. Dizlerini bük ve kalçanı yukarı kaldırıp kontrollü şekilde indir."],
    ["Calf Raise","🦵","3","20","30","Baldır","Ayakta dur. Topuklarını yerden kaldırıp kontrollü şekilde tekrar indir."]
  ],

  "Karın":[
    ["Mekik","🔥","3","15","45","Karın","Sırtüstü yat. Karın kaslarını kullanarak gövdeni kontrollü şekilde kaldır ve indir."],
    ["Plank","🔥","3","30","45","Karın","Dirseklerini omuzlarının altında tut. Vücudunu düz bir çizgide sabit tut."],
    ["Mountain Climber","🏃","3","20","45","Karın • Kardiyo","Şınav pozisyonunda dizlerini sırayla göğsüne doğru çek."],
    ["Bicycle Crunch","🔥","3","16","45","Karın","Sırtüstü yat. Karşı dirsek ve dizi kontrollü şekilde birbirine yaklaştır."]
  ]
};

const bodyIcons={
  "Göğüs":"🏋️",
  "Sırt":"🪽",
  "Kol":"💪",
  "Omuz":"🏋️",
  "Bacak":"🦵",
  "Karın":"🔥"
};

const bodyweightExercises=[
  ["Squat","🦵",4,"15","60","Bacak • Kalça"],
  ["Şınav","💪",4,"10","60","Göğüs • Triceps"],
  ["Lunge","🦵",3,"12","60","Bacak"],
  ["Plank","🔥",3,"30","45","Karın"],
  ["Mountain Climber","🏃",3,"20","45","Karın • Kardiyo"],
  ["Mekik","🔥",3,"15","45","Karın"]
];

const equipmentExercises=[
  ["Dambıl Goblet Squat","🏋️",4,"12","60","Bacak"],
  ["Dambıl Bench Press","🏋️",4,"10","60","Göğüs"],
  ["Dambıl Row","💪",4,"12","60","Sırt"],
  ["Dambıl Shoulder Press","🏋️",3,"12","60","Omuz"],
  ["Dambıl Curl","💪",3,"12","45","Biceps"],
  ["Dambıl Triceps","💪",3,"12","45","Triceps"]
];

let program=localStorage.getItem("demirkapi_program")||"bodyweight";
let completed=[];
let timerSeconds=0;
let timerInterval=null;
let restSeconds=60;
let restInterval=null;
let selectedBodyPart="";
let selectedExercise=null;

let stats=JSON.parse(localStorage.getItem("demirkapi_stats")||"{}");

stats.streak=stats.streak||0;
stats.workouts=stats.workouts||0;
stats.exercises=stats.exercises||0;
stats.minutes=stats.minutes||0;

let profile=JSON.parse(localStorage.getItem("demirkapi_profile")||"{}");
let weightHistory=JSON.parse(localStorage.getItem("demirkapi_weights")||"[]");
let water=Number(localStorage.getItem("demirkapi_water")||0);


function saveStats(){
localStorage.setItem("demirkapi_stats",JSON.stringify(stats));
}


function showPage(page){

document.querySelectorAll(".page").forEach(p=>{
p.classList.remove("active");
});

const target=document.getElementById(page);

if(target){
target.classList.add("active");
}

document.querySelectorAll(".nav-item").forEach(n=>{
n.classList.toggle("active",n.dataset.page===page);
});

window.scrollTo(0,0);

if(page==="home")updateHome();
if(page==="programs")renderWeeklyPlan();
if(page==="workout")renderWorkout();
if(page==="water")updateWater();
if(page==="stats")updateStats();
if(page==="profile")loadProfile();
}


function openBodyPart(part){

selectedBodyPart=part;

document.getElementById("bodyPartTitle").textContent=part;
document.getElementById("bodyPartSubtitle").textContent=part;
document.getElementById("bodyPartEmoji").textContent=bodyIcons[part];

const list=document.getElementById("bodyPartExercises");

list.innerHTML="";

const data=exercises[part]||[];

data.forEach((ex,index)=>{

const item=document.createElement("button");

item.type="button";
item.className="bodypart-exercise";

item.innerHTML=`
<div class="exercise-icon">${ex[1]}</div>

<div class="bodypart-exercise-info">
<b>${ex[0]}</b>
<small>${ex[2]} set • ${ex[3]} tekrar • ${ex[4]} sn dinlenme</small>
</div>

<div class="exercise-open">›</div>
`;

item.onclick=()=>openExerciseDetail(part,index);

list.appendChild(item);

});

showPage("bodypart");
}


function openExerciseDetail(part,index){

selectedBodyPart=part;
selectedExercise=index;

const ex=exercises[part][index];

document.getElementById("detailName").textContent=ex[0];
document.getElementById("detailTitle").textContent=ex[0];
document.getElementById("detailIcon").textContent=ex[1];
document.getElementById("detailMuscle").textContent=ex[5];
document.getElementById("detailSets").textContent=ex[2];
document.getElementById("detailReps").textContent=ex[3];
document.getElementById("detailRest").textContent=ex[4];
document.getElementById("detailInstruction").textContent=ex[6];

showPage("exerciseDetail");
}


function selectExerciseForWorkout(){

const ex=exercises[selectedBodyPart][selectedExercise];

alert(
ex[0]+" başlıyor! 💪\n\n"+
ex[2]+" set × "+ex[3]+" tekrar\n"+
"Setler arasında "+ex[4]+" saniye dinlen."
);

showPage("workout");
}


function startTodayWorkout(){

completed=[];
timerSeconds=0;

resetTimer();

showPage("workout");
}


function getExercises(){

return program==="equipment"
?equipmentExercises
:bodyweightExercises;

}


function renderWorkout(){

const list=document.getElementById("exerciseList");

if(!list)return;

const data=getExercises();

completed=Array(data.length).fill(false);

list.innerHTML="";

data.forEach((ex,index)=>{

const div=document.createElement("div");

div.className="exercise";

div.innerHTML=`
<div class="exercise-icon">${ex[1]}</div>

<div class="exercise-info">
<b>${ex[0]}</b>
<small>${ex[2]} set • ${ex[3]} tekrar • ${ex[5]}</small>
</div>

<button type="button" class="exercise-check"
onclick="toggleExercise(${index})">○</button>
`;

list.appendChild(div);

});

updateWorkoutProgress();
}


function toggleExercise(index){

completed[index]=!completed[index];

if(completed[index]){

stats.exercises++;
saveStats();

}

renderWorkout();
}


function updateWorkoutProgress(){

const total=getExercises().length;
const done=completed.filter(Boolean).length;

document.getElementById("workoutProgressText").textContent=
done+" / "+total;

document.getElementById("workoutProgress").style.width=
(done/total*100)+"%";

const buttons=document.querySelectorAll(".exercise-check");

buttons.forEach((button,index)=>{

if(completed[index]){

button.textContent="✓";
button.parentElement.classList.add("done");

}else{

button.textContent="○";
button.parentElement.classList.remove("done");

}

});

}


function startTimer(){

if(timerInterval)return;

timerInterval=setInterval(()=>{

timerSeconds++;

const min=String(Math.floor(timerSeconds/60)).padStart(2,"0");
const sec=String(timerSeconds%60).padStart(2,"0");

document.getElementById("timer").textContent=min+":"+sec;

},1000);

}


function pauseTimer(){

clearInterval(timerInterval);
timerInterval=null;

}


function resetTimer(){

pauseTimer();

timerSeconds=0;

const timer=document.getElementById("timer");

if(timer){
timer.textContent="00:00";
}

}


function startRest(){

clearInterval(restInterval);

restSeconds=60;

document.getElementById("restTimer").textContent=restSeconds;

restInterval=setInterval(()=>{

restSeconds--;

document.getElementById("restTimer").textContent=
Math.max(0,restSeconds);

if(restSeconds<=0){

clearInterval(restInterval);

if(navigator.vibrate){
navigator.vibrate([300,150,300]);
}

}

},1000);

}


function finishWorkout(){

const done=completed.filter(Boolean).length;

if(done===0){

alert("Önce en az bir hareket tamamla 💪");
return;

}

pauseTimer();

stats.workouts++;
stats.streak++;
stats.minutes+=Math.max(1,Math.round(timerSeconds/60));

saveStats();

alert("Antrenman tamamlandı! 🔥");

completed=[];

resetTimer();

showPage("home");

}


function setProgram(type){

program=type;

localStorage.setItem("demirkapi_program",program);

document.getElementById("bodyweightBtn")
.classList.toggle("selected",type==="bodyweight");

document.getElementById("equipmentBtn")
.classList.toggle("selected",type==="equipment");

renderWorkout();

}


function renderWeeklyPlan(){

const box=document.getElementById("weeklyPlan");

if(!box)return;

const days=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];

const today=new Date().getDay();
const todayIndex=today===0?6:today-1;

box.innerHTML=days.map((day,i)=>`

<div class="day ${i===todayIndex?"today":""}">
<b>${day}</b>
<small>${i===todayIndex?"BUGÜN":"Antrenman"}</small>
</div>

`).join("");

document.getElementById("bodyweightBtn")
.classList.toggle("selected",program==="bodyweight");

document.getElementById("equipmentBtn")
.classList.toggle("selected",program==="equipment");

}


function addWater(amount){

water=Math.min(2500,water+amount);

localStorage.setItem("demirkapi_water",water);

updateWater();
updateHome();

}


function undoWater(){

water=Math.max(0,water-250);

localStorage.setItem("demirkapi_water",water);

updateWater();
updateHome();

}


function updateWater(){

const percent=Math.min(100,Math.round(water/2500*100));

document.getElementById("waterAmount").textContent=water;

document.getElementById("waterProgress").style.width=
percent+"%";

document.getElementById("waterPercent").textContent=
"%"+percent+" tamamlandı";

}


function saveWeight(){

const value=Number(document.getElementById("weightInput")?.value);

if(!value){

alert("Geçerli bir kilo gir.");

return;

}

weightHistory.push({
weight:value,
date:new Date().toLocaleDateString("tr-TR")
});

localStorage.setItem(
"demirkapi_weights",
JSON.stringify(weightHistory)
);

profile.weight=value;

if(!profile.startWeight){
profile.startWeight=value;
}

localStorage.setItem(
"demirkapi_profile",
JSON.stringify(profile)
);

}


function updateHome(){

document.getElementById("homeStreak").textContent=stats.streak;

document.getElementById("homeWater").textContent=
water+" ml";

document.getElementById("homeWeight").textContent=
profile.weight
?profile.weight+" kg"
:"-- kg";

document.getElementById("homeProgress").textContent=
"%"+Math.min(100,stats.workouts*10);

const words=[
"Bahane değil, tekrar.",
"Bugün dünden daha güçlüsün.",
"Küçük adımlar büyük değişimler oluşturur.",
"Disiplin motivasyondan güçlüdür.",
"Antrenmanı tamamla, hedefe yaklaş."
];

document.getElementById("motivationText").textContent=
words[new Date().getDate()%words.length];

}


function updateStats(){

document.getElementById("statStreak").textContent=stats.streak;
document.getElementById("statWorkouts").textContent=stats.workouts;
document.getElementById("statExercises").textContent=stats.exercises;
document.getElementById("statMinutes").textContent=stats.minutes;

const chart=document.getElementById("weekChart");

const days=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];

chart.innerHTML=days.map((day,i)=>`

<div class="chart-column">
<div class="chart-bar" style="height:${i===6&&stats.workouts?70:10}%"></div>
<small>${day}</small>
</div>

`).join("");

}


function saveProfile(){

profile.name=document.getElementById("profileName").value;
profile.age=document.getElementById("profileAge").value;
profile.height=document.getElementById("profileHeight").value;
profile.weight=document.getElementById("profileWeight").value;
profile.goal=document.getElementById("profileGoal").value;
profile.level=document.getElementById("profileLevel").value;

if(!profile.startWeight&&profile.weight){
profile.startWeight=profile.weight;
}

localStorage.setItem(
"demirkapi_profile",
JSON.stringify(profile)
);

loadProfile();
updateHome();

alert("Profil kaydedildi ✅");

}


function loadProfile(){

if(!document.getElementById("profileName"))return;

document.getElementById("profileName").value=profile.name||"";
document.getElementById("profileAge").value=profile.age||"";
document.getElementById("profileHeight").value=profile.height||"";
document.getElementById("profileWeight").value=profile.weight||"";
document.getElementById("profileGoal").value=profile.goal||"kas";
document.getElementById("profileLevel").value=profile.level||"beginner";

document.getElementById("profileNameDisplay").textContent=
profile.name||"Sporcu";

updateBMI();

}


function updateBMI(){

const h=Number(profile.height);
const w=Number(profile.weight);

const card=document.getElementById("bmiCard");

if(!h||!w){

card.innerHTML=
"<b>BMI</b><p>Boy ve kilo bilgilerini girerek hesaplayabilirsin.</p>";

return;

}

const bmi=w/Math.pow(h/100,2);

let text="Genel değer";

if(bmi<18.5)text="Düşük aralık";
else if(bmi<25)text="Normal aralık";
else if(bmi<30)text="Yüksek aralık";
else text="Daha yüksek aralık";

card.innerHTML=`
<small>BMI</small>
<h2>${bmi.toFixed(1)}</h2>
<p>${text}</p>
`;

}


function toggleTheme(){

document.body.classList.toggle("dark");

localStorage.setItem(
"demirkapi_theme",
document.body.classList.contains("dark")
?"dark"
:"light"
);

}


function resetApp(){

if(!confirm("Tüm Demirkapı Fit verileri silinsin mi?"))return;

localStorage.clear();

location.reload();

}


function loadTheme(){

if(localStorage.getItem("demirkapi_theme")==="dark"){
document.body.classList.add("dark");
}

}


document.addEventListener("DOMContentLoaded",()=>{

loadTheme();
loadProfile();
renderWorkout();
renderWeeklyPlan();
updateWater();
updateStats();
updateHome();

});
