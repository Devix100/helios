/* ---------------- PAGE NAVIGATION ---------------- */

function showPage(pageId) {

    // Safety check: page exists
    const page = document.getElementById(pageId);
    if (!page) {
        console.warn("Page not found:", pageId);
        return;
    }

    // Hide all
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

    // Show selected
    page.classList.add("active");

    // Update nav active state
    document.querySelectorAll(".nav-link").forEach(a =>
        a.classList.toggle("active", a.dataset.page === pageId)
    );

    // Load Firebase only for DB page
    if (pageId === "database") {
        initFirebase();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---------------- NAV LINK EVENTS ---------------- */

document.querySelectorAll(".nav-link").forEach(a => {
    a.addEventListener("click", () => {
        showPage(a.dataset.page);

        // Close hamburger menu on mobile
        document.getElementById("nav-links").classList.remove("active");
    });
});

/* ---------------- HAMBURGER MENU ---------------- */

document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("nav-links").classList.toggle("active");
});

/* ---------------- LOGO CLICK ---------------- */

document.getElementById("logo").addEventListener("click", () => showPage("home"));

/* ---------------- CLOCK ---------------- */

function updateTime() {
    const now = new Date();
    document.getElementById("local-time").textContent = now.toLocaleTimeString();
    document.getElementById("local-date").textContent = now.toLocaleDateString();
}

setInterval(updateTime, 1000);
updateTime();

/* ---------------- FIREBASE ---------------- */

let firebaseInitialized = false;

function initFirebase() {
    if (firebaseInitialized) return;
    firebaseInitialized = true;

    console.log("Firebase initializing...");

    const firebaseConfig = {
        apiKey: "AIzaSyDpWcil6aYWVr8K8sMdtxj06LYV4haPCSc",
        authDomain: "helios-project-668af.firebaseapp.com",
        databaseURL: "https://helios-project-668af-default-rtdb.firebaseio.com",
        projectId: "helios-project-668af",
        storageBucket: "helios-project-668af.firebasestorage.app",
        messagingSenderId: "1069524493192",
        appId: "1:1069524493192:web:c3834fca6c3e9f02a2503d",
        measurementId: "G-PF0RZH87ES"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();
    const statusRef = db.ref("current_status");

    statusRef.on("value", snapshot => {
        const d = snapshot.val();
        if (!d) return;

        document.getElementById("ht-eff").textContent = round3(d.ht_eff) ?? "--";
        document.getElementById("ht-v").textContent = round3(d.ht_v) ?? "--";
        document.getElementById("rpm-ht").textContent = round3(d.rpm_ht) ?? "--";
        document.getElementById("mt-eff").textContent = round3(d.mt_eff) ?? "--";
        document.getElementById("mt-v").textContent = round3(d.mt_v) ?? "--";
        document.getElementById("rpm-mt").textContent = round3(d.rpm_mt) ?? "--";
        document.getElementById("teg-c").textContent = round3(d.teg_c) ?? "--";
		document.getElementById("teg-p").textContent = round3(d.teg_p) ?? "--";
		document.getElementById("teg-v").textContent = round3(d.teg_v) ?? "--";
		document.getElementById("total-v").textContent = round3(d.total_v) ?? "--";
		document.getElementById("temp-hot").textContent = round3(d.temp_hot) ?? "--";
		document.getElementById("temp-mid").textContent = round3(d.temp_mid) ?? "--";
		document.getElementById("sys-eff").textContent = round3(d.sys_eff) ?? "--";
		document.getElementById("timestamp-").textContent = d.timestamp ?? "--";

        // Update homepage main power
        document.getElementById("power-output").textContent = d.power_mw ?? "--";
    });

    console.log("Firebase connected.");

}

async function loadWeather() {
    if (!navigator.geolocation) {
        console.warn("Geolocation not supported.");
        return;
    }

    navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // Fetch weather from Open-Meteo
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=sunrise,sunset&timezone=auto`;
        
        const res = await fetch(url);
        const data = await res.json();

        document.getElementById("weather-temp").textContent =
            Math.round(data.current_weather.temperature);

        document.getElementById("sunrise").textContent = data.daily.sunrise[0].split("T")[1];
        document.getElementById("sunset").textContent = data.daily.sunset[0].split("T")[1];

        document.getElementById("weather-location").textContent =
            `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;

        // Simple icon
        const code = data.current_weather.weathercode;
        const icon =
            code === 0 ? "☀️" :
            code < 3 ? "⛅" :
            code < 60 ? "🌧️" :
            "⛈️";

        document.getElementById("weather-icon").textContent = icon;
    });
}

// run weather on startup
loadWeather();
