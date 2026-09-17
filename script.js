/* DEMİRKAPI FIT
   Tamamen tarayıcı içinde çalışır.
   Veriler localStorage ile telefonda saklanır.
*/

const STORAGE_KEY = "demirkapiFit_v1";

let state = {
  profile: {},
  measurements: {},
  water: 0,
  workouts: 0,
  minutes: 0,
  calories: 0,
  xp: 0,
  streak: 0,
  lastWorkout: "",
  dark: false
};

try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if(saved) state = {...state,...saved};
} catch(e){}

let buildOptions = {
  time: "10",
  level: "Başlangıç",
  equipment: "Ekipmansız"
};

let currentPart = "Göğüs";
let currentExercise = null;
let workoutExercises = [];
let workoutIndex = 0;
let timerSeconds = 30;
let timerInterval = null;
let timerRunning = false;


/* ---------------- VERİ ---------------- */

function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}


/* ---------------- SAYFA ---------------- */

function showPage(page){

  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });

  const target = document.getElementById(page);

  if(!target){
    console.log("Sayfa bulunamadı:",page);
    return;
  }

  target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(item=>{
    item.classList.remove("active");

    if(item.dataset.page === page){
      item.classList.add("active");
    }
  });

  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

  if(page === "home") updateHome();
  if(page === "stats") updateStats();
  if(page === "profile") loadProfile();
  if(page === "water") updateWater();
}


/* ---------------- EGZERSİZLER ---------------- */

const exercises = {

  "Göğüs":[
    ["Şınav","💪","Göğüs ve triceps","3","12","45","Vücudunu düz tut. Dirseklerini kontrollü şekilde bükerek aşağı in ve yukarı çık."],
    ["Diz Üstü Şınav","🧎","Başlangıç seviyesi","3","10","40","Dizlerini yere koy. Gövdeni düz tutarak kontrollü şınav çek."],
    ["Geniş Şınav","🔥","Göğüs dış kısmı","3","10","45","Ellerini omuz genişliğinden daha açık yerleştir ve kontrollü hareket et."],
    ["Dar Şınav","💪","Göğüs ve triceps","3","8","45","Ellerini birbirine daha yakın tutarak şınav hareketini yap."]
  ],

  "Sırt":[
    ["Superman","🦸","Bel ve sırt","3","12","40","Yüzüstü uzan. Kollarını ve bacaklarını aynı anda hafifçe kaldır."],
    ["Bird Dog","🐕","Core ve sırt","3","10","40","Dört ayak pozisyonunda karşı kol ve bacağını aynı anda uzat."],
    ["Yüzüstü Y T","🏋️","Üst sırt","3","12","40","Yüzüstü yat ve kollarını Y şeklinde kontrollü olarak kaldır."],
    ["Reverse Snow Angel","❄️","Sırt","3","10","45","Yüzüstü pozisyonda kollarını kontrollü şekilde yanlardan yukarı doğru hareket ettir."]
  ],

  "Kollar":[
    ["Diamond Şınav","💎","Triceps","3","8","45","Ellerini göğsünün altında birbirine yaklaştırarak şınav yap."],
    ["Sandalye Triceps Dip","🪑","Triceps","3","10","45","Sağlam bir sandalyenin kenarından destek alarak kontrollü şekilde aşağı in."],
    ["Biceps Curl","🏋️","Biceps","3","12","40","Dambıl varsa kullan. Dirseklerini sabit tutarak ağırlığı yukarı kaldır."],
    ["Hammer Curl","💪","Biceps","3","12","40","Dambılları avuçların birbirine bakacak şekilde tut ve kontrollü kaldır."]
  ],

  "Omuz":[
    ["Pike Push Up","🏔️","Omuz","3","8","45","Kalçanı yukarı kaldır ve başını zemine doğru kontrollü şekilde yaklaştır."],
    ["Lateral Raise","🏋️","Yan omuz","3","12","40","Dambılları iki yana doğru omuz hizasına kadar kaldır."],
    ["Front Raise","💪","Ön omuz","3","12","40","Ağırlığı kontrollü şekilde önden omuz hizasına kadar kaldır."],
    ["Shoulder Tap","👋","Omuz ve core","3","16","35","Şınav pozisyonunda karşı omzuna elinle dokun."]
  ],

  "Bacak":[
    ["Squat","🦵","Tüm bacak","3","15","45","Ayaklarını omuz genişliğinde aç. Kalçanı geriye göndererek kontrollü çömel."],
    ["Lunge","🏃","Bacak ve kalça","3","10","45","Bir ayağını öne at ve arka dizini kontrollü şekilde aşağı indir."],
    ["Glute Bridge","🍑","Kalça","3","15","40","Sırtüstü yat. Kalçanı yukarı kaldır ve üst noktada sık."],
    ["Calf Raise","🦶","Baldır","3","20","30","Ayakta dur. Topuklarını yukarı kaldır ve yavaşça indir."]
  ],

  "Karın":[
    ["Crunch","🔥","Üst karın","3","15","35","Sırtüstü yat. Karın kaslarını sıkarak omuzlarını kontrollü şekilde kaldır."],
    ["Leg Raise","🦵","Alt karın","3","10","40","Bacaklarını düz tut ve belini zorlamadan kontrollü kaldırıp indir."],
    ["Plank","🧱","Tüm core","3","30 sn","30","Dirseklerini yere koy. Vücudunu düz tut ve karın kaslarını sık."],
    ["Mountain Climber","🏃","Karın ve kondisyon","3","20","35","Şınav pozisyonunda dizlerini sırayla göğsüne doğru çek."]
  ],

  "Tüm Vücut":[
    ["Şınav","💪","Göğüs ve kol","3","12","40","Vücudunu düz tutarak kontrollü şınav çek."],
    ["Squat","🦵","Bacak","3","15","40","Kalçanı geriye göndererek kontrollü çömel."],
    ["Mountain Climber","🏃","Core","3","20","35","Dizlerini sırayla göğsüne doğru çek."],
    ["Glute Bridge","🍑","Kalça","3","15","35","Kalçanı yukarı kaldır ve üst noktada sık."],
    ["Shoulder Tap","👋","Omuz","3","16","35","Şınav pozisyonunda karşı omzuna dokun."],
    ["Crunch","🔥","Karın","3","15","35","Karın kaslarını sıkarak kontrollü crunch yap."],
    ["Lunge","🏃","Bacak","3","10","40","Öne adım atıp kontrollü şekilde aşağı in."],
    ["Plank","🧱","Core","3","30 sn","30","Vücudunu düz tutarak plank pozisyonunu koru."]
  ]
};


/* ---------------- BÖLGE SEÇME ---------------- */

function openBodyPart(part){

  currentPart = part;

  document.getElementById("bodyPartTitle").textContent = part;

  const descriptions = {
    "Göğüs":"Göğüs kaslarını güçlendirmeye yönelik hareketler.",
    "Sırt":"Sırt ve gövde bölgesini çalıştıran hareketler.",
    "Kollar":"Biceps ve triceps odaklı hareketler.",
    "Omuz":"Omuz kaslarını güçlendirmeye yönelik hareketler.",
    "Bacak":"Bacak ve kalça odaklı hareketler.",
    "Karın":"Karın ve core bölgesi hareketleri.",
    "Tüm Vücut":"Tüm vücudu çalıştıran hareketler."
  };

  document.getElementById("bodyPartDescription").textContent =
    descriptions[part] || "Bölgeye özel hareketler.";

  renderExercises(part);

  showPage("bodypart");
}


function renderExercises(part){

  const list = document.getElementById("exerciseList");

  list.innerHTML = "";

  const data = exercises[part] || exercises["Tüm Vücut"];

  data.forEach((item,index)=>{

    const button = document.createElement("button");
    button.className = "exercise-item";

    button.innerHTML = `
      <div class="exercise-item-icon">${item[1]}</div>

      <div>
        <h3>${item[0]}</h3>
        <p>${item[2]} • ${item[3]} set • ${item[4]} tekrar</p>
      </div>

      <strong>→</strong>
    `;

    button.addEventListener("click",()=>{
      openExercise(part,index);
    });

    list.appendChild(button);
  });
}


/* ---------------- HAREKET DETAY ---------------- */

function openExercise(part,index){

  currentPart = part;

  const data = exercises[part] || exercises["Tüm Vücut"];
  const item = data[index];

  currentExercise = {
    part:part,
    index:index,
    data:item
  };

  document.getElementById("detailIcon").textContent = item[1];
  document.getElementById("detailPart").textContent = part.toUpperCase();
  document.getElementById("detailName").textContent = item[0];
  document.getElementById("detailDescription").textContent = item[2];
  document.getElementById("detailSets").textContent = item[3];
  document.getElementById("detailReps").textContent = item[4];
  document.getElementById("detailRest").textContent = item[5];
  document.getElementById("detailHow").textContent = item[6];

  showPage("exerciseDetail");
}


function startSelectedExercise(){

  if(!currentExercise) return;

  workoutExercises = [
    currentExercise.data
  ];

  workoutIndex = 0;

  startWorkoutScreen();
}


/* ---------------- ANTRENMAN ---------------- */

function startTodayWorkout(){

  workoutExercises = exercises["Tüm Vücut"];
  workoutIndex = 0;

  startWorkoutScreen();
}


function createWorkout(){

  const goal = document.getElementById("buildGoal").value;

  const time = Number(buildOptions.time);

  let base = exercises["Tüm Vücut"].slice();

  if(goal === "Yağ yakma"){
    base = [
      exercises["Tüm Vücut"][2],
      exercises["Tüm Vücut"][1],
      exercises["Tüm Vücut"][5],
      exercises["Tüm Vücut"][6],
      exercises["Tüm Vücut"][7]
    ];
  }

  if(goal === "Kas geliştirme"){
    base = [
      exercises["Tüm Vücut"][0],
      exercises["Tüm Vücut"][1],
      exercises["Tüm Vücut"][3],
      exercises["Tüm Vücut"][4],
      exercises["Tüm Vücut"][5]
    ];
  }

  if(time <= 10){
    base = base.slice(0,3);
  }else if(time <= 20){
    base = base.slice(0,5);
  }

  workoutExercises = base;
  workoutIndex = 0;

  showToast(`${goal} için program hazırlandı 🔥`);

  setTimeout(()=>{
    startWorkoutScreen();
  },500);
}


function startWorkoutScreen(){

  if(!workoutExercises.length){
    workoutExercises = exercises["Tüm Vücut"];
  }

  clearInterval(timerInterval);

  workoutIndex = Math.max(0,Math.min(workoutIndex,workoutExercises.length-1));

  loadWorkoutExercise();

  showPage("workout");
}


function loadWorkoutExercise(){

  const item = workoutExercises[workoutIndex];

  if(!item) return;

  timerSeconds = 30;
  timerRunning = false;

  clearInterval(timerInterval);

  document.getElementById("timer").textContent = formatTime(timerSeconds);
  document.getElementById("timerBtn").textContent = "▶ Başlat";

  document.getElementById("activeIcon").textContent = item[1];
  document.getElementById("activeExercise").textContent = item[0];
  document.getElementById("activeInstruction").textContent = item[6];

  document.getElementById("workoutCounter").textContent =
    `${workoutIndex+1} / ${workoutExercises.length}`;

  const percent =
    ((workoutIndex+1) / workoutExercises.length) * 100;

  document.getElementById("progressBar").style.width = percent + "%";

  const next =
    workoutExercises[workoutIndex+1];

  document.getElementById("nextExercise").textContent =
    next ? next[0] : "Son hareket 🎉";
}


function toggleTimer(){

  if(timerRunning){
    pauseTimer();
    return;
  }

  timerRunning = true;

  document.getElementById("timerBtn").textContent = "⏸ Duraklat";

  timerInterval = setInterval(()=>{

    timerSeconds--;

    document.getElementById("timer").textContent =
      formatTime(timerSeconds);

    if(timerSeconds <= 0){
      clearInterval(timerInterval);
      timerRunning = false;

      document.getElementById("timerBtn").textContent = "▶ Tekrar";

      showToast("Süre bitti! 🔥");

      if(navigator.vibrate){
        navigator.vibrate([200,100,200]);
      }
    }

  },1000);
}


function pauseTimer(){

  clearInterval(timerInterval);

  timerRunning = false;

  document.getElementById("timerBtn").textContent = "▶ Devam";
}


function skipExercise(){

  clearInterval(timerInterval);

  workoutIndex++;

  if(workoutIndex >= workoutExercises.length){
    finishWorkout();
    return;
  }

  loadWorkoutExercise();
}


function finishWorkout(){

  clearInterval(timerInterval);

  timerRunning = false;

  state.workouts += 1;
  state.minutes += Math.max(1,workoutExercises.length * 3);
  state.calories += Math.max(20,workoutExercises.length * 20);
  state.xp += 50;

  updateStreak();

  saveState();

  showToast("Antrenman tamamlandı! +50 XP 🏆");

  setTimeout(()=>{
    showPage("stats");
    updateStats();
  },700);
}


function formatTime(seconds){

  const min = Math.floor(seconds/60)
    .toString()
    .padStart(2,"0");

  const sec = (seconds%60)
    .toString()
    .padStart(2,"0");

  return `${min}:${sec}`;
}


/* ---------------- PROGRAM SEÇİMLERİ ---------------- */

function chooseBuild(button,type,value){

  buildOptions[type] = value;

  const parent = button.parentElement;

  parent.querySelectorAll(".choice").forEach(b=>{
    b.classList.remove("active");
  });

  button.classList.add("active");
}


/* ---------------- PROFİL ---------------- */

function saveProfile(){

  state.profile = {
    name: document.getElementById("profileName").value.trim(),
    age: document.getElementById("profileAge").value,
    height: document.getElementById("profileHeight").value,
    weight: document.getElementById("profileWeight").value,
    goal: document.getElementById("profileGoal").value,
    level: document.getElementById("profileLevel").value
  };

  saveState();

  updateHome();

  document.getElementById("profilePreview").textContent =
    state.profile.name || "Demirkapı Fit";

  document.getElementById("saveMessage").textContent =
    "✓ Profil başarıyla kaydedildi.";

  showToast("Profil kaydedildi 💾");

  setTimeout(()=>{
    document.getElementById("saveMessage").textContent="";
  },2500);
}


function loadProfile(){

  const p = state.profile || {};

  document.getElementById("profileName").value = p.name || "";
  document.getElementById("profileAge").value = p.age || "";
  document.getElementById("profileHeight").value = p.height || "";
  document.getElementById("profileWeight").value = p.weight || "";
  document.getElementById("profileGoal").value =
    p.goal || "Kas geliştirme";
  document.getElementById("profileLevel").value =
    p.level || "Başlangıç";

  document.getElementById("profilePreview").textContent =
    p.name || "Demirkapı Fit";

  const m = state.measurements || {};

  document.getElementById("waist").value = m.waist || "";
  document.getElementById("chest").value = m.chest || "";
  document.getElementById("arm").value = m.arm || "";
  document.getElementById("leg").value = m.leg || "";
}


function saveMeasurements(){

  state.measurements = {
    waist:document.getElementById("waist").value,
    chest:document.getElementById("chest").value,
    arm:document.getElementById("arm").value,
    leg:document.getElementById("leg").value
  };

  saveState();

  showToast("Ölçüler kaydedildi 📏");
}


/* ---------------- SU ---------------- */

function addWater(){

  if(state.water < 8){
    state.water++;
  }

  saveState();
  updateWater();
  updateHome();
}


function removeWater(){

  if(state.water > 0){
    state.water--;
  }

  saveState();
  updateWater();
  updateHome();
}


function updateWater(){

  document.getElementById("waterCount").textContent = state.water;

  const home = document.getElementById("waterHome");

  if(home){
    home.textContent = `${state.water} / 8`;
  }
}


/* ---------------- ANA SAYFA ---------------- */

function updateHome(){

  updateWater();

  document.getElementById("streakNumber").textContent =
    state.streak || 0;

  document.getElementById("xpHome").textContent =
    `${state.xp || 0} XP`;

  document.getElementById("weightHome").textContent =
    state.profile && state.profile.weight
      ? `${state.profile.weight} kg`
      : "-- kg";

  const name =
    state.profile && state.profile.name
      ? state.profile.name
      : "";

  document.getElementById("homeGreeting").textContent =
    name
      ? `${name}, bugün de kendin için çalış. 💪`
      : "Güçlenmeye devam et.";
}


/* ---------------- İSTATİSTİK ---------------- */

function updateStats(){

  document.getElementById("totalWorkouts").textContent =
    state.workouts || 0;

  document.getElementById("totalMinutes").textContent =
    state.minutes || 0;

  document.getElementById("totalCalories").textContent =
    state.calories || 0;

  document.getElementById("statsStreak").textContent =
    state.streak || 0;

  document.getElementById("xpText").textContent =
    state.xp || 0;

  let level = "Başlangıç";

  if(state.xp >= 500) level = "Usta";
  else if(state.xp >= 250) level = "İleri";
  else if(state.xp >= 100) level = "Orta";

  document.getElementById("levelText").textContent = level;

  const progress = Math.min(100,(state.xp % 100));

  document.getElementById("xpBar").style.width =
    progress + "%";

  renderBadges();
}


function renderBadges(){

  const badges = [
    ["🔥","İlk Antrenman",state.workouts >= 1],
    ["💪","5 Antrenman",state.workouts >= 5],
    ["🏆","10 Antrenman",state.workouts >= 10],
    ["🔥","3 Gün Seri",state.streak >= 3],
    ["💧","Su Hedefi",state.water >= 8],
    ["⭐","100 XP",state.xp >= 100]
  ];

  const grid = document.getElementById("badgeGrid");

  grid.innerHTML = badges.map(b=>`
    <div class="badge ${b[2] ? "unlocked":""}">
      <span>${b[0]}</span>
      <small>${b[1]}</small>
    </div>
  `).join("");
}


/* ---------------- SERİ ---------------- */

function updateStreak(){

  const today = new Date().toISOString().slice(0,10);

  if(state.lastWorkout === today){
    return;
  }

  if(!state.lastWorkout){
    state.streak = 1;
  }else{

    const old = new Date(state.lastWorkout);
    const now = new Date(today);

    const difference =
      Math.floor((now-old)/(1000*60*60*24));

    if(difference === 1){
      state.streak++;
    }else if(difference > 1){
      state.streak = 1;
    }
  }

  state.lastWorkout = today;
}


/* ---------------- KARANLIK MOD ---------------- */

function toggleDarkMode(){

  state.dark = !state.dark;

  document.body.classList.toggle("dark",state.dark);

  saveState();

  showToast(
    state.dark
      ? "Karanlık mod açıldı 🌙"
      : "Karanlık mod kapatıldı ☀️"
  );
}


/* ---------------- YEDEKLEME ---------------- */

function exportData(){

  const data = JSON.stringify(state,null,2);

  const blob = new Blob(
    [data],
    {type:"application/json"}
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "demirkapi-fit-yedek.json";

  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);

  showToast("Yedek dosyası hazırlandı 💾");
}


function importData(event){

  const file = event.target.files[0];

  if(!file) return;

  const reader = new FileReader();

  reader.onload = function(){

    try{

      const imported = JSON.parse(reader.result);

      state = {...state,...imported};

      saveState();

      document.body.classList.toggle("dark",state.dark);

      loadProfile();
      updateHome();

      showToast("Veriler geri yüklendi ✓");

    }catch(e){

      showToast("Dosya geçersiz ❌");
    }
  };

  reader.readAsText(file);
}


function resetData(){

  const ok = confirm(
    "Tüm Demirkapı Fit verileri silinsin mi?"
  );

  if(!ok) return;

  localStorage.removeItem(STORAGE_KEY);

  location.reload();
}


/* ---------------- BİLDİRİM ---------------- */

function showToast(message){

  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(()=>{
    toast.classList.remove("show");
  },2200);
}


/* ---------------- BAŞLANGIÇ ---------------- */

function init(){

  document.body.classList.toggle("dark",state.dark);

  updateHome();
  updateWater();
  updateStats();
  loadProfile();

  showPage("home");
}

init();
