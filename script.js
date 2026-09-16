/* =====================================================
   DEMİRKAPI ÇİFTLİĞİ
   SÜT TAKİP UYGULAMASI
   ===================================================== */


/* ================= VERİLER ================= */

let animals = JSON.parse(localStorage.getItem("animals")) || [];

let milkRecords = JSON.parse(localStorage.getItem("milkRecords")) || [];

let sales = JSON.parse(localStorage.getItem("sales")) || [];

let settings = JSON.parse(localStorage.getItem("settings")) || {
  farmName: "Demirkapı Çiftliği",
  defaultPrice: 0
};


/* ================= BAŞLANGIÇ ================= */

document.addEventListener("DOMContentLoaded", function () {

  setDefaultDates();

  loadSettings();

  renderAnimals();

  renderMilkRecords();

  renderSales();

  updateDashboard();

  updateReports();

  updateAnimalSelect();

  setupSaleCalculator();

});


/* ================= MENÜ ================= */

function toggleMenu() {

  const menu = document.getElementById("sideMenu");

  menu.classList.toggle("open");

}


function showPage(pageId) {

  document.querySelectorAll(".page").forEach(function (page) {

    page.classList.remove("active");

  });


  const selectedPage = document.getElementById(pageId);

  if (selectedPage) {

    selectedPage.classList.add("active");

  }


  document.querySelectorAll(".bottom-nav button").forEach(function (button) {

    button.classList.remove("active");

  });


  const menu = document.getElementById("sideMenu");

  menu.classList.remove("open");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* ================= TARİH ================= */

function getToday() {

  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


function setDefaultDates() {

  const today = getToday();

  const milkDate = document.getElementById("milkDate");

  const saleDate = document.getElementById("saleDate");

  const reportStart = document.getElementById("reportStart");

  const reportEnd = document.getElementById("reportEnd");


  if (milkDate) milkDate.value = today;

  if (saleDate) saleDate.value = today;

  if (reportEnd) reportEnd.value = today;


  if (reportStart) {

    const date = new Date();

    date.setDate(1);

    reportStart.value = formatDateInput(date);

  }

}


function formatDateInput(date) {

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;

}


function formatDate(dateString) {

  if (!dateString) return "-";

  const parts = dateString.split("-");

  if (parts.length !== 3) return dateString;

  return `${parts[2]}.${parts[1]}.${parts[0]}`;

}


/* ================= HAYVAN ================= */

function openAnimalForm() {

  document.getElementById("animalForm").classList.remove("hidden");

  document.getElementById("animalTag").focus();

}


function closeAnimalForm() {

  document.getElementById("animalForm").classList.add("hidden");

}


function addAnimal() {

  const tag = document.getElementById("animalTag").value.trim();

  const name = document.getElementById("animalName").value.trim();

  const breed = document.getElementById("animalBreed").value.trim();

  const birth = document.getElementById("animalBirth").value;


  if (!tag) {

    showToast("Küpe numarasını gir.");

    return;

  }


  const exists = animals.some(function (animal) {

    return animal.tag.toLowerCase() === tag.toLowerCase();

  });


  if (exists) {

    showToast("Bu küpe numarası zaten kayıtlı.");

    return;

  }


  const animal = {

    id: Date.now(),

    tag: tag,

    name: name || "İsimsiz",

    breed: breed || "-",

    birth: birth || ""

  };


  animals.push(animal);

  saveData();


  renderAnimals();

  updateAnimalSelect();

  updateDashboard();


  document.getElementById("animalTag").value = "";

  document.getElementById("animalName").value = "";

  document.getElementById("animalBreed").value = "";

  document.getElementById("animalBirth").value = "";


  closeAnimalForm();


  showToast("Hayvan başarıyla eklendi.");

}


function deleteAnimal(id) {

  const animal = animals.find(function (item) {

    return item.id === id;

  });


  if (!animal) return;


  if (!confirm(`${animal.name} adlı hayvan silinsin mi?`)) {

    return;

  }


  animals = animals.filter(function (item) {

    return item.id !== id;

  });


  saveData();

  renderAnimals();

  updateAnimalSelect();

  updateDashboard();


  showToast("Hayvan silindi.");

}


function renderAnimals() {

  const container = document.getElementById("animalList");

  if (!container) return;


  if (animals.length === 0) {

    container.innerHTML = `
      <div class="empty">
        Henüz hayvan eklenmedi.
      </div>
    `;

    return;

  }


  container.innerHTML = animals.map(function (animal) {

    return `

      <div class="animal-card">

        <div class="animal-head">

          <div class="animal-icon">
            🐄
          </div>

          <div>

            <h3>${escapeHtml(animal.name)}</h3>

            <div class="animal-tag">
              Küpe: ${escapeHtml(animal.tag)}
            </div>

          </div>

        </div>


        <div class="animal-info">

          <p>
            <strong>Irk:</strong>
            ${escapeHtml(animal.breed)}
          </p>

          <p>
            <strong>Doğum:</strong>
            ${animal.birth ? formatDate(animal.birth) : "-"}
          </p>

        </div>


        <button
          class="delete-btn"
          onclick="deleteAnimal(${animal.id})"
        >
          🗑 Hayvanı Sil
        </button>

      </div>

    `;

  }).join("");

}


/* ================= HAYVAN SEÇİMİ ================= */

function updateAnimalSelect() {

  const select = document.getElementById("milkAnimal");

  if (!select) return;


  select.innerHTML = `
    <option value="">
      Genel Süt Kaydı
    </option>
  `;


  animals.forEach(function (animal) {

    const option = document.createElement("option");

    option.value = animal.id;

    option.textContent =
      `${animal.name} - ${animal.tag}`;

    select.appendChild(option);

  });

}


/* ================= SÜT KAYDI ================= */

function addMilkRecord() {

  const date =
    document.getElementById("milkDate").value;

  const session =
    document.getElementById("milkSession").value;

  const animalId =
    document.getElementById("milkAnimal").value;

  const amount =
    parseFloat(document.getElementById("milkAmount").value);

  const fat =
    parseFloat(document.getElementById("milkFat").value) || 0;

  const protein =
    parseFloat(document.getElementById("milkProtein").value) || 0;

  const note =
    document.getElementById("milkNote").value.trim();


  if (!date) {

    showToast("Tarih seç.");

    return;

  }


  if (!amount || amount <= 0) {

    showToast("Geçerli bir süt miktarı gir.");

    return;

  }


  const animal = animals.find(function (item) {

    return String(item.id) === String(animalId);

  });


  const record = {

    id: Date.now(),

    date: date,

    session: session,

    animalId: animalId || "",

    animalName: animal ? animal.name : "Genel",

    amount: amount,

    fat: fat,

    protein: protein,

    note: note

  };


  milkRecords.push(record);

  saveData();


  renderMilkRecords();

  updateDashboard();

  updateReports();


  document.getElementById("milkAmount").value = "";

  document.getElementById("milkFat").value = "";

  document.getElementById("milkProtein").value = "";

  document.getElementById("milkNote").value = "";


  showToast("Süt kaydı başarıyla eklendi.");

}


function deleteMilkRecord(id) {

  if (!confirm("Bu süt kaydı silinsin mi?")) {

    return;

  }


  milkRecords = milkRecords.filter(function (record) {

    return record.id !== id;

  });


  saveData();

  renderMilkRecords();

  updateDashboard();

  updateReports();


  showToast("Süt kaydı silindi.");

}


function renderMilkRecords() {

  const container =
    document.getElementById("milkList");

  if (!container) return;


  if (milkRecords.length === 0) {

    container.innerHTML = `
      <div class="empty">
        Henüz süt kaydı bulunmuyor.
      </div>
    `;

    return;

  }


  const records = [...milkRecords].sort(function (a, b) {

    return new Date(b.date) - new Date(a.date);

  });


  container.innerHTML = `

    <table class="data-table">

      <thead>

        <tr>

          <th>Tarih</th>

          <th>Sağım</th>

          <th>Hayvan</th>

          <th>Süt</th>

          <th>Yağ</th>

          <th>Protein</th>

          <th></th>

        </tr>

      </thead>


      <tbody>

        ${records.map(function (record) {

          return `

            <tr>

              <td>
                ${formatDate(record.date)}
              </td>

              <td>
                ${record.session}
              </td>

              <td>
                ${escapeHtml(record.animalName)}
              </td>

              <td>
                <strong>
                  ${formatNumber(record.amount)} L
                </strong>
              </td>

              <td>
                ${record.fat ? record.fat + "%" : "-"}
              </td>

              <td>
                ${record.protein ? record.protein + "%" : "-"}
              </td>

              <td>

                <button
                  class="delete-btn"
                  onclick="deleteMilkRecord(${record.id})"
                >
                  Sil
                </button>

              </td>

            </tr>

          `;

        }).join("")}

      </tbody>

    </table>

  `;

}


/* ================= SÜT TEMİZLE ================= */

function clearMilkRecords() {

  if (milkRecords.length === 0) {

    showToast("Silinecek kayıt yok.");

    return;

  }


  if (!confirm("Tüm süt kayıtları silinsin mi?")) {

    return;

  }


  milkRecords = [];

  saveData();

  renderMilkRecords();

  updateDashboard();

  updateReports();


  showToast("Süt kayıtları temizlendi.");

}


/* ================= SATIŞ ================= */

function setupSaleCalculator() {

  const amount =
    document.getElementById("saleAmount");

  const price =
    document.getElementById("salePrice");


  if (!amount || !price) return;


  amount.addEventListener("input", calculateSaleTotal);

  price.addEventListener("input", calculateSaleTotal);


  if (settings.defaultPrice) {

    price.value = settings.defaultPrice;

  }


  calculateSaleTotal();

}


function calculateSaleTotal() {

  const amount =
    parseFloat(document.getElementById("saleAmount").value) || 0;

  const price =
    parseFloat(document.getElementById("salePrice").value) || 0;


  const total = amount * price;


  const output =
    document.getElementById("saleTotal");


  if (output) {

    output.textContent =
      formatMoney(total);

  }

}


function addSale() {

  const date =
    document.getElementById("saleDate").value;

  const customer =
    document.getElementById("saleCustomer").value.trim();

  const amount =
    parseFloat(document.getElementById("saleAmount").value);

  const price =
    parseFloat(document.getElementById("salePrice").value);

  const note =
    document.getElementById("saleNote").value.trim();


  if (!date) {

    showToast("Tarih seç.");

    return;

  }


  if (!customer) {

    showToast("Alıcı adını gir.");

    return;

  }


  if (!amount || amount <= 0) {

    showToast("Süt miktarını gir.");

    return;

  }


  if (!price || price <= 0) {

    showToast("Litre fiyatını gir.");

    return;

  }


  const sale = {

    id: Date.now(),

    date: date,

    customer: customer,

    amount: amount,

    price: price,

    total: amount * price,

    note: note

  };


  sales.push(sale);

  saveData();


  renderSales();

  updateDashboard();

  updateReports();


  document.getElementById("saleCustomer").value = "";

  document.getElementById("saleAmount").value = "";

  document.getElementById("saleNote").value = "";


  calculateSaleTotal();


  showToast("Süt satışı kaydedildi.");

}


function deleteSale(id) {

  if (!confirm("Bu satış silinsin mi?")) {

    return;

  }


  sales = sales.filter(function (sale) {

    return sale.id !== id;

  });


  saveData();

  renderSales();

  updateDashboard();

  updateReports();


  showToast("Satış silindi.");

}


function renderSales() {

  const container =
    document.getElementById("salesList");

  if (!container) return;


  if (sales.length === 0) {

    container.innerHTML = `
      <div class="empty">
        Henüz satış kaydı bulunmuyor.
      </div>
    `;

    return;

  }


  const sorted = [...sales].sort(function (a, b) {

    return new Date(b.date) - new Date(a.date);

  });


  container.innerHTML = `

    <table class="data-table">

      <thead>

        <tr>

          <th>Tarih</th>

          <th>Alıcı</th>

          <th>Miktar</th>

          <th>Litre Fiyatı</th>

          <th>Toplam</th>

          <th></th>

        </tr>

      </thead>


      <tbody>

        ${sorted.map(function (sale) {

          return `

            <tr>

              <td>
                ${formatDate(sale.date)}
              </td>

              <td>
                ${escapeHtml(sale.customer)}
              </td>

              <td>
                ${formatNumber(sale.amount)} L
              </td>

              <td>
                ${formatMoney(sale.price)}
              </td>

              <td>
                <strong>
                  ${formatMoney(sale.total)}
                </strong>
              </td>

              <td>

                <button
                  class="delete-btn"
                  onclick="deleteSale(${sale.id})"
                >
                  Sil
                </button>

              </td>

            </tr>

          `;

        }).join("")}

      </tbody>

    </table>

  `;

}


/* ================= ANA SAYFA ================= */

function updateDashboard() {

  const today = getToday();

  const now = new Date();

  const currentMonth =
    now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0");


  const todayRecords =
    milkRecords.filter(function (record) {

      return record.date === today;

    });


  const morning =
    todayRecords
      .filter(function (record) {

        return record.session === "Sabah";

      })
      .reduce(function (sum, record) {

        return sum + Number(record.amount);

      }, 0);


  const evening =
    todayRecords
      .filter(function (record) {

        return record.session === "Akşam";

      })
      .reduce(function (sum, record) {

        return sum + Number(record.amount);

      }, 0);


  const todayTotal = morning + evening;


  const monthMilk =
    milkRecords
      .filter(function (record) {

        return record.date.startsWith(currentMonth);

      })
      .reduce(function (sum, record) {

        return sum + Number(record.amount);

      }, 0);


  const monthIncome =
    sales
      .filter(function (sale) {

        return sale.date.startsWith(currentMonth);

      })
      .reduce(function (sum, sale) {

        return sum + Number(sale.total);

      }, 0);


  setText("todayMilk", formatNumber(todayTotal) + " L");

  setText("morningMilk", formatNumber(morning) + " L");

  setText("eveningMilk", formatNumber(evening) + " L");

  setText("animalCount", animals.length);

  setText("monthMilk", formatNumber(monthMilk) + " L");

  setText("monthIncome", formatMoney(monthIncome));


  renderRecentMilk();

}


function renderRecentMilk() {

  const container =
    document.getElementById("recentMilk");

  if (!container) return;


  if (milkRecords.length === 0) {

    container.innerHTML = `
      <div class="empty">
        Henüz süt kaydı bulunmuyor.
      </div>
    `;

    return;

  }


  const records =
    [...milkRecords]
      .sort(function (a, b) {

        return b.id - a.id;

      })
      .slice(0, 5);


  container.innerHTML =
    records.map(function (record) {

      return `

        <div class="record">

          <div class="record-left">

            <div class="record-icon">
              🥛
            </div>

            <div>

              <div class="record-title">
                ${escapeHtml(record.animalName)}
                - ${record.session}
              </div>

              <div class="record-date">
                ${formatDate(record.date)}
              </div>

            </div>

          </div>


          <div class="record-amount">
            ${formatNumber(record.amount)} L
          </div>

        </div>

      `;

    }).join("");

}


/* ================= RAPORLAR ================= */

function updateReports() {

  const totalMilk =
    milkRecords.reduce(function (sum, record) {

      return sum + Number(record.amount);

    }, 0);


  const totalSales =
    sales.reduce(function (sum, sale) {

      return sum + Number(sale.total);

    }, 0);


  const soldMilk =
    sales.reduce(function (sum, sale) {

      return sum + Number(sale.amount);

    }, 0);


  const dates = new Set(
    milkRecords.map(function (record) {

      return record.date;

    })
  );


  const average =
    dates.size > 0
      ? totalMilk / dates.size
      : 0;


  setText(
    "reportTotalMilk",
    formatNumber(totalMilk) + " L"
  );


  setText(
    "reportAverageMilk",
    formatNumber(average) + " L"
  );


  setText(
    "reportTotalSales",
    formatMoney(totalSales)
  );


  setText(
    "reportSoldMilk",
    formatNumber(soldMilk) + " L"
  );

}


function generateReport() {

  const start =
    document.getElementById("reportStart").value;

  const end =
    document.getElementById("reportEnd").value;


  if (!start || !end) {

    showToast("Başlangıç ve bitiş tarihini seç.");

    return;

  }


  const filteredMilk =
    milkRecords.filter(function (record) {

      return record.date >= start &&
             record.date <= end;

    });


  const filteredSales =
    sales.filter(function (sale) {

      return sale.date >= start &&
             sale.date <= end;

    });


  const totalMilk =
    filteredMilk.reduce(function (sum, record) {

      return sum + Number(record.amount);

    }, 0);


  const soldMilk =
    filteredSales.reduce(function (sum, sale) {

      return sum + Number(sale.amount);

    }, 0);


  const income =
    filteredSales.reduce(function (sum, sale) {

      return sum + Number(sale.total);

    }, 0);


  const dates = new Set(
    filteredMilk.map(function (record) {

      return record.date;

    })
  );


  const average =
    dates.size > 0
      ? totalMilk / dates.size
      : 0;


  const result =
    document.getElementById("reportResult");


  result.innerHTML = `

    <h3>📊 Rapor Sonucu</h3>

    <p>
      <strong>Tarih:</strong>
      ${formatDate(start)}
      -
      ${formatDate(end)}
    </p>

    <br>

    <p>
      🥛 Toplam üretilen süt:
      <strong>${formatNumber(totalMilk)} L</strong>
    </p>

    <p>
      📅 Günlük ortalama:
      <strong>${formatNumber(average)} L</strong>
    </p>

    <p>
      🚚 Satılan süt:
      <strong>${formatNumber(soldMilk)} L</strong>
    </p>

    <p>
      💰 Satış geliri:
      <strong>${formatMoney(income)}</strong>
    </p>

  `;


  showToast("Rapor oluşturuldu.");

}


/* ================= AYARLAR ================= */

function loadSettings() {

  const farmName =
    document.getElementById("farmName");

  const defaultPrice =
    document.getElementById("defaultPrice");


  if (farmName) {

    farmName.value =
      settings.farmName || "Demirkapı Çiftliği";

  }


  if (defaultPrice) {

    defaultPrice.value =
      settings.defaultPrice || "";

  }

}


function saveSettings() {

  const farmName =
    document.getElementById("farmName").value.trim();


  const defaultPrice =
    parseFloat(
      document.getElementById("defaultPrice").value
    ) || 0;


  settings = {

    farmName:
      farmName || "Demirkapı Çiftliği",

    defaultPrice:
      defaultPrice

  };


  saveData();


  const priceInput =
    document.getElementById("salePrice");


  if (priceInput && settings.defaultPrice) {

    priceInput.value =
      settings.defaultPrice;

    calculateSaleTotal();

  }


  showToast("Ayarlar kaydedildi.");

}


/* ================= YEDEKLEME ================= */

function exportData() {

  const data = {

    version: 1,

    exportedAt: new Date().toISOString(),

    animals: animals,

    milkRecords: milkRecords,

    sales: sales,

    settings: settings

  };


  const blob =
    new Blob(
      [JSON.stringify(data, null, 2)],
      { type: "application/json" }
    );


  const url =
    URL.createObjectURL(blob);


  const link =
    document.createElement("a");


  link.href = url;

  link.download =
    "demirkapi-sut-yedek-" +
    getToday() +
    ".json";


  document.body.appendChild(link);

  link.click();

  link.remove();


  URL.revokeObjectURL(url);


  showToast("Yedek dosyası hazırlandı.");

}


function importData(event) {

  const file =
    event.target.files[0];


  if (!file) return;


  const reader =
    new FileReader();


  reader.onload = function (e) {

    try {

      const data =
        JSON.parse(e.target.result);


      if (!data || typeof data !== "object") {

        throw new Error();

      }


      animals =
        Array.isArray(data.animals)
          ? data.animals
          : [];


      milkRecords =
        Array.isArray(data.milkRecords)
          ? data.milkRecords
          : [];


      sales =
        Array.isArray(data.sales)
          ? data.sales
          : [];


      settings =
        data.settings || {
          farmName: "Demirkapı Çiftliği",
          defaultPrice: 0
        };


      saveData();


      loadSettings();

      renderAnimals();

      renderMilkRecords();

      renderSales();

      updateAnimalSelect();

      updateDashboard();

      updateReports();


      showToast("Yedek başarıyla geri yüklendi.");

    } catch (error) {

      showToast("Yedek dosyası geçersiz.");

    }

  };


  reader.readAsText(file);

}


/* ================= LOCAL STORAGE ================= */

function saveData() {

  localStorage.setItem(
    "animals",
    JSON.stringify(animals)
  );


  localStorage.setItem(
    "milkRecords",
    JSON.stringify(milkRecords)
  );


  localStorage.setItem(
    "sales",
    JSON.stringify(sales)
  );


  localStorage.setItem(
    "settings",
    JSON.stringify(settings)
  );

}


/* ================= YARDIMCI ================= */

function setText(id, value) {

  const element =
    document.getElementById(id);


  if (element) {

    element.textContent = value;

  }

}


function formatNumber(number) {

  return Number(number || 0).toLocaleString(
    "tr-TR",
    {
      maximumFractionDigits: 2
    }
  );

}


function formatMoney(number) {

  return Number(number || 0).toLocaleString(
    "tr-TR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ) + " ₺";

}


function escapeHtml(value) {

  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* ================= BİLDİRİM ================= */

let toastTimer;


function showToast(message) {

  const toast =
    document.getElementById("toast");


  if (!toast) return;


  toast.textContent = message;

  toast.classList.add("show");


  clearTimeout(toastTimer);


  toastTimer = setTimeout(function () {

    toast.classList.remove("show");

  }, 2500);

      }
