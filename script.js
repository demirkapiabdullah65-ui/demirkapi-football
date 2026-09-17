const KEY="demirkapiFit_v3";

let state={
 profile:{},
 water:0,
 workouts:0,
 minutes:0,
 calories:0,
 xp:0,
 streak:0,
 lastWorkout:"",
 vibration:true,
 dark:false,
 measurements:{},
 meals:[],
 history:[],
 challenge:null,
 tasks:{}
};

try{
 const old=JSON.parse(localStorage.getItem(KEY));
 if(old) state={...state,...old};
}catch(e){}

const exercises={
 "Göğüs":[
  ["Şınav","🔥","Göğüs ve triceps çalıştırır.",3,10,30,"Eller omuz genişliğinde. Göğsünü kontrollü şekilde yere yaklaştır ve tekrar yukarı it."],
  ["Diz Üstü Şınav","🔥","Başlangıç seviyesi göğüs hareketi.",3,12,30,"Dizlerini yere koy. Gövdeni düz tutarak dirseklerden kontrollü şekilde in ve kalk."],
  ["Geniş Şınav","🔥","Göğsün dış kısmına odaklanır.",3,10,35,"Ellerini omuzlardan biraz daha geniş aç. Göğsünü kontrollü indirip yukarı çık."]
 ],
 "Sırt":[
  ["Superman","🦸","Bel ve sırt bölgesini çalıştırır.",3,12,30,"Yüzüstü uzan. Kollarını ve bacaklarını hafifçe kaldırıp kontrollü indir."],
  ["Yerde Yüzme","🏊","Sırt aktivasyonu sağlar.",3,15,30,"Yüzüstü pozisyonda kollarını kontrollü şekilde hareket ettir."],
  ["Ters Kar Meleği","❄️","Üst sırt ve omuzları çalıştırır.",3,12,30,"Yüzüstü uzan. Kollarını kontrollü biçimde yanlardan baş üstüne götür."]
 ],
 "Kollar":[
  ["Diamond Şınav","💪","Triceps odaklı.",3,8,40,"Ellerini göğsünün altında birbirine yaklaştır. Dirseklerini kontrollü büküp aç."],
  ["Sandalye Triceps","🪑","Triceps güçlendirir.",3,10,40,"Güvenli ve sabit bir yüzey kullan. Dirseklerini geriye doğru bükerek alçal."],
  ["Biceps Sıkma","💪","Biceps aktivasyonu.",3,15,25,"Kollarını bükülü tutup kaslarını kontrollü şekilde sık."]
 ],
 "Omuz":[
  ["Pike Şınav","🏋️","Omuz odaklı vücut ağırlığı hareketi.",3,8,40,"Kalçanı yukarı kaldır. Başını öne ve aşağı götürüp tekrar başlangıca dön."],
  ["Kol Çemberi","⭕","Omuzları ısıtır.",3,20,20,"Kollarını iki yana aç ve küçükten büyüğe kontrollü çemberler çiz."],
  ["Y T Kaldırış","🦾","Arka omuz ve sırt.",3,10,30,"Yüzüstü veya eğimli pozisyonda kollarını Y ve T şekillerinde kaldır."]
 ],
 "Bacak":[
  ["Squat","🦵","Bacak ve kalça.",3,15,40,"Ayaklarını omuz genişliğinde aç. Kalçanı geriye göndererek çömel ve kontrollü kalk."],
  ["Lunge","🦵","Bacak ve kalça.",3,10,40,"Bir ayağınla öne adım at. Dizlerini kontrollü büküp başlangıç pozisyonuna dön."],
  ["Glute Bridge","🍑","Kalça ve arka bacak.",3,15,30,"Sırtüstü yat. Dizleri bük. Kalçanı yukarı kaldırıp sık ve kontrollü indir."],
  ["Calf Raise","🦶","Baldır kasları.",3,20,25,"Dengeni koruyarak topuklarını yukarı kaldır ve kontrollü indir."]
 ],
 "Karın":[
  ["Crunch","⚡","Karın kaslarını çalıştırır.",3,15,30,"Sırtüstü yat. Karın kaslarını sıkarak omuzlarını hafifçe kaldır."],
  ["Plank","⚡","Core stabilitesi.",3,30,30,"Dirsek ve ayak uçlarından destek al. Vücudunu düz tut."],
  ["Mountain Climber","🏃","Karın ve kondisyon.",3,20,30,"Şınav pozisyonunda dizlerini sırayla göğsüne çek."],
  ["Dead Bug","🐞","Core kontrolü.",3,10,30,"Sırtüstü yat. Karşı kol ve bacağını kontrollü uzatıp geri getir."]
 ],
 "Tüm Vücut":[
  ["Squat","🦵","Bacak ve kalça.",3,15,35,"Kalçanı geriye göndererek çömel ve kontrollü kalk."],
  ["Şınav","🔥","Göğüs ve kollar.",3,10,35,"Gövdeni düz tutarak kontrollü şekilde in ve kalk."],
  ["Lunge","🦵","Bacak ve kalça.",3,10,35,"Öne adım atıp kontrollü şekilde aşağı in ve kalk."],
  ["Superman","🦸","Sırt bölgesi.",3,12,30,"Yüzüstü uzan ve kol/bacaklarını kontrollü kaldır."],
  ["Mountain Climber","🏃","Core ve kondisyon.",3,20,30,"Dizlerini sırayla göğsüne çek."],
  ["Glute Bridge","🍑","Kalça.",3,15,30,"Kalçanı yukarı kaldırıp sık."],
  ["Plank","⚡","Core.",3,30,30,"Vücudunu düz tutarak plank pozisyonunu koru."],
  ["Jumping Jack","🔥","Kardiyo.",3,30,30,"Kollar ve bacakları aynı anda açıp kapat."]
 ]
};

let currentPart="Göğüs";
let currentExercise=null;
let workoutExercises=[];
let workoutIndex=0;
let currentSet=1;
let timerSeconds=30;
let timerInterval=null;
let timerRunning=false;
let vibration=true;

function save(){
 localStorage.setItem(KEY,JSON.stringify(state));
}

function showPage(id){
 document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
 const el=document.getElementById(id);
 if(el) el.classList.add("active");
 window.scrollTo(0,0);
 updateAll();
}

function toast(text){
 const t=document.getElementById("toast");
 t.textContent=text;
 t.classList.add("show");
 setTimeout(()=>t.classList.remove("show"),2200);
}

function updateAll(){
 updateHome();
 updateStats();
 updateProfile();
 updateWater();
 updateNutrition();
 updateBMI();
 renderHistory();
 renderBadges();
}

function updateHome(){
 document.getElementById("streak").textContent=state.streak||0;
 document.getElementById("homeWater").textContent=(state.water||0)+" / 8";
 document.getElementById("homeXP").textContent=state.xp||0;
 document.getElementById("homeWeight").textContent=
   state.profile.weight ? state.profile.weight+" kg":"--";

 if(state.profile.name){
   document.getElementById("welcomeText").textContent=
    "Merhaba "+state.profile.name+" 👋";
 }
}

function openBodyPart(part){
 currentPart=part;
 document.getElementById("bodyPartTitle").textContent=part;
 renderExercises(part);
 showPage("bodypart");
}

function renderExercises(part){
 const box=document.getElementById("exerciseList");
 box.innerHTML="";

 (exercises[part]||[]).forEach((ex,i)=>{
   const div=document.createElement("div");
   div.className="exerciseItem";

   div.innerHTML=`
    <div class="emoji">${ex[1]}</div>
    <div>
      <b>${ex[0]}</b>
      <small>${ex[3]} set × ${ex[4]} tekrar</small>
    </div>
    <button>→</button>
   `;

   div.addEventListener("click",()=>openExercise(part,i));
   box.appendChild(div);
 });
}

function openExercise(part,index){
 currentPart=part;
 currentExercise=exercises[part][index];

 document.getElementById("exerciseEmoji").textContent=currentExercise[1];
 document.getElementById("exerciseName").textContent=currentExercise[0];
 document.getElementById("exerciseDesc").textContent=currentExercise[2];
 document.getElementById("exerciseSets").textContent=currentExercise[3];
 document.getElementById("exerciseReps").textContent=currentExercise[4];
 document.getElementById("exerciseRest").textContent=currentExercise[5];
 document.getElementById("exerciseHow").textContent=currentExercise[6];

 showPage("exercise");
}

function startSingleExercise(){
 if(!currentExercise)return;
 workoutExercises=[currentExercise];
 workoutIndex=0;
 currentSet=1;
 startWorkoutScreen();
}

function startTodayWorkout(){
 workoutExercises=exercises["Tüm Vücut"].slice(0,8);
 workoutIndex=0;
 currentSet=1;
 startWorkoutScreen();
}

function quickWorkout(type){
 if(type==="Üst Vücut"){
   workoutExercises=[
    ...exercises["Göğüs"].slice(0,2),
    ...exercises["Sırt"].slice(0,2),
    ...exercises["Kollar"].slice(0,2)
   ];
 }else{
   workoutExercises=(exercises[type]||exercises["Tüm Vücut"]).slice();
 }
 workoutIndex=0;
 currentSet=1;
 startWorkoutScreen();
}

function createWorkout(){
 const time=Number(document.getElementById("timeSelect").value);
 const equipment=document.getElementById("equipmentSelect").value;

 let pool=[...exercises["Tüm Vücut"]];

 if(equipment!=="Ekipmansız"){
   pool=[
    ...pool,
    ...exercises["Göğüs"],
    ...exercises["Bacak"],
    ...exercises["Kollar"]
   ];
 }

 let count=time<=10?4:time<=20?6:time<=30?8:10;
 workoutExercises=pool.slice(0,count);

 workoutIndex=0;
 currentSet=1;

 toast("Program hazırlandı 🔥");
 setTimeout(startWorkoutScreen,400);
}

function startWorkoutScreen(){
 if(!workoutExercises.length)return;

 showPage("workout");
 loadWorkoutExercise();
}

function loadWorkoutExercise(){
 clearInterval(timerInterval);
 timerRunning=false;

 const ex=workoutExercises[workoutIndex];

 document.getElementById("workoutEmoji").textContent=ex[1];
 document.getElementById("workoutName").textContent=ex[0];
 document.getElementById("workoutInstruction").textContent=ex[2];

 document.getElementById("workoutCounter").textContent=
  (workoutIndex+1)+" / "+workoutExercises.length;

 document.getElementById("setNumber").textContent=
  currentSet+" / "+ex[3];

 document.getElementById("repText").textContent=
  ex[4]+" tekrar";

 const progress=((workoutIndex)/workoutExercises.length)*100;
 document.getElementById("workoutProgress").style.width=progress+"%";

 timerSeconds=currentSet===1?5:ex[5];
 document.getElementById("timer").textContent=timerSeconds;
 document.getElementById("timerLabel").textContent=
  currentSet===1?"HAZIR":"DİNLENME";
}

function toggleTimer(){
 if(timerRunning){
   clearInterval(timerInterval);
   timerRunning=false;
 }else{
   timerRunning=true;
   timerInterval=setInterval(()=>{
     timerSeconds--;
     document.getElementById("timer").textContent=timerSeconds;

     if(timerSeconds<=0){
       clearInterval(timerInterval);
       timerRunning=false;
       vibrate();
       toast("Hazır! 💪");
     }
   },1000);
 }
}

function completeSet(){
 const ex=workoutExercises[workoutIndex];

 clearInterval(timerInterval);
 timerRunning=false;

 vibrate();

 if(currentSet<ex[3]){
   currentSet++;
   timerSeconds=ex[5];
   document.getElementById("timerLabel").textContent="DİNLENME";
   document.getElementById("timer").textContent=timerSeconds;
   document.getElementById("setNumber").textContent=
     currentSet+" / "+ex[3];

   toast("Set tamamlandı ✓ Dinlen!");
   startRestTimer();
 }else{
   toast("Hareket tamamlandı! 🔥");

   if(workoutIndex<workoutExercises.length-1){
     workoutIndex++;
     currentSet=1;
     setTimeout(loadWorkoutExercise,700);
   }else{
     finishWorkout();
   }
 }
}

function startRestTimer(){
 clearInterval(timerInterval);
 timerRunning=true;

 timerInterval=setInterval(()=>{
   timerSeconds--;
   document.getElementById("timer").textContent=timerSeconds;

   if(timerSeconds<=0){
     clearInterval(timerInterval);
     timerRunning=false;
     document.getElementById("timerLabel").textContent="BAŞLA";
     vibrate();
     toast("Set zamanı! 💪");
   }
 },1000);
}

function pauseWorkout(){
 clearInterval(timerInterval);
 timerRunning=false;
 toast("Antrenman duraklatıldı");
}

function skipExercise(){
 clearInterval(timerInterval);

 if(workoutIndex<workoutExercises.length-1){
   workoutIndex++;
   currentSet=1;
   loadWorkoutExercise();
 }else{
   finishWorkout();
 }
}

function finishWorkout(){
 clearInterval(timerInterval);

 state.workouts++;
 state.minutes+=25;
 state.calories+=180;
 state.xp+=100;

 updateStreak();
 state.lastWorkout=new Date().toISOString();

 state.history.unshift({
   date:new Date().toLocaleDateString("tr-TR"),
   name:"Antrenman",
   minutes:25,
   calories:180
 });

 state.history=state.history.slice(0,30);

 state.tasks.workout=true;

 save();
 updateAll();

 toast("🎉 Antrenman tamamlandı! +100 XP");

 setTimeout(()=>showPage("stats"),800);
}

function updateStreak(){
 const today=new Date().toISOString().slice(0,10);
 const last=state.lastWorkout?
   state.lastWorkout.slice(0,10):"";

 if(last===today)return;

 if(last){
   const a=new Date(last);
   const b=new Date(today);
   const diff=Math.round((b-a)/86400000);

   if(diff===1)state.streak++;
   else state.streak=1;
 }else{
   state.streak=1;
 }
}

function addWater(){
 if(state.water<8){
   state.water++;
   state.xp+=5;
   state.tasks.water=state.water>=8;
   save();
   updateAll();
   toast("💧 Su eklendi +5 XP");
 }else{
   toast("Bugünkü hedef tamamlandı 🎉");
 }
}

function resetWater(){
 state.water=0;
 state.tasks.water=false;
 save();
 updateAll();
}

function updateWater(){
 document.getElementById("waterCount").textContent=state.water||0;
}

function saveProfile(){
 state.profile={
  name:document.getElementById("profileName").value.trim(),
  age:document.getElementById("profileAge").value,
  height:document.getElementById("profileHeight").value,
  weight:document.getElementById("profileWeight").value,
  goal:document.getElementById("profileGoal").value,
  level:document.getElementById("profileLevel").value
 };

 save();
 updateAll();

 document.getElementById("saveMessage").textContent=
  "✓ Profil başarıyla kaydedildi.";

 toast("Profil kaydedildi 💾");
}

function updateProfile(){
 const p=state.profile||{};

 if(document.getElementById("profileName"))
 document.getElementById("profileName").value=p.name||"";

 if(document.getElementById("profileAge"))
 document.getElementById("profileAge").value=p.age||"";

 if(document.getElementById("profileHeight"))
 document.getElementById("profileHeight").value=p.height||"";

 if(document.getElementById("profileWeight"))
 document.getElementById("profileWeight").value=p.weight||"";

 if(document.getElementById("profileGoal"))
 document.getElementById("profileGoal").value=p.goal||"Kas Geliştirme";

 if(document.getElementById("profileLevel"))
 document.getElementById("profileLevel").value=p.level||"Başlangıç";

 document.getElementById("profilePreview").textContent=
  p.name||"Demirkapı Fit";
}

function saveMeasurements(){
 state.measurements={
  weight:Number(document.getElementById("measureWeight").value)||0,
  waist:Number(document.getElementById("measureWaist").value)||0,
  chest:Number(document.getElementById("measureChest").value)||0,
  arm:Number(document.getElementById("measureArm").value)||0,
  leg:Number(document.getElementById("measureLeg").value)||0,
  date:new Date().toLocaleDateString("tr-TR")
 };

 if(state.measurements.weight){
   state.profile.weight=state.measurements.weight;
 }

 save();
 updateAll();
 toast("Ölçüler kaydedildi 📏");
}

function updateBMI(){
 const h=Number(state.profile.height);
 const w=Number(state.profile.weight);

 if(!h||!w){
   document.getElementById("bmiResult").textContent="--";
   return;
 }

 const bmi=w/Math.pow(h/100,2);
 document.getElementById("bmiResult").textContent=bmi.toFixed(1);
}

function addMeal(){
 const calories=Number(document.getElementById("mealCalories").value)||0;
 const protein=Number(document.getElementById("mealProtein").value)||0;
 const carb=Number(document.getElementById("mealCarb").value)||0;
 const fat=Number(document.getElementById("mealFat").value)||0;
 const type=document.getElementById("mealType").value;

 if(!calories){
   toast("Kalori miktarı gir");
   return;
 }

 state.meals.unshift({
  date:new Date().toISOString().slice(0,10),
  type,calories,protein,carb,fat
 });

 state.xp+=10;
 state.tasks.food=true;

 document.getElementById("mealCalories").value="";
 document.getElementById("mealProtein").value="";
 document.getElementById("mealCarb").value="";
 document.getElementById("mealFat").value="";

 save();
 updateAll();
 toast("Öğün kaydedildi 🥗 +10 XP");
}

function updateNutrition(){
 const today=new Date().toISOString().slice(0,10);
 const meals=state.meals.filter(x=>x.date===today);

 const totals=meals.reduce((a,x)=>({
  calories:a.calories+x.calories,
  protein:a.protein+x.protein,
  carb:a.carb+x.carb,
  fat:a.fat+x.fat
 }),{calories:0,protein:0,carb:0,fat:0});

 document.getElementById("caloriesToday").textContent=totals.calories;
 document.getElementById("proteinToday").textContent=totals.protein;
 document.getElementById("carbToday").textContent=totals.carb;
 document.getElementById("fatToday").textContent=totals.fat;

 const list=document.getElementById("mealList");
 list.innerHTML="";

 meals.slice(0,10).forEach(m=>{
  const d=document.createElement("div");
  d.className="mealItem";
  d.innerHTML=`<span>🥗 ${m.type}</span><b>${m.calories} kcal</b>`;
  list.appendChild(d);
 });
}

function updateStats(){
 document.getElementById("statWorkouts").textContent=state.workouts;
 document.getElementById("statMinutes").textContent=state.minutes;
 document.getElementById("statCalories").textContent=state.calories;
 document.getElementById("statXP").textContent=state.xp;

 const level=Math.floor(state.xp/500)+1;
 const current=state.xp%500;

 document.getElementById("levelName").textContent=
  "Seviye "+level;

 document.getElementById("levelXP").textContent=
  current+" / 500 XP";

 document.getElementById("levelProgress").style.width=
  (current/5)+"%";
}

function renderBadges(){
 const box=document.getElementById("badges");
 box.innerHTML="";

 const badges=[
  ["🏁","İlk Antrenman",state.workouts>=1],
  ["🔥","7 Gün",state.streak>=7],
  ["💪","10 Antrenman",state.workouts>=10],
  ["🏆","50 Antrenman",state.workouts>=50],
  ["👑","100 Antrenman",state.workouts>=100],
  ["💧","Su Ustası",state.water>=8],
  ["⭐","500 XP",state.xp>=500],
  ["🥗","Beslenme",state.meals.length>=5]
 ];

 badges.forEach(b=>{
  const d=document.createElement("div");
  d.className="badge";
  d.style.opacity=b[2]?"1":".25";
  d.innerHTML=`${b[0]}<small>${b[1]}</small>`;
  box.appendChild(d);
 });
}

function renderHistory(){
 const box=document.getElementById("historyList");
 box.innerHTML="";

 if(!state.history.length){
  box.innerHTML="<p style='color:var(--muted)'>Henüz antrenman yok.</p>";
  return;
 }

 state.history.slice(0,10).forEach(x=>{
  const d=document.createElement("div");
  d.className="mealItem";
  d.innerHTML=
   `<span>🔥 ${x.name}<br><small>${x.date} • ${x.minutes} dk</small></span>
    <b>+${x.calories} kcal</b>`;
  box.appendChild(d);
 });
}

function smartCoach(){
 let text="";

 const goal=state.profile.goal||"Genel Fitness";
 const level=state.profile.level||"Başlangıç";

 if(state.lastWorkout){
   const diff=(Date.now()-new Date(state.lastWorkout).getTime())/86400000;

   if(diff<1)
    text="Bugün antrenmanını zaten tamamladın. Hafif esneme yapabilirsin.";
   else if(diff>=2)
    text=`${goal} hedefin için bugün ${level} seviyesinde Full Body çalışabilirsin.`;
   else
    text="Bugün farklı bir kas grubu çalıştırıp toparlanmaya zaman verebilirsin.";
 }else{
   text=`${goal} hedefin için başlangıç seviyesinde Full Body önerisi hazır.`;
 }

 document.getElementById("coachText").textContent=text;
 toast("🧠 Program önerisi hazır");
}

function startChallenge(){
 if(!state.challenge){
  state.challenge={
   start:new Date().toISOString(),
   startWeight:Number(state.profile.weight)||0,
   workouts:state.workouts
  };

  save();

  document.getElementById("challengeText").textContent=
   "30 günlük değişim başladı! 🔥";

  toast("🔥 30 günlük challenge başladı!");
 }else{
  const start=new Date(state.challenge.start);
  const days=Math.floor((Date.now()-start.getTime())/86400000);

  document.getElementById("challengeText").textContent=
   Math.min(days,30)+"/30 gün tamamlandı.";
 }
}

function toggleDark(){
 state.dark=!state.dark;
 document.body.classList.toggle("dark",state.dark);
 save();
}

function toggleVibration(){
 state.vibration=!state.vibration;
 document.getElementById("vibrationStatus").textContent=
  state.vibration?"Açık":"Kapalı";
 save();
}

function vibrate(){
 if(state.vibration && navigator.vibrate)
  navigator.vibrate([100,60,100]);
}

function exportData(){
 const blob=new Blob([JSON.stringify(state,null,2)],{
  type:"application/json"
 });

 const a=document.createElement("a");
 a.href=URL.createObjectURL(blob);
 a.download="demirkapi-fit-yedek.json";
 a.click();

 toast("Yedek oluşturuldu 💾");
}

function importData(event){
 const file=event.target.files[0];
 if(!file)return;

 const reader=new FileReader();

 reader.onload=()=>{
  try{
   state={...state,...JSON.parse(reader.result)};
   save();
   updateAll();
   toast("Yedek geri yüklendi ✓");
  }catch(e){
   toast("Yedek dosyası hatalı");
  }
 };

 reader.readAsText(file);
}

function toggleFullscreen(){
 const el=document.documentElement;

 if(!document.fullscreenElement){
  el.requestFullscreen?.();
 }else{
  document.exitFullscreen?.();
 }
}

let deferredPrompt=null;

window.addEventListener("beforeinstallprompt",e=>{
 e.preventDefault();
 deferredPrompt=e;
});

async function installApp(){
 if(deferredPrompt){
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;
 }else{
  toast("Tarayıcı menüsünden Ana Ekrana Ekle seçeneğini kullanabilirsin.");
 }
}

document.querySelectorAll(
 "#taskWorkout,#taskWater,#taskStretch,#taskFood"
).forEach(el=>{
 el.addEventListener("change",()=>{
  state.tasks[el.id.replace("task","").toLowerCase()]=el.checked;
  save();
 });
});

document.addEventListener("keydown",e=>{
 if(e.code==="Space" && document.getElementById("workout").classList.contains("active")){
  e.preventDefault();
  toggleTimer();
 }
});

updateAll();

if(state.dark)
 document.body.classList.add("dark");

if("serviceWorker" in navigator){
 window.addEventListener("load",()=>{
  navigator.serviceWorker.register("sw.js").catch(()=>{});
 });
}
