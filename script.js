let currentWorkout = [];
let currentType = "";
let completedExercises = 0;
let restTimer = null;

const bodyweightExercises = [
  {
    name: "Squat",
    icon: "🦵",
    sets: "4 set × 15 tekrar",
    desc: "Bacak ve kalça"
  },
  {
    name: "Şınav",
    icon: "💪",
    sets: "4 set × 10 tekrar",
    desc: "Göğüs ve triceps"
  },
  {
    name: "Lunge",
    icon: "🦵",
    sets: "3 set × 12 tekrar",
    desc: "Bacak ve kalça"
  },
  {
    name: "Plank",
    icon: "🔥",
    sets: "3 set × 30 saniye",
    desc: "Karın ve core"
  },
  {
    name: "Mountain Climber",
    icon: "🏃",
    sets: "3 set × 30 saniye",
    desc: "Kondisyon ve karın"
  },
  {
    name: "Mekik",
    icon: "💪",
    sets: "3 set × 15 tekrar",
    desc: "Karın kasları"
  }
];

const equipmentExercises = [
  {
    name: "Dambıl Goblet Squat",
    icon: "🏋️",
    sets: "4 set × 12 tekrar",
    desc: "Bacak ve kalça"
  },
  {
    name: "Dambıl Bench Press",
    icon: "💪",
    sets: "4 set × 10 tekrar",
    desc: "Göğüs"
  },
  {
    name: "Dambıl Row",
    icon: "🏋️",
    sets: "4 set × 10 tekrar",
    desc: "Sırt"
  },
  {
    name: "Dambıl Shoulder Press",
    icon: "💪",
    sets: "3 set × 12 tekrar",
    desc: "Omuz"
  },
  {
    name: "Dambıl Curl",
    icon: "💪",
    sets: "3 set × 12 tekrar",
    desc: "Biceps"
  },
  {
    name: "Dambıl Triceps",
    icon: "🏋️",
    sets: "3 set × 12 tekrar",
    desc: "Triceps"
  }
];

document.addEventListener("DOMContentLoaded", function () {
  updateStats();
  updateToday();
  loadSettings();
});

function showPage(pageId, button) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = document.getElementById(pageId);

  if (page) {
    page.classList.add("active");
  }

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.remove("active");
  });

  if (button) {
    button.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function openWorkout(type) {

  currentType = type;

  if (type === "bodyweight") {
    currentWorkout = bodyweightExercises.map(x => ({...x}));
    document.getElementById("workoutType").textContent = "ALETSİZ ANTRENMAN";
    document.getElementById("workoutTitle").textContent = "Tüm Vücut";
  } else {
    currentWorkout = equipmentExercises.map(x => ({...x}));
    document.getElementById("workoutType").textContent = "ALETLİ ANTRENMAN";
    document.getElementById("workoutTitle").textContent = "Evde Aletli";
  }

  completedExercises = 0;

  renderExercises();
  updateProgress();

  showPage("workout");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function renderExercises() {

  const container = document.getElementById("exerciseList");

  container.innerHTML = "";

  currentWorkout.forEach((exercise, index) => {

    const div = document.createElement("div");

    div.className = "exercise";

    div.id = "exercise-" + index;

    div.innerHTML = `
      <div class="exercise-icon">${exercise.icon}</div>

      <div class="exercise-info">
        <h3>${exercise.name}</h3>
        <p>${exercise.sets} • ${exercise.desc}</p>
      </div>

      <button class="exercise-check"
        onclick="completeExercise(${index})">
        ✓
      </button>
    `;

    container.appendChild(div);
  });
}

function completeExercise(index) {

  const exercise = document.getElementById("exercise-" + index);

  if (!exercise) return;

  if (exercise.classList.contains("done")) {
    exercise.classList.remove("done");
    completedExercises--;
  } else {
    exercise.classList.add("done");
    completedExercises++;
  }

  updateProgress();
}

function updateProgress() {

  const total = currentWorkout.length;

  document.getElementById("progressText").textContent =
    completedExercises + " / " + total;

  const percent = total === 0
    ? 0
    : (completedExercises / total) * 100;

  document.getElementById("progressFill").style.width =
    percent + "%";
}

function finishWorkout() {

  if (completedExercises === 0) {
    showToast("Önce en az bir hareket tamamla 💪");
    return;
  }

  let data = getData();

  data.completedWorkouts++;
  data.totalExercises += completedExercises;
  data.totalMinutes += 25;

  const today = new Date().toISOString().split("T")[0];

  if (!data.days.includes(today)) {
    data.days.push(today);
  }

  localStorage.setItem("fitnessData", JSON.stringify(data));

  updateStats();

  showToast("Antrenman tamamlandı! 🔥");

  setTimeout(() => {
    showPage("home");
  }, 900);
}

function getData() {

  const saved = localStorage.getItem("fitnessData");

  if (saved) {
    return JSON.parse(saved);
  }

  return {
    completedWorkouts: 0,
    totalExercises: 0,
    totalMinutes: 0,
    days: []
  };
}

function updateStats() {

  const data = getData();

  const streak = calculateStreak(data.days);

  document.getElementById("streak").textContent = streak;
  document.getElementById("completed").textContent = data.completedWorkouts;
  document.getElementById("minutes").textContent = data.totalMinutes;
  document.getElementById("workouts").textContent = data.completedWorkouts;

  document.getElementById("statStreak").textContent = streak;
  document.getElementById("statCompleted").textContent = data.completedWorkouts;
  document.getElementById("statMinutes").textContent =
    data.totalMinutes + " dk";
  document.getElementById("statExercises").textContent =
    data.totalExercises;

  updateWeek(data.days);
}

function calculateStreak(days) {

  if (!days.length) return 0;

  const dates = days
    .map(date => new Date(date))
    .sort((a, b) => b - a);

  const today = new Date();

  today.setHours(0,0,0,0);

  const latest = dates[0];

  latest.setHours(0,0,0,0);

  const difference =
    Math.floor(
      (today - latest) / (1000 * 60 * 60 * 24)
    );

  if (difference > 1) {
    return 0;
  }

  let streak = 1;

  for (let i = 0; i < dates.length - 1; i++) {

    dates[i].setHours(0,0,0,0);
    dates[i + 1].setHours(0,0,0,0);

    const diff =
      Math.floor(
        (dates[i] - dates[i + 1]) /
        (1000 * 60 * 60 * 24)
      );

    if (diff === 1) {
      streak++;
    } else if (diff > 1) {
      break;
    }
  }

  return streak;
}

function updateWeek(days) {

  const today = new Date();

  let day = today.getDay();

  if (day === 0) day = 7;

  const monday = new Date(today);

  monday.setDate(today.getDate() - day + 1);
  monday.setHours(0,0,0,0);

  for (let i = 0; i < 7; i++) {

    const date = new Date(monday);

    date.setDate(monday.getDate() + i);

    const dateString =
      date.toISOString().split("T")[0];

    const circle =
      document.getElementById("day" + (i + 1));

    if (circle) {

      circle.classList.remove("done");

      if (days.includes(dateString)) {
        circle.classList.add("done");
      }
    }
  }
}

function startRest() {

  if (restTimer) return;

  let seconds = 60;

  const button =
    document.querySelector(".rest-box button");

  button.textContent = seconds + " sn";

  restTimer = setInterval(() => {

    seconds--;

    button.textContent = seconds + " sn";

    if (seconds <= 0) {

      clearInterval(restTimer);
      restTimer = null;

      button.textContent = "Hazır 💪";

      showToast("Dinlenme bitti! Başlayabilirsin 🔥");
    }

  }, 1000);
}

function updateToday() {

  const names = [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi"
  ];

  const today = new Date();

  document.getElementById("todayName").textContent =
    names[today.getDay()];

  const day = today.getDay();

  if (day === 2 || day === 5) {

    document.getElementById("todayWorkout").textContent =
      "Tüm Vücut";

    document.getElementById("todayDescription").textContent =
      "Evde ekipmansız antrenman";

  } else {

    document.getElementById("todayWorkout").textContent =
      "Fitness Programı";

    document.getElementById("todayDescription").textContent =
      "Bugünkü hareketlerini tamamla";
  }
}

function setDifficulty(level) {

  document.querySelectorAll(".difficulty")
    .forEach(button => {
      button.classList.remove("active-difficulty");
    });

  event.target.classList.add("active-difficulty");

  localStorage.setItem("difficulty", level);

  showToast(level + " seviyesi seçildi");
}

function toggleTheme() {

  document.body.classList.toggle("dark");

  const dark =
    document.body.classList.contains("dark");

  localStorage.setItem("darkMode", dark);

  document.querySelector(".theme-btn").textContent =
    dark ? "☀️" : "🌙";
}

function loadSettings() {

  const saved =
    localStorage.getItem("fitnessSettings");

  if (saved) {

    const data = JSON.parse(saved);

    document.getElementById("userName").value =
      data.name || "";

    document.getElementById("goal").value =
      data.goal || "Genel fitness";
  }

  const dark =
    localStorage.getItem("darkMode") === "true";

  if (dark) {

    document.body.classList.add("dark");

    document.querySelector(".theme-btn").textContent =
      "☀️";
  }
}

function saveSettings() {

  const data = {
    name: document.getElementById("userName").value,
    goal: document.getElementById("goal").value
  };

  localStorage.setItem(
    "fitnessSettings",
    JSON.stringify(data)
  );

  showToast("Ayarlar kaydedildi ✅");
}

function resetData() {

  const answer =
    confirm(
      "Tüm antrenman geçmişi ve istatistikler silinsin mi?"
    );

  if (!answer) return;

  localStorage.removeItem("fitnessData");

  updateStats();

  showToast("Veriler sıfırlandı");
}

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}
