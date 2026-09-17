let currentWorkout = [];
let currentType = "bodyweight";
let completedExercises = 0;

let workoutTimer = null;
let workoutSeconds = 0;
let restTimer = null;
let restSeconds = 60;

let selectedLevel = "Başlangıç";
let selectedDays = 4;

const bodyweightExercises = [
  { name: "Squat", icon: "🦵", sets: "4 set × 15 tekrar", desc: "Bacak ve kalça" },
  { name: "Şınav", icon: "💪", sets: "4 set × 10 tekrar", desc: "Göğüs ve triceps" },
  { name: "Lunge", icon: "🦵", sets: "3 set × 12 tekrar", desc: "Bacak ve kalça" },
  { name: "Plank", icon: "🔥", sets: "3 set × 30 saniye", desc: "Karın ve core" },
  { name: "Mountain Climber", icon: "🏃", sets: "3 set × 30 saniye", desc: "Kondisyon" },
  { name: "Mekik", icon: "💪", sets: "3 set × 15 tekrar", desc: "Karın" }
];

const equipmentExercises = [
  { name: "Dambıl Goblet Squat", icon: "🏋️", sets: "4 set × 12 tekrar", desc: "Bacak ve kalça" },
  { name: "Dambıl Bench Press", icon: "💪", sets: "4 set × 10 tekrar", desc: "Göğüs" },
  { name: "Dambıl Row", icon: "🏋️", sets: "4 set × 10 tekrar", desc: "Sırt" },
  { name: "Dambıl Shoulder Press", icon: "💪", sets: "3 set × 12 tekrar", desc: "Omuz" },
  { name: "Dambıl Curl", icon: "💪", sets: "3 set × 12 tekrar", desc: "Biceps" },
  { name: "Dambıl Triceps", icon: "🏋️", sets: "3 set × 12 tekrar", desc: "Triceps" }
];

const weekNames = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar"
];

const motivationTexts = [
  "Bahane yok. Bugün kendin için bir şey yap. 🔥",
  "Düzenli olmak, mükemmel olmaktan daha önemlidir.",
  "Bugünkü antrenmanın gelecekteki seni oluşturur. 💪",
  "Kendinle yarış. Dünkü senden daha iyi ol.",
  "Bir antrenman daha. Bir adım daha. 🏆"
];


document.addEventListener("DOMContentLoaded", () => {
  loadEverything();
});


function loadEverything() {

  loadTheme();
  loadProfile();
  updateStats();
  updateHome();
  renderWeekPlan();
  updateWeight();
  updateWater();
  randomMotivation();

  const savedProgram =
    localStorage.getItem("fitnessProgram");

  if (savedProgram) {
    currentType = savedProgram;
  }
}


function showPage(pageId, button) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (!page) return;

  page.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  } else {

    const navMap = {
      home: 0,
      programs: 1,
      stats: 2,
      profile: 3
    };

    if (navMap[pageId] !== undefined) {

      const items =
        document.querySelectorAll(".nav-item");

      items[navMap[pageId]].classList.add("active");
    }
  }

  if (pageId === "stats") {
    updateStats();
  }

  if (pageId === "weight") {
    updateWeight();
  }

  if (pageId === "water") {
    updateWater();
  }

  if (pageId === "programs") {
    renderWeekPlan();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


function startTodayWorkout() {

  openWorkout(currentType);

}


function openWorkout(type) {

  currentType = type;

  localStorage.setItem(
    "fitnessProgram",
    type
  );

  if (type === "bodyweight") {

    currentWorkout =
      bodyweightExercises.map(x => ({...x}));

    document.getElementById("workoutType").textContent =
      "ALETSİZ ANTRENMAN";

    document.getElementById("workoutTitle").textContent =
      "Tüm Vücut";

  } else {

    currentWorkout =
      equipmentExercises.map(x => ({...x}));

    document.getElementById("workoutType").textContent =
      "ALETLİ ANTRENMAN";

    document.getElementById("workoutTitle").textContent =
      "Evde Aletli";
  }

  completedExercises = 0;

  stopWorkoutTimer();

  workoutSeconds = 0;

  updateWorkoutTimer();

  renderExercises();

  updateProgress();

  showPage("workout");
}


function selectProgram(type, button) {

  currentType = type;

  localStorage.setItem(
    "fitnessProgram",
    type
  );

  document.querySelectorAll(".choice")
    .forEach(x => x.classList.remove("active"));

  button.classList.add("active");

  const text =
    type === "bodyweight"
      ? "Aletsiz program seçildi 🏠"
      : "Aletli program seçildi 🏋️";

  showToast(text);

  updateHome();
  renderWeekPlan();
}


function renderExercises() {

  const container =
    document.getElementById("exerciseList");

  container.innerHTML = "";

  currentWorkout.forEach((exercise, index) => {

    const item =
      document.createElement("div");

    item.className = "exercise";

    item.id =
      "exercise-" + index;

    item.innerHTML = `
      <div class="exercise-icon">${exercise.icon}</div>

      <div class="exercise-info">
        <b>${exercise.name}</b>
        <small>${exercise.sets} • ${exercise.desc}</small>
      </div>

      <button
        class="exercise-check"
        onclick="completeExercise(${index})">
        ✓
      </button>
    `;

    container.appendChild(item);
  });

  document.getElementById("exerciseCounter").textContent =
    "0 / " + currentWorkout.length;
}


function completeExercise(index) {

  const exercise =
    document.getElementById("exercise-" + index);

  if (!exercise) return;

  if (exercise.classList.contains("done")) {

    exercise.classList.remove("done");

    completedExercises--;

  } else {

    exercise.classList.add("done");

    completedExercises++;

    showToast("Hareket tamamlandı 💪");
  }

  updateProgress();
}


function updateProgress() {

  const total =
    currentWorkout.length;

  document.getElementById("progressText").textContent =
    completedExercises + " / " + total;

  document.getElementById("exerciseCounter").textContent =
    completedExercises + " / " + total;

  const percent =
    total === 0
      ? 0
      : (completedExercises / total) * 100;

  document.getElementById("progressFill").style.width =
    percent + "%";
}


function startWorkoutTimer() {

  if (workoutTimer) return;

  workoutTimer =
    setInterval(() => {

      workoutSeconds++;

      updateWorkoutTimer();

    }, 1000);
}


function pauseWorkoutTimer() {

  stopWorkoutTimer();

}


function stopWorkoutTimer() {

  if (workoutTimer) {

    clearInterval(workoutTimer);

    workoutTimer = null;
  }
}


function updateWorkoutTimer() {

  const minutes =
    Math.floor(workoutSeconds / 60);

  const seconds =
    workoutSeconds % 60;

  document.getElementById("workoutTimer").textContent =
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0");
}


function startRest() {

  if (restTimer) return;

  restSeconds = 60;

  updateRestDisplay();

  restTimer =
    setInterval(() => {

      restSeconds--;

      updateRestDisplay();

      if (restSeconds <= 0) {

        clearInterval(restTimer);

        restTimer = null;

        restSeconds = 60;

        updateRestDisplay();

        showToast("Dinlenme bitti! Başlayabilirsin 🔥");
      }

    }, 1000);
}


function updateRestDisplay() {

  document.getElementById("restTime").textContent =
    restSeconds;
}


function finishWorkout() {

  if (completedExercises === 0) {

    showToast("Önce en az bir hareket tamamla 💪");

    return;
  }

  stopWorkoutTimer();

  const data =
    getFitnessData();

  data.completedWorkouts++;

  data.totalExercises +=
    completedExercises;

  data.totalMinutes +=
    Math.max(
      1,
      Math.round(workoutSeconds / 60)
    );

  const today =
    getTodayString();

  if (!data.days.includes(today)) {
    data.days.push(today);
  }

  localStorage.setItem(
    "fitnessData",
    JSON.stringify(data)
  );

  updateStats();

  showToast("Antrenman tamamlandı! 🏆");

  setTimeout(() => {
    showPage("home");
  }, 1000);
}


function getFitnessData() {

  const saved =
    localStorage.getItem("fitnessData");

  if (saved) {

    try {
      return JSON.parse(saved);
    } catch (e) {}
  }

  return {
    completedWorkouts: 0,
    totalExercises: 0,
    totalMinutes: 0,
    days: []
  };
}


function updateStats() {

  const data =
    getFitnessData();

  const streak =
    calculateStreak(data.days);

  setText("streak", streak);
  setText("completed", data.completedWorkouts);
  setText("minutes", data.totalMinutes);
  setText("workouts", data.totalExercises);

  setText("statStreak", streak);
  setText("statCompleted", data.completedWorkouts);
  setText("statExercises", data.totalExercises);
  setText("statMinutes", data.totalMinutes);
  setText("statWater", getTodayWater());

  updateWeekDots(data.days);
}


function calculateStreak(days) {

  if (!days || days.length === 0) {
    return 0;
  }

  const uniqueDays =
    [...new Set(days)].sort().reverse();

  let streak = 0;

  let check =
    new Date();

  check.setHours(0,0,0,0);

  const today =
    getTodayString();

  if (!uniqueDays.includes(today)) {

    check.setDate(
      check.getDate() - 1
    );

    if (!uniqueDays.includes(
      dateToString(check)
    )) {
      return 0;
    }
  }

  for (let i = 0; i < uniqueDays.length; i++) {

    const expected =
      dateToString(check);

    if (uniqueDays.includes(expected)) {

      streak++;

      check.setDate(
        check.getDate() - 1
      );

    } else {

      break;
    }
  }

  return streak;
}


function renderWeekPlan() {

  const container =
    document.getElementById("weekPlan");

  if (!container) return;

  container.innerHTML = "";

  const today =
    new Date();

  let day =
    today.getDay();

  if (day === 0) day = 7;

  const monday =
    new Date(today);

  monday.setDate(
    today.getDate() - day + 1
  );

  monday.setHours(0,0,0,0);

  const trainingDays =
    createTrainingDays(selectedDays);

  for (let i = 0; i < 7; i++) {

    const date =
      new Date(monday);

    date.setDate(
      monday.getDate() + i
    );

    const isToday =
      dateToString(date) ===
      getTodayString();

    const isTraining =
      trainingDays[i];

    const div =
      document.createElement("div");

    div.className =
      "week-day" +
      (isToday ? " today" : "");

    div.innerHTML = `
      <div class="week-date">
        <b>${date.getDate()}</b>
        <small>${weekNames[i].substring(0,3)}</small>
      </div>

      <div class="week-info">
        <b>${isTraining ? getWorkoutName(i) : "Dinlenme Günü"}</b>
        <small>${isTraining ? "Antrenman günü" : "Vücudunu dinlendir"}</small>
      </div>

      <div class="week-status">
        ${isTraining ? "💪" : "😴"}
      </div>
    `;

    container.appendChild(div);
  }
}


function createTrainingDays(days) {

  const result =
    [false,false,false,false,false,false,false];

  const patterns = {
    3: [0,2,4],
    4: [0,1,3,5],
    5: [0,1,2,4,5],
    6: [0,1,2,3,4,5]
  };

  const pattern =
    patterns[days] || patterns[4];

  pattern.forEach(i => {
    result[i] = true;
  });

  return result;
}


function getWorkoutName(day) {

  const names = [
    "Göğüs + Triceps",
    "Bacak + Karın",
    "Dinlenme",
    "Sırt + Biceps",
    "Omuz + Karın",
    "Tüm Vücut",
    "Dinlenme"
  ];

  if (!createTrainingDays(selectedDays)[day]) {
    return "Dinlenme Günü";
  }

  return names[day];
}


function updateWeekDots(days) {

  const today =
    new Date();

  let day =
    today.getDay();

  if (day === 0) day = 7;

  const monday =
    new Date(today);

  monday.setDate(
    today.getDate() - day + 1
  );

  monday.setHours(0,0,0,0);

  for (let i = 0; i < 7; i++) {

    const date =
      new Date(monday);

    date.setDate(
      monday.getDate() + i
    );

    const circle =
      document.getElementById(
        "day" + (i + 1)
      );

    if (circle) {

      circle.classList.remove("done");

      if (
        days.includes(
          dateToString(date)
        )
      ) {
        circle.classList.add("done");
      }
    }
  }
}


function saveProfile() {

  const profile = {

    name:
      document.getElementById("userName").value.trim(),

    age:
      document.getElementById("userAge").value,

    gender:
      document.getElementById("userGender").value,

    height:
      document.getElementById("userHeight").value,

    weight:
      document.getElementById("userWeight").value,

    goal:
      document.getElementById("goal").value,

    level:
      selectedLevel,

    days:
      selectedDays
  };

  localStorage.setItem(
    "fitnessProfile",
    JSON.stringify(profile)
  );

  if (profile.weight) {

    const history =
      getWeightHistory();

    if (history.length === 0) {

      history.push({
        date: getTodayString(),
        weight: Number(profile.weight)
      });

      localStorage.setItem(
        "weightHistory",
        JSON.stringify(history)
      );
    }
  }

  updateHome();
  updateWeight();
  renderWeekPlan();
  calculateBMI();

  showToast("Profil kaydedildi! 💪");

}


function loadProfile() {

  const saved =
    localStorage.getItem("fitnessProfile");

  if (!saved) return;

  try {

    const p =
      JSON.parse(saved);

    setValue("userName", p.name);
    setValue("userAge", p.age);
    setValue("userGender", p.gender);
    setValue("userHeight", p.height);
    setValue("userWeight", p.weight);
    setValue("goal", p.goal);

    selectedLevel =
      p.level || "Başlangıç";

    selectedDays =
      p.days || 4;

    document.querySelectorAll(".level-choice")
      .forEach(btn => {

        btn.classList.remove("active");

        if (
          btn.textContent.includes(
            selectedLevel
          )
        ) {
          btn.classList.add("active");
        }
      });

    document.querySelectorAll(".days-choice button")
      .forEach(btn => {

        btn.classList.remove("selected");

        if (
          Number(btn.textContent) === selectedDays
        ) {
          btn.classList.add("selected");
        }
      });

    calculateBMI();

  } catch (e) {}
}


function chooseLevel(level, button) {

  selectedLevel = level;

  document.querySelectorAll(".level-choice")
    .forEach(x => x.classList.remove("active"));

  button.classList.add("active");
}


function chooseDays(days, button) {

  selectedDays = days;

  document.querySelectorAll(".days-choice button")
    .forEach(x => x.classList.remove("selected"));

  button.classList.add("selected");
}


function calculateBMI() {

  const height =
    Number(
      document.getElementById("userHeight").value
    );

  const weight =
    Number(
      document.getElementById("userWeight").value
    );

  const card =
    document.getElementById("bmiCard");

  if (!height || !weight) {

    card.classList.add("hidden");

    return;
  }

  const bmi =
    weight /
    Math.pow(height / 100, 2);

  document.getElementById("bmiValue").textContent =
    bmi.toFixed(1);

  let text =
    "Değer hesaplandı.";

  if (bmi < 18.5) {
    text = "Düşük aralık.";
  } else if (bmi < 25) {
    text = "Normal aralık.";
  } else if (bmi < 30) {
    text = "Yüksek aralık.";
  } else {
    text = "Daha yüksek aralık.";
  }

  document.getElementById("bmiText").textContent =
    text;

  card.classList.remove("hidden");
}


function addWeight() {

  const input =
    document.getElementById("weightInput");

  const weight =
    Number(input.value);

  if (!weight || weight <= 0) {

    showToast("Geçerli bir kilo gir.");

    return;
  }

  const history =
    getWeightHistory();

  history.push({
    date: getTodayString(),
    weight: weight
  });

  localStorage.setItem(
    "weightHistory",
    JSON.stringify(history)
  );

  const profile =
    getProfile();

  profile.weight =
    weight;

  localStorage.setItem(
    "fitnessProfile",
    JSON.stringify(profile)
  );

  input.value = "";

  updateWeight();
  updateHome();

  showToast("Kilon kaydedildi ⚖️");
}


function getWeightHistory() {

  const saved =
    localStorage.getItem("weightHistory");

  if (!saved) return [];

  try {
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}


function updateWeight() {

  const history =
    getWeightHistory();

  const profile =
    getProfile();

  const start =
    history.length
      ? history[0].weight
      : profile.weight || "-";

  const current =
    history.length
      ? history[history.length - 1].weight
      : profile.weight || "-";

  setText(
    "startWeight",
    start
  );

  setText(
    "currentWeight",
    current
  );

  setText(
    "targetWeight",
    profile.goal === "Kilo verme"
      ? "Hedef"
      : "-"
  );

  const container =
    document.getElementById("weightHistory");

  if (!container) return;

  container.innerHTML = "";

  history
    .slice()
    .reverse()
    .slice(0, 10)
    .forEach(item => {

      const row =
        document.createElement("div");

      row.className =
        "weight-history-row";

      row.innerHTML = `
        <small>${formatDate(item.date)}</small>
        <strong>${item.weight} kg</strong>
      `;

      container.appendChild(row);
    });

  if (history.length === 0) {

    container.innerHTML =
      `<p style="color:var(--muted);font-size:11px">
        Henüz kilo kaydı yok.
      </p>`;
  }
}


function addWater(amount) {

  const today =
    getTodayString();

  const data =
    getWaterData();

  if (data.date !== today) {

    data.date = today;
    data.amount = 0;
  }

  data.amount += amount;

  localStorage.setItem(
    "waterData",
    JSON.stringify(data)
  );

  updateWater();

  showToast("Su eklendi 💧");
}


function removeWater() {

  const data =
    getWaterData();

  data.amount =
    Math.max(
      0,
      data.amount - 250
    );

  localStorage.setItem(
    "waterData",
    JSON.stringify(data)
  );

  updateWater();
}


function getWaterData() {

  const saved =
    localStorage.getItem("waterData");

  const today =
    getTodayString();

  if (!saved) {
    return {
      date: today,
      amount: 0
    };
  }

  try {

    const data =
      JSON.parse(saved);

    if (data.date !== today) {

      return {
        date: today,
        amount: 0
      };
    }

    return data;

  } catch (e) {

    return {
      date: today,
      amount: 0
    };
  }
}


function getTodayWater() {

  return getWaterData().amount;
}


function updateWater() {

  const amount =
    getTodayWater();

  const target =
    calculateWaterTarget();

  const percent =
    Math.min(
      100,
      Math.round(
        (amount / target) * 100
      )
    );

  setText(
    "waterAmount",
    amount
  );

  setText(
    "waterTarget",
    target
  );

  setText(
    "waterPercent",
    percent + "%"
  );

  document.getElementById(
    "waterFill"
  ).style.width =
    percent + "%";
}


function calculateWaterTarget() {

  const profile =
    getProfile();

  const weight =
    Number(profile.weight);

  if (!weight) return 2500;

  return Math.round(
    weight * 35
  );
}


function updateHome() {

  const profile =
    getProfile();

  const name =
    profile.name || "Sporcu";

  setText(
    "homeName",
    name
  );

  setText(
    "homeLevel",
    (
      profile.level ||
      selectedLevel
    ).toUpperCase()
  );

  const isEquipment =
    currentType === "equipment";

  setText(
    "homeWorkout",
    isEquipment
      ? "Evde Aletli"
      : "Tüm Vücut"
  );

  setText(
    "homeWorkoutDesc",
    isEquipment
      ? "Dambıl ve ekipmanlarla"
      : "Evde ekipmansız antrenman"
  );

  setText(
    "homeExerciseCount",
    isEquipment
      ? equipmentExercises.length
      : bodyweightExercises.length
  );

  setText(
    "homeDate",
    new Intl.DateTimeFormat(
      "tr-TR",
      {
        weekday: "long",
        day: "numeric",
        month: "long"
      }
    ).format(new Date()).toUpperCase()
  );

  setText(
    "planTitle",
    profile.goal ||
    "Genel Fitness"
  );

  setText(
    "planDescription",
    (
      profile.level ||
      selectedLevel
    ) +
    " seviyesine uygun program"
  );
}


function randomMotivation() {

  const index =
    Math.floor(
      Math.random() *
      motivationTexts.length
    );

  setText(
    "motivationText",
    motivationTexts[index]
  );
}


function toggleTheme() {

  document.body.classList.toggle("dark");

  const dark =
    document.body.classList.contains("dark");

  localStorage.setItem(
    "darkMode",
    dark
  );

  setText(
    "themeBtn",
    dark ? "☀️" : "🌙"
  );
}


function loadTheme() {

  const dark =
    localStorage.getItem("darkMode") === "true";

  if (dark) {

    document.body.classList.add("dark");

    setText(
      "themeBtn",
      "☀️"
    );
  }
}


function resetAllData() {

  const answer =
    confirm(
      "Tüm fitness verileri, kilo geçmişi ve su kayıtları silinsin mi?"
    );

  if (!answer) return;

  localStorage.removeItem("fitnessData");
  localStorage.removeItem("fitnessProfile");
  localStorage.removeItem("weightHistory");
  localStorage.removeItem("waterData");
  localStorage.removeItem("fitnessProgram");

  location.reload();
}


function getProfile() {

  const saved =
    localStorage.getItem("fitnessProfile");

  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved);
  } catch (e) {
    return {};
  }
}


function getTodayString() {

  const date =
    new Date();

  return dateToString(date);
}


function dateToString(date) {

  return (
    date.getFullYear() +
    "-" +
    String(
      date.getMonth() + 1
    ).padStart(2, "0") +
    "-" +
    String(
      date.getDate()
    ).padStart(2, "0")
  );
}


function formatDate(dateString) {

  const parts =
    dateString.split("-");

  if (parts.length !== 3) {
    return dateString;
  }

  return (
    parts[2] +
    "." +
    parts[1] +
    "." +
    parts[0]
  );
}


function setText(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}


function setValue(id, value) {

  const element =
    document.getElementById(id);

  if (element && value !== undefined) {
    element.value = value;
  }
}


function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent =
    message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}
