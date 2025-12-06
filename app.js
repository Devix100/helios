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

        document.getElementById("ht-eff").textContent = d.ht_eff ?? "--";
        document.getElementById("ht-v").textContent = d.ht_v ?? "--";
        document.getElementById("rpm-ht").textContent = d.rpm_ht ?? "--";
        document.getElementById("mt-eff").textContent = d.mt_eff ?? "--";
        document.getElementById("mt-v").textContent = d.mt_v ?? "--";
        document.getElementById("rpm-mt").textContent = d.rpm_mt ?? "--";
        document.getElementById("teg-c").textContent = d.teg_c ?? "--";
		document.getElementById("teg-p").textContent = d.teg_p ?? "--";
		document.getElementById("teg-v").textContent = d.teg_v ?? "--";
		document.getElementById("total-v").textContent = d.total_v ?? "--";
		document.getElementById("temp-hot").textContent = d.temp_hot ?? "--";
		document.getElementById("temp-mid").textContent = d.temp_mid ?? "--";
		document.getElementById("sys-eff").textContent = d.sys_eff ?? "--";
		document.getElementById("timestamp-").textContent = d.timestamp ?? "--";

        // Update homepage main power
        document.getElementById("power-output").textContent = d.power_mw ?? "--";
    });

    console.log("Firebase connected.");
}