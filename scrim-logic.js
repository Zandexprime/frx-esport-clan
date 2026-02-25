// 1. FIREBASE CONFIG
const firebaseConfig = {
    apiKey: "AIzaSyCfZ-RslzccvwMKoI07sWKQgOz0t0lESjI",
    authDomain: "frx-scrim.firebaseapp.com",
    databaseURL: "https://frx-scrim-default-rtdb.firebaseio.com",
    projectId: "frx-scrim",
    storageBucket: "frx-scrim.firebasestorage.app",
    messagingSenderId: "86915325223",
    appId: "1:86915325223:web:938887f57e23bf6db65d02",
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();

// 2. MASTER SYNC
db.ref("scrim_hub").on("value", (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    // RENDER MAIN SITE
    renderStatus(data.isOnline);
    renderIntel(data.mode, data.maps);
    renderNewsFeed(data.news);
    renderSlots(data.registrations, data.reg?.max);
    renderBanList(data.bannedUsers);
    renderLeaderboard(data.clans);

    // RENDER ADMIN HELPERS
    renderAdminNewsManager(data.news);
    renderAdminClanManager(data.clans);
});

// 3. RENDERERS (THE VISUALS)
function renderStatus(isOnline) {
    const mount = document.getElementById("status-mount");
    if (mount) {
        mount.innerHTML = `<div class="status-indicator" style="display:inline-flex; align-items:center; gap:8px; background:rgba(0,0,0,0.5); padding:6px 15px; border-radius:50px; border:1px solid ${isOnline ? "var(--neon)" : "#555"}">
            <div style="width:8px; height:8px; border-radius:50%; background:${isOnline ? "var(--neon)" : "#555"}; box-shadow:${isOnline ? "0 0 10px var(--neon)" : "none"}"></div>
            <span style="font-family:Orbitron; font-size:0.7rem;">SCRIM ${isOnline ? "ONLINE" : "OFFLINE"}</span></div>`;
    }
}

function renderNewsFeed(news) {
    const feed = document.getElementById("js-news-feed");
    if (!feed || !news) return;
    feed.innerHTML = Object.values(news).reverse().map(item => `
        <div class="news-item" style="display:flex; align-items:center; gap:15px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
            <small style="color:#555; font-size:0.6rem;">${item.date || 'NOW'}</small>
            <h4 style="color:var(--neon); font-size:0.8rem; margin:0;">${item.title}</h4>
            <p style="font-size:0.75rem; color:#aaa; margin:0; flex-grow:1; text-align:right;">${item.body}</p>
        </div>`).join("");
}

function renderBanList(bans) {
    const mount = document.getElementById("js-blacklist");
    if (!mount) return;
    mount.innerHTML = '<div class="tag" style="color:var(--red); border-color:var(--red);">BLACKLIST 💀</div>';
    if (!bans) return mount.innerHTML += `<div style="color:#555; font-size:0.7rem; padding:10px;">SYSTEM_CLEAN</div>`;
    
    Object.keys(bans).forEach(id => {
        const u = bans[id];
        mount.innerHTML += `<div style="color:var(--red); font-size:0.75rem; margin-bottom:6px; display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,0,0,0.1);">
            <span>${u.n} <small>(${u.r})</small></span>
            <button onclick="removeBan('${id}')" class="admin-only-btn" style="color:white; background:red; border:none; font-size:8px; cursor:pointer;">UNBAN</button>
        </div>`;
    });
}

// 4. ADMIN FUNCTIONS (THE ACTIONS)
function postNews() {
    const t = document.getElementById("new-news-title");
    const b = document.getElementById("new-news-body");
    if (!t.value || !b.value) return showToast("EMPTY FIELDS");

    db.ref("scrim_hub/news").push({
        title: t.value.toUpperCase(),
        body: b.value,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()
    }).then(() => { t.value = ""; b.value = ""; showToast("BROADCAST_SENT"); });
}

function deleteNews(id) {
    systemAlert("DELETE", "REMOVE THIS NEWS ITEM?", false, (confirmed) => {
        if (confirmed) db.ref("scrim_hub/news/" + id).remove().then(() => showToast("DELETED"));
    });
}

function addBan() {
    const n = document.getElementById("ban-player-name");
    const r = document.getElementById("ban-reason");
    if (!n.value) return showToast("ENTER NAME");
    db.ref("scrim_hub/bannedUsers").push({ n: n.value.toUpperCase(), r: r.value.toUpperCase() || "BANNED" })
    .then(() => { n.value = ""; r.value = ""; showToast("BANNED"); });
}

function removeBan(id) {
    systemAlert("UNBAN", "RESTORE THIS PLAYER?", false, (ok) => {
        if (ok) db.ref("scrim_hub/bannedUsers/" + id).remove().then(() => showToast("RESTORED"));
    });
}

async function updateLive() {
    const btn = document.getElementById("sync-btn");
    btn.innerText = "SYNCING...";
    try {
        await db.ref("scrim_hub").update({
            isOnline: document.getElementById("edit-online").value === "true",
            mode: document.getElementById("edit-mode").value.toUpperCase(),
            footerNews: document.getElementById("edit-footer-news").value,
            "reg/max": parseInt(document.getElementById("edit-slots").value) || 16
        });
        showToast("SYSTEM_SYNCED");
        btn.innerText = "SYNC_TO_SITE";
    } catch (e) { btn.innerText = "FAILED"; }
}

// 5. MODAL SYSTEM
function systemAlert(title, message, isPrompt = false, callback = null) {
    const modal = document.getElementById("scrim-modal");
    if (!modal) return;
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-body").innerText = message;
    const input = document.getElementById("modal-input");
    input.style.display = isPrompt ? "block" : "none";
    modal.style.display = "flex";
    document.getElementById("modal-confirm-btn").onclick = () => {
        const val = isPrompt ? input.value : true;
        if (callback) callback(val);
        closeModal();
    };
}

function closeModal() { document.getElementById("scrim-modal").style.display = "none"; }
function toggleAdmin() { 
    const p = document.getElementById("admin-panel");
    p.style.display = (p.style.display === "flex") ? "none" : "flex";
}
function showToast(msg) {
    const t = document.getElementById("admin-toast");
    t.innerText = msg; t.style.display = "block";
    setTimeout(() => t.style.display = "none", 3000);
}
// Auth
function checkAuth() {
    if (document.getElementById("admin-pass").value === "123456") {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("controls-section").style.display = "block";
        document.body.classList.add("is-admin");
    } else { systemAlert("DENIED", "WRONG CODE"); }
}

// Support Renderers (Internal)
function renderAdminNewsManager(news) {
    const mount = document.getElementById("js-admin-news-list");
    if (!mount || !news) return;
    mount.innerHTML = Object.keys(news).map(id => `
        <div style="display:flex; justify-content:space-between; background:#111; padding:5px; margin-top:2px; border-left:2px solid var(--neon);">
            <span style="font-size:0.6rem;">${news[id].title}</span>
            <button onclick="deleteNews('${id}')" style="color:red; background:none; border:none; cursor:pointer;">[X]</button>
        </div>`).join("");
}
