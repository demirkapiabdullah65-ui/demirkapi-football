let animals = JSON.parse(localStorage.getItem("animals")) || [];
let milkRecords = JSON.parse(localStorage.getItem("milkRecords")) || [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];

let settings = JSON.parse(localStorage.getItem("settings")) || {
    farmName: "Demirkapı Çiftliği",
    defaultPrice: 20
};


document.addEventListener("DOMContentLoaded", function () {

    const today = getToday();

    document.getElementById("milkDate").value = today;
    document.getElementById("saleDate").value = today;

    document.getElementById("defaultPrice").value =
        settings.defaultPrice || 20;

    document.getElementById("farmName").value =
        settings.farmName || "Demirkapı Çiftliği";

    document.getElementById("milkPrice").value =
        settings.defaultPrice || 20;

    updateAnimalSelect();

    renderAnimals();
    renderMilk();
    renderSales();

    updateDashboard();
    updateReports();

    calculateMilk();
});


/* =========================
   MENÜ
========================= */

function toggleMenu() {

    document.getElementById("sidebar")
        .classList.toggle("open");

}


function showPage(page) {

    document.querySelectorAll(".page")
        .forEach(p => p.classList.remove("active"));

    document.getElementById(page)
        .classList.add("active");

    document.getElementById("sidebar")
        .classList.remove("open");

    updateDashboard();
    updateReports();

}


/* =========================
   TARİH
========================= */

function getToday() {

    const date = new Date();

    const y = date.getFullYear();

    const m = String(date.getMonth() + 1).padStart(2, "0");

    const d = String(date.getDate()).padStart(2, "0");

    return `${y}-${m}-${d}`;
}


function formatDate(date) {

    if (!date) return "";

    const parts = date.split("-");

    if (parts.length !== 3) return date;

    return `${parts[2]}.${parts[1]}.${parts[0]}`;
}


/* =========================
   HAYVAN
========================= */

function addAnimal() {

    const tag =
        document.getElementById("animalTag").value.trim();

    const name =
        document.getElementById("animalName").value.trim();

    const breed =
        document.getElementById("animalBreed").value.trim();

    const birth =
        document.getElementById("animalBirth").value;

    if (!tag || !name) {

        showToast("Küpe no ve hayvan adı gerekli.");

        return;
    }

    const animal = {

        id: Date.now(),

        tag: tag,

        name: name,

        breed: breed,

        birth: birth

    };

    animals.push(animal);

    saveData();

    renderAnimals();

    updateAnimalSelect();

    document.getElementById("animalTag").value = "";
    document.getElementById("animalName").value = "";
    document.getElementById("animalBreed").value = "";
    document.getElementById("animalBirth").value = "";

    showToast("Hayvan kaydedildi.");

}


function deleteAnimal(id) {

    if (!confirm("Bu hayvanı silmek istediğine emin misin?")) {
        return;
    }

    animals = animals.filter(a => a.id !== id);

    saveData();

    renderAnimals();

    updateAnimalSelect();

    updateDashboard();

}


function renderAnimals() {

    const container =
        document.getElementById("animalList");

    if (!animals.length) {

        container.innerHTML =
            `<div class="empty">Henüz hayvan eklenmedi.</div>`;

        return;
    }

    container.innerHTML = animals.map(animal => `

        <div class="animal-card">

            <div>

                <strong>
                    🐄 ${animal.name}
                </strong>

                <div>
                    Küpe: ${animal.tag}
                </div>

                <small>
                    ${animal.breed || "Irk belirtilmedi"}
                    ${animal.birth ? " • " + formatDate(animal.birth) : ""}
                </small>

            </div>

            <button
                class="delete-btn"
                onclick="deleteAnimal(${animal.id})"
            >
                🗑️ Sil
            </button>

        </div>

    `).join("");

}


function updateAnimalSelect() {

    const select =
        document.getElementById("milkAnimal");

    select.innerHTML =
        `<option value="">Hayvan seç</option>`;

    animals.forEach(animal => {

        select.innerHTML += `

            <option value="${animal.id}">
                ${animal.tag} - ${animal.name}
            </option>

        `;

    });

}


/* =========================
   SÜT HESAPLAMA
========================= */

document.addEventListener("input", function (e) {

    if (
        e.target.id === "milkAmount" ||
        e.target.id === "milkPrice"
    ) {

        calculateMilk();

    }

});


function calculateMilk() {

    const amount =
        Number(document.getElementById("milkAmount").value) || 0;

    const price =
        Number(document.getElementById("milkPrice").value) ||
        Number(settings.defaultPrice) ||
        0;

    const total = amount * price;

    document.getElementById("milkCalculatedTotal")
        .textContent = money(total);

}


/* =========================
   SÜT KAYDI EKLE
========================= */

function addMilk() {

    const date =
        document.getElementById("milkDate").value;

    const session =
        document.getElementById("milkSession").value;

    const animalId =
        document.getElementById("milkAnimal").value;

    const amount =
        Number(document.getElementById("milkAmount").value);

    let price =
        Number(document.getElementById("milkPrice").value);

    const fat =
        document.getElementById("milkFat").value;

    const protein =
        document.getElementById("milkProtein").value;

    const note =
        document.getElementById("milkNote").value.trim();


    if (!date || !animalId || !amount) {

        showToast("Tarih, hayvan ve süt miktarı gerekli.");

        return;
    }


    if (!price) {

        price =
            Number(settings.defaultPrice) || 0;

    }


    const total = amount * price;


    const animal =
        animals.find(a => String(a.id) === String(animalId));


    const record = {

        id: Date.now(),

        date: date,

        session: session,

        animalId: animalId,

        animalName: animal ? animal.name : "",

        animalTag: animal ? animal.tag : "",

        amount: amount,

        price: price,

        total: total,

        fat: fat,

        protein: protein,

        note: note

    };


    milkRecords.push(record);

    saveData();

    renderMilk();

    updateDashboard();

    updateReports();


    document.getElementById("milkAmount").value = "";
    document.getElementById("milkFat").value = "";
    document.getElementById("milkProtein").value = "";
    document.getElementById("milkNote").value = "";

    document.getElementById("milkPrice").value =
        settings.defaultPrice || 20;

    calculateMilk();

    showToast("Süt kaydı kaydedildi.");

}


/* =========================
   SÜT SİL
========================= */

function deleteMilk(id) {

    if (!confirm("Bu süt kaydını silmek istediğine emin misin?")) {
        return;
    }

    milkRecords =
        milkRecords.filter(item => item.id !== id);

    saveData();

    renderMilk();

    updateDashboard();

    updateReports();

    showToast("Süt kaydı silindi.");

}


/* =========================
   SÜT LİSTESİ
========================= */

function renderMilk() {

    const container =
        document.getElementById("milkList");

    if (!milkRecords.length) {

        container.innerHTML =
            `<div class="empty">Henüz süt kaydı yok.</div>`;

        return;
    }


    const sorted =
        [...milkRecords].sort(
            (a, b) => b.date.localeCompare(a.date)
        );


    container.innerHTML = sorted.map(item => `

        <div class="record">

            <div class="record-info">

                <strong>
                    ${item.session === "Sabah" ? "🌅" : "🌙"}
                    ${item.animalName}
                </strong>

                <small>
                    ${formatDate(item.date)}
                    • Küpe: ${item.animalTag}
                </small>

                <small>
                    ${item.amount} L ×
                    ${money(item.price)}
                </small>

            </div>


            <div class="record-money">

                <strong>
                    ${money(item.total)}
                </strong>

                <br>

                <small>
                    ${item.amount} L
                </small>

                <button
                    class="delete-btn"
                    onclick="deleteMilk(${item.id})"
                >
                    🗑️
                </button>

            </div>

        </div>

    `).join("");

}


/* =========================
   ANA SAYFA
========================= */

function updateDashboard() {

    const today =
        getToday();

    const currentMonth =
        today.substring(0, 7);


    const todayRecords =
        milkRecords.filter(
            r => r.date === today
        );


    const monthRecords =
        milkRecords.filter(
            r => r.date.startsWith(currentMonth)
        );


    const todayMilk =
        sum(todayRecords, "amount");


    const morningMilk =
        sum(
            todayRecords.filter(
                r => r.session === "Sabah"
            ),
            "amount"
        );


    const eveningMilk =
        sum(
            todayRecords.filter(
                r => r.session === "Akşam"
            ),
            "amount"
        );


    const todayIncome =
        sum(todayRecords, "total");


    const monthMilk =
        sum(monthRecords, "amount");


    const monthIncome =
        sum(monthRecords, "total");


    document.getElementById("todayMilk")
        .textContent = number(todayMilk) + " L";


    document.getElementById("morningMilk")
        .textContent = number(morningMilk) + " L";


    document.getElementById("eveningMilk")
        .textContent = number(eveningMilk) + " L";


    document.getElementById("todayIncome")
        .textContent = money(todayIncome);


    document.getElementById("monthMilk")
        .textContent = number(monthMilk) + " L";


    document.getElementById("monthIncome")
        .textContent = money(monthIncome);


    document.getElementById("animalCount")
        .textContent = animals.length;


    renderRecentMilk();

}


/* =========================
   SON KAYITLAR
========================= */

function renderRecentMilk() {

    const container =
        document.getElementById("recentMilk");

    const records =
        [...milkRecords]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);


    if (!records.length) {

        container.innerHTML =
            `<div class="empty">Henüz süt kaydı yok.</div>`;

        return;
    }


    container.innerHTML =
        records.map(item => `

        <div class="record">

            <div class="record-info">

                <strong>
                    ${item.animalName}
                    - ${item.session}
                </strong>

                <small>
                    ${formatDate(item.date)}
                </small>

            </div>

            <div class="record-money">

                <strong>
                    ${item.amount} L
                </strong>

                <br>

                <small>
                    ${money(item.total)}
                </small>

            </div>

        </div>

    `).join("");

}


/* =========================
   SATIŞ
========================= */

function calculateSale() {

    const amount =
        Number(document.getElementById("saleAmount").value) || 0;

    const price =
        Number(document.getElementById("salePrice").value) || 0;

    document.getElementById("saleTotal")
        .textContent = money(amount * price);

}


function addSale() {

    const date =
        document.getElementById("saleDate").value;

    const customer =
        document.getElementById("saleCustomer").value.trim();

    const amount =
        Number(document.getElementById("saleAmount").value);

    const price =
        Number(document.getElementById("salePrice").value);

    const note =
        document.getElementById("saleNote").value.trim();


    if (!date || !amount || !price) {

        showToast("Tarih, litre ve fiyat gerekli.");

        return;
    }


    const total =
        amount * price;


    sales.push({

        id: Date.now(),

        date: date,

        customer: customer,

        amount: amount,

        price: price,

        total: total,

        note: note

    });


    saveData();

    renderSales();

    updateReports();

    document.getElementById("saleAmount").value = "";
    document.getElementById("salePrice").value = "";
    document.getElementById("saleCustomer").value = "";
    document.getElementById("saleNote").value = "";

    calculateSale();

    showToast("Satış kaydedildi.");

}


function deleteSale(id) {

    if (!confirm("Bu satışı silmek istediğine emin misin?")) {
        return;
    }

    sales =
        sales.filter(s => s.id !== id);

    saveData();

    renderSales();

    updateReports();

}


function renderSales() {

    const container =
        document.getElementById("salesList");

    if (!sales.length) {

        container.innerHTML =
            `<div class="empty">Henüz satış yok.</div>`;

        return;
    }


    const sorted =
        [...sales].sort(
            (a, b) => b.date.localeCompare(a.date)
        );


    container.innerHTML =
        sorted.map(sale => `

        <div class="record">

            <div class="record-info">

                <strong>
                    ${sale.customer || "Müşteri belirtilmedi"}
                </strong>

                <small>
                    ${formatDate(sale.date)}
                    • ${sale.amount} L
                </small>

                <small>
                    ${money(sale.price)} / L
                </small>

            </div>

            <div class="record-money">

                <strong>
                    ${money(sale.total)}
                </strong>

                <button
                    class="delete-btn"
                    onclick="deleteSale(${sale.id})"
                >
                    🗑️
                </button>

            </div>

        </div>

    `).join("");

}


/* =========================
   RAPORLAR
========================= */

function updateReports() {

    const today =
        getToday();

    const month =
        today.substring(0, 7);


    const monthRecords =
        milkRecords.filter(
            r => r.date.startsWith(month)
        );


    const totalMilk =
        sum(monthRecords, "amount");


    const totalIncome =
        sum(monthRecords, "total");


    const days =
        new Set(
            monthRecords.map(r => r.date)
        ).size;


    const average =
        days ? totalMilk / days : 0;


    document.getElementById("reportTotalMilk")
        .textContent = number(totalMilk) + " L";


    document.getElementById("reportAverageMilk")
        .textContent = number(average) + " L";


    document.getElementById("reportTotalSales")
        .textContent = money(totalIncome);


    const soldMilk =
        sales
        .filter(s => s.date.startsWith(month))
        .reduce(
            (total, s) => total + Number(s.amount || 0),
            0
        );


    document.getElementById("reportSoldMilk")
        .textContent = number(soldMilk) + " L";

}


function generateReport() {

    const start =
        document.getElementById("reportStart").value;

    const end =
        document.getElementById("reportEnd").value;


    if (!start || !end) {

        showToast("Başlangıç ve bitiş tarihi seç.");

        return;
    }


    const records =
        milkRecords.filter(
            r => r.date >= start && r.date <= end
        );


    const totalMilk =
        sum(records, "amount");


    const totalIncome =
        sum(records, "total");


    const days =
        new Set(records.map(r => r.date)).size;


    const average =
        days ? totalMilk / days : 0;


    document.getElementById("reportResult").innerHTML = `

        <div class="report-box">

            <h3>📊 Rapor Sonucu</h3>

            <p>
                🥛 Toplam süt:
                <strong>${number(totalMilk)} L</strong>
            </p>

            <p>
                💰 Toplam gelir:
                <strong>${money(totalIncome)}</strong>
            </p>

            <p>
                📈 Günlük ortalama:
                <strong>${number(average)} L</strong>
            </p>

            <p>
                📝 Süt kayıt sayısı:
                <strong>${records.length}</strong>
            </p>

        </div>

    `;

}


/* =========================
   AYARLAR
========================= */

function saveSettings() {

    settings.farmName =
        document.getElementById("farmName").value ||
        "Demirkapı Çiftliği";


    settings.defaultPrice =
        Number(
            document.getElementById("defaultPrice").value
        ) || 0;


    localStorage.setItem(
        "settings",
        JSON.stringify(settings)
    );


    document.getElementById("milkPrice").value =
        settings.defaultPrice;


    showToast("Ayarlar kaydedildi.");

}


/* =========================
   YEDEKLEME
========================= */

function exportData() {

    const data = {

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


    const a =
        document.createElement("a");


    a.href = url;

    a.download =
        "demirkapi-sut-yedek.json";

    a.click();


    URL.revokeObjectURL(url);

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


            animals =
                data.animals || [];


            milkRecords =
                data.milkRecords || [];


            sales =
                data.sales || [];


            settings =
                data.settings || settings;


            saveData();


            renderAnimals();

            renderMilk();

            renderSales();

            updateAnimalSelect();

            updateDashboard();

            updateReports();


            document.getElementById("defaultPrice").value =
                settings.defaultPrice || 0;


            document.getElementById("farmName").value =
                settings.farmName || "Demirkapı Çiftliği";


            showToast("Yedek geri yüklendi.");

        }

        catch {

            showToast("Yedek dosyası okunamadı.");

        }

    };


    reader.readAsText(file);

}


/* =========================
   LOCAL STORAGE
========================= */

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


/* =========================
   YARDIMCI
========================= */

function sum(array, key) {

    return array.reduce(
        (total, item) =>
            total + Number(item[key] || 0),
        0
    );

}


function number(value) {

    return Number(value || 0)
        .toLocaleString("tr-TR", {
            maximumFractionDigits: 2
        });

}


function money(value) {

    return Number(value || 0)
        .toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " TL";

}


function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;

    toast.style.display = "block";


    setTimeout(() => {

        toast.style.display = "none";

    }, 2500);

}
