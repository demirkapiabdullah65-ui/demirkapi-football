const bodyweightExercises = [
  {name:"Squat",icon:"🦵",sets:4,reps:"15 tekrar",muscle:"Bacak • Kalça"},
  {name:"Şınav",icon:"💪",sets:4,reps:"10 tekrar",muscle:"Göğüs • Kol"},
  {name:"Lunge",icon:"🦵",sets:3,reps:"12 tekrar",muscle:"Bacak"},
  {name:"Plank",icon:"🔥",sets:3,reps:"30 saniye",muscle:"Karın"},
  {name:"Mountain Climber",icon:"🏃",sets:3,reps:"20 tekrar",muscle:"Karın • Kardiyo"},
  {name:"Mekik",icon:"🔥",sets:3,reps:"15 tekrar",muscle:"Karın"}
];

const equipmentExercises = [
  {name:"Dambıl Goblet Squat",icon:"🏋️",sets:4,reps:"12 tekrar",muscle:"Bacak"},
  {name:"Dambıl Bench Press",icon:"🏋️",sets:4,reps:"10 tekrar",muscle:"Göğüs"},
  {name:"Dambıl Row",icon:"💪",sets:4,reps:"12 tekrar",muscle:"Sırt"},
  {name:"Dambıl Shoulder Press",icon:"🏋️",sets:3,reps:"12 tekrar",muscle:"Omuz"},
  {name:"Dambıl Curl",icon:"💪",sets:3,reps:"12 tekrar",muscle:"Biceps"},
  {name:"Dambıl Triceps",icon:"💪",sets:3,reps:"12 tekrar",muscle:"Triceps"}
];

let program = localStorage.getItem("demirkapi_program") || "bodyweight";
let completed = [];
let timerSeconds = 0;
let timerInterval = null;
let restSeconds = 60;
let restInterval = null;

let stats = JSON.parse(localStorage.getItem("demirkapi_stats") || "{}");

stats.streak = stats.streak || 0;
stats.workouts = stats.workouts || 0;
stats.exercises = stats.exercises || 0;
stats.minutes = stats.minutes || 0;

let profile = JSON.parse(localStorage.getItem("demirkapi_profile") || "{}");
let weightHistory = JSON.parse(localStorage.getItem("demirkapi_weights") || "[]");
let water = Number(localStorage.getItem("demirkapi_water") || 0);

function saveStats(){
  localStorage.setItem("demirkapi_stats",JSON.stringify(stats));
}

function showPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));

  const target=document.getElementById(page);

  if(target) target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(n=>{
    n.classList.toggle("active",n.dataset.page===page);
  });

  window.scrollTo({top:0,behavior:"smooth"});

  if(page==="home") updateHome();
  if(page==="programs") renderWeeklyPlan();
  if(page==="workout") renderWorkout();
  if(page==="weight") renderWeight();
  if(page==="water") updateWater();
  if(page==="stats") updateStats();
  if(page==="profile") loadProfile();
}

function updateHome(){
  document.getElementById("homeStreak").textContent=stats.streak;
  document.getElementById("homeWater").textContent=water+" ml";

  const current=profile.weight || weightHistory[weightHistory.length-1]?.weight;

  document.getElementById("homeWeight").textContent=
    current ? current+" kg" : "-- kg";

  let progress=0;

  if(profile.targetWeight && current){
    const start=Number(profile.startWeight || current);
    const target=Number(profile.targetWeight);

    if(start!==target){
      progress=Math.min(100,
        Math.max(0,
          Math.round(Math.abs(start-current)/Math.abs(start-target)*100)
        )
      );
    }
  }

  document.getElementById("homeProgress").textContent="%"+progress;

  const motivation=[
    "Bahane değil, tekrar.",
    "Bugün dünden daha güçlüsün.",
    "Küçük adımlar büyük değişimler oluşturur.",
    "Disiplin motivasyondan güçlüdür.",
    "Antrenmanı tamamla, hedefe yaklaş."
  ];

  document.getElementById("motivationText").textContent=
    motivation[new Date().getDate()%motivation.length];
}

function setProgram(type){
  program=type;
  localStorage.setItem("demirkapi_program",program);

  document.getElementById("bodyweightBtn").classList.toggle(
    "selected",type==="bodyweight"
  );

  document.getElementById("equipmentBtn").classList.toggle(
    "selected",type==="equipment"
  );

  renderWorkout();
}

function getExercises(){
  return program==="equipment"
    ? equipmentExercises
    : bodyweightExercises;
}

function renderWorkout(){
  const list=document.getElementById("exerciseList");
  if(!list) return;

  const exercises=getExercises();

  if(completed.length!==exercises.length){
    completed=Array(exercises.length).fill(false);
  }

  list.innerHTML="";

  exercises.forEach((ex,index)=>{
    const div=document.createElement("div");

    div.className="exercise"+(completed[index]?" done":"");

    div.innerHTML=`
      <div class="exercise-icon">${ex.icon}</div>

      <div class="exercise-info">
        <b>${ex.name}</b>
        <small>${ex.sets} set • ${ex.reps} • ${ex.muscle}</small>
      </div>

      <button class="exercise-check"
        onclick="toggleExercise(${index})">
        ${completed[index]?"✓":"○"}
      </button>
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
    `${done} / ${total}`;

  document.getElementById("workoutProgress").style.width=
    ((done/total)*100)+"%";
}

function startTimer(){
  if(timerInterval) return;

  timerInterval=setInterval(()=>{
    timerSeconds++;

    const min=String(Math.floor(timerSeconds/60)).padStart(2,"0");
    const sec=String(timerSeconds%60).padStart(2,"0");

    document.getElementById("timer").textContent=`${min}:${sec}`;
  },1000);
}

function pauseTimer(){
  clearInterval(timerInterval);
  timerInterval=null;
}

function resetTimer(){
  pauseTimer();
  timerSeconds=0;
  document.getElementById("timer").textContent="00:00";
}

function startRest(){
  clearInterval(restInterval);
  restSeconds=60;
  document.getElementById("restTimer").textContent=restSeconds;

  restInterval=setInterval(()=>{
    restSeconds--;

    document.getElementById("restTimer").textContent=
      Math.max(restSeconds,0);

    if(restSeconds<=0){
      clearInterval(restInterval);

      if(navigator.vibrate) navigator.vibrate([300,150,300]);
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

  alert("Antrenman tamamlandı! 🔥\nBugün kendin için bir adım attın.");

  completed=[];
  resetTimer();

  showPage("home");
}

function renderWeeklyPlan(){
  const box=document.getElementById("weeklyPlan");
  if(!box) return;

  const days=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
  const today=new Date().getDay();
  const index=today===0?6:today-1;

  box.innerHTML=days.map((day,i)=>`
    <div class="day ${i===index?"today":""}">
      <b>${day}</b>
      <small>${i===index?"BUGÜN":"Antrenman"}</small>
    </div>
  `).join("");

  document.getElementById("bodyweightBtn")
    .classList.toggle("selected",program==="bodyweight");

  document.getElementById("equipmentBtn")
    .classList.toggle("selected",program==="equipment");
}

function openBodyPart(part){
  alert(
    `${part} programı hazırlanıyor 💪\n\n`+
    "Bu bölge için özel hareket listesi ve program sistemi ekleyeceğiz."
  );
}

function saveWeight(){
  const input=document.getElementById("weightInput");
  const value=Number(input.value);

  if(!value || value<=0){
    alert("Geçerli bir kilo gir.");
    return;
  }

  const item={
    weight:value,
    date:new Date().toLocaleDateString("tr-TR")
  };

  weightHistory.push(item);

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

  input.value="";
  renderWeight();
  updateHome();
}

function renderWeight(){
  const current=
    profile.weight ||
    weightHistory[weightHistory.length-1]?.weight;

  document.getElementById("startWeight").textContent=
    profile.startWeight ? profile.startWeight+" kg" : "--";

  document.getElementById("currentWeight").textContent=
    current ? current+" kg" : "--";

  document.getElementById("targetWeight").textContent=
    profile.targetWeight ? profile.targetWeight+" kg" : "--";

  const box=document.getElementById("weightHistory");

  box.innerHTML=weightHistory.slice().reverse().map(x=>`
    <div class="history-item">
      <div>
        <b>${x.weight} kg</b>
      </div>
      <small>${x.date}</small>
    </div>
  `).join("");
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
  document.getElementById("waterProgress").style.width=percent+"%";
  document.getElementById("waterPercent").textContent=
    "%"+percent+" tamamlandı";
}

function updateStats(){
  document.getElementById("statStreak").textContent=stats.streak;
  document.getElementById("statWorkouts").textContent=stats.workouts;
  document.getElementById("statExercises").textContent=stats.exercises;
  document.getElementById("statMinutes").textContent=stats.minutes;

  const chart=document.getElementById("weekChart");

  const values=[0,0,0,0,0,0,stats.workouts>0?1:0];
  const days=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];

  chart.innerHTML=days.map((day,i)=>`
    <div class="chart-column">
      <div class="chart-bar" style="height:${values[i]?70:10}%"></div>
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

  if(!profile.startWeight && profile.weight){
    profile.startWeight=profile.weight;
  }

  localStorage.setItem(
    "demirkapi_profile",
    JSON.stringify(profile)
  );

  updateBMI();
  updateHome();

  alert("Profil kaydedildi ✅");
}

function loadProfile(){
  document.getElementById("profileName").value=profile.name||"";
  document.getElementById("profileAge").value=profile.age||"";
  document.getElementById("profileHeight").value=profile.height||"";
  document.getElementById("profileWeight").value=profile.weight||"";
  document.getElementById("profileGoal").value=profile.goal||"kas";
  document.getElementById("profileLevel").value=profile.level||"beginner";

  document.getElementById("profileNameDisplay").textContent=
    profile.name || "Sporcu";

  updateBMI();
}

function updateBMI(){
  const h=Number(profile.height);
  const w=Number(profile.weight);
  const card=document.getElementById("bmiCard");

  if(!h || !w){
    card.innerHTML="<b>BMI</b><p>Boy ve kilo bilgilerini girerek hesaplayabilirsin.</p>";
    return;
  }

  const bmi=w/Math.pow(h/100,2);

  let text="Genel değer";

  if(bmi<18.5) text="Düşük aralık";
  else if(bmi<25) text="Normal aralık";
  else if(bmi<30) text="Yüksek aralık";
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
      ?"dark":"light"
  );
}

function resetApp(){
  const ok=confirm(
    "Tüm Demirkapı Fit verileri silinsin mi?"
  );

  if(!ok) return;

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
  renderWeight();
  updateWater();
  updateStats();
  updateHome();
});
