// 1. FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCfZ-RslzccvwMKoI07sWKQgOz0t0lESjI",
  authDomain: "frx-scrim.firebaseapp.com",
  databaseURL: "https://frx-scrim-default-rtdb.firebaseio.com",
  projectId: "frx-scrim",
  storageBucket: "frx-scrim.firebasestorage.app",
  messagingSenderId: "86915325223",
  appId: "1:86915325223:web:938887f57e23bf6db65d02",
  measurementId: "G-6HK0G3Z866"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. DEFAULT DATA HOLDER (Fallback if Firebase is empty)
let SCRIM_DATA = {
    isOnline: true,
    mode: "SQUAD FIGHT / BATTLE ROYAL",
    maps: "SHUTTER ISLAND",
    reg: { current: 0, max: 16 },
    rules: ["OFFICIAL FORMAT", "MAX 2 PC PLAYERS", "NO CHEATS/HACK"],
    bannedGuns: ["RPK", "M1887", "MAGNUM", "ORIGIN-12", "AKIMBO-UZI"],
    news: [
        {
            title: "SEASON 1 OPEN",
            body: "Registration is CLOSED.",
            date: "Feb 23"
        },
        {
            title: "SECURITY UPDATE",
            body: "Anti-cheat updated. Play fair or get blacklisted.",
            date: "Feb 21",
        },

        {
            title: "MAP ROTATION",
            body: "Shutter Island is the main map for this weekend.",
            date: "Feb 20",
        },
    ],

    clans: [
        { n: "ALPHA", w: 18, k: 250 },
        { n: "GHOST", w: 14, k: 195 },
        { n: "VULCAN", w: 10, k: 140 },
        { n: "ALPHA", w: 18, k: 250 },
        { n: "GHOST", w: 14, k: 195 },
        { n: "VULCAN", w: 10, k: 140 },
        { n: "ALPHA", w: 18, k: 250 },
        { n: "GHOST", w: 14, k: 195 },
        { n: "VULCAN", w: 10, k: 140 },
    ],

    bannedUsers: ["GREEDY MOPO (ESP)", "HACKER_X (AIM)"],

    footerNews: "STAY ALERT • NO TOXICITY • REGISTER NOW • ",
};

// 3. MASTER RENDER FUNCTION
function init() {
    if (!SCRIM_DATA || !SCRIM_DATA.mode) return;

    // A. Online Status
    const statusMount = document.getElementById("status-mount");
    if (statusMount) {
        statusMount.innerHTML = `
            <div class="status-indicator" style="display:inline-flex; align-items:center; gap:8px; background:rgba(0,0,0,0.5); padding:6px 15px; border-radius:50px; border:1px solid ${SCRIM_DATA.isOnline ? "var(--neon)" : "#555"}">
                <div style="width:8px; height:8px; border-radius:50%; background:${SCRIM_DATA.isOnline ? "var(--neon)" : "#555"}; box-shadow:${SCRIM_DATA.isOnline ? "0 0 10px var(--neon)" : "none"}"></div>
                <span style="font-family:Orbitron; font-size:0.7rem;">SCRIM ${SCRIM_DATA.isOnline ? "ONLINE" : "OFFLINE"}</span>
            </div>`;
    }

    // B. Left Panel (Intel, Rules, Guns)
    document.getElementById("js-info").innerHTML =
        `<div class="tag">INTEL</div><p>MODE: <b>${SCRIM_DATA.mode}</b></p><p>MAP: <b>${SCRIM_DATA.maps}</b></p>`;
    document.getElementById("js-rules").innerHTML =
        `<div class="tag">PROTOCOL</div>${SCRIM_DATA.rules.map((r) => `<div style="font-size:0.75rem; margin-bottom:5px; border-left:2px solid var(--neon); padding-left:8px;">${r}</div>`).join("")}`;
    document.getElementById("js-banned-guns").innerHTML =
        `<div class="tag">ARSENAL BANS 🚫</div>${SCRIM_DATA.bannedGuns.map((g) => `<span class="badge">${g}</span>`).join("")}`;

    // C. News Feed (Center)
    const newsFeed = document.getElementById("js-news-feed");
    if (newsFeed) {
        newsFeed.innerHTML = (SCRIM_DATA.news || [])
            .map(
                (item) => `
            <div class="news-item" style="border-bottom: 1px solid rgba(255,255,255,0.05); padding: 10px 0;">
                <small style="color:#555; font-size:0.7rem;">${item.date}</small>
                <h4 style="color:var(--neon); font-family:Orbitron; font-size:0.8rem; margin: 3px 0;">${item.title}</h4>
                <p style="font-size:0.8rem; color:#ccc; line-height:1.4;">${item.body}</p>
            </div>`,
            )
            .join("");
    }

    // D. Right Panel (Slots, Board, Blacklist)
    const per = (SCRIM_DATA.reg.current / SCRIM_DATA.reg.max) * 100;
    document.getElementById("js-slots").innerHTML =
        `<div class="tag">CAPACITY</div><div style="background:rgba(255,255,255,0.05); height:8px; border-radius:10px; overflow:hidden; margin-bottom:8px;"><div style="width:${per}%; background:var(--neon); height:100%; box-shadow:0 0 10px var(--neon)"></div></div><small>${SCRIM_DATA.reg.current}/${SCRIM_DATA.reg.max} SLOTS</small>`;
    document.getElementById("js-board").innerHTML = (SCRIM_DATA.clans || [])
        .map(
            (c) =>
                `<tr><td>${c.n}</td><td style="color:var(--neon)">${c.w}</td><td>${c.k}</td></tr>`,
        )
        .join("");
    document.getElementById("js-blacklist").innerHTML =
        `<div class="tag" style="color:var(--red)">BLACKLIST 💀</div>${(SCRIM_DATA.bannedUsers || []).map((u) => `<div style="color:var(--red); font-size:0.7rem; margin-bottom:4px;">${u}</div>`).join("")}`;

    // E. Footer
    document.getElementById("js-footer").innerHTML =
        `<div class="ticker-wrap" style="display:inline-block; white-space:nowrap; animation: scroll 20s linear infinite;">${SCRIM_DATA.footerNews}</div>`;

    // F. ADMIN NEWS MANAGER RENDER
    const adminNewsList = document.getElementById("js-admin-news-list");
    if (adminNewsList) {
        adminNewsList.innerHTML = (SCRIM_DATA.news || [])
            .map(
                (item, index) => `
            <div class="news-manage-item">
                <span>${item.title}</span>
                <button class="del-news-btn" onclick="deleteNews(${index})">DEL</button>
            </div>`,
            )
            .join("");
    }

    // G. Scrolling Logic
    document.body.style.overflowY = "visible";
    document.documentElement.style.overflowY = "visible";
}

// 4. FIREBASE REAL-TIME SYNC
db.ref("scrim_hub").on("value", (snapshot) => {
    const data = snapshot.val();
    if (data) {
        SCRIM_DATA = data;
        init();
    }
});

// 5. ADMIN CONTROLS & AUTH
function toggleAdmin() {
    const panel = document.getElementById("admin-panel");
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
}

function checkAuth() {
    const pass = document.getElementById("admin-pass").value;
    const alertBox = document.getElementById("custom-alert");
    if (pass === "1234") {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("controls-section").style.display = "block";
    } else {
        alertBox.style.display = "block";
    }
}

function closeAlert() {
    document.getElementById("custom-alert").style.display = "none";
}

// 6. LIVE UPDATE FUNCTIONS
function updateLive() {
    const updatedData = {
        ...SCRIM_DATA,
        isOnline: document.getElementById("edit-online").value === "true",
        reg: {
            current: parseInt(document.getElementById("edit-slots").value) || 0,
            max: SCRIM_DATA.reg.max,
        },
        mode: document.getElementById("edit-mode").value,
        footerNews: document.getElementById("edit-footer-news").value,
    };
    db.ref("scrim_hub").update(updatedData);
}

function postNews() {
    const titleIn = document.getElementById("new-news-title");
    const bodyIn = document.getElementById("new-news-body");
    if (!titleIn.value || !bodyIn.value) return alert("Fill all fields!");

    const newEntry = {
        title: titleIn.value.toUpperCase(),
        body: bodyIn.value,
        date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
    };

    if (!SCRIM_DATA.news) SCRIM_DATA.news = [];
    SCRIM_DATA.news.unshift(newEntry);
    if (SCRIM_DATA.news.length > 10) SCRIM_DATA.news.pop();

    db.ref("scrim_hub/news")
        .set(SCRIM_DATA.news)
        .then(() => {
            titleIn.value = "";
            bodyIn.value = "";
        });
}

function deleteNews(index) {
    if (confirm("Delete this news post?")) {
        SCRIM_DATA.news.splice(index, 1);
        db.ref("scrim_hub/news").set(SCRIM_DATA.news);
    }
}

// 7. DANGER ZONE
let clearTimer;
function armClear() {
    const container = document.getElementById("clear-container");
    container.innerHTML = `<button class="btn primary full" style="background:var(--red);" onclick="executeClear()">CONFIRM DELETE? (3s)</button>`;
    clearTimer = setTimeout(() => {
        resetClearBtn();
    }, 3000);
}

function resetClearBtn() {
    const container = document.getElementById("clear-container");
    container.innerHTML = `<button class="btn secondary full" id="clear-btn" onclick="armClear()">CLEAR LEADERBOARD</button>`;
}

function executeClear() {
    db.ref("scrim_hub/clans")
        .set([])
        .then(() => {
            resetClearBtn();
        });
}

window.onload = init;
