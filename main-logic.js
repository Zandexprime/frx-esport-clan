// 1. FIREBASE CONFIGURATION (Using your actual keys)
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

// 2. INITIALIZE FIREBASE
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// --- SETTINGS ---
const isRegClosed = true; // CHANGE TO 'false' TO OPEN REGISTRATION
const totalSlots = 160;

// 3. ACCESS CONTROL (For Scrim Hub)
function handleAccess() {
    if (isRegClosed) {
        const modal = document.getElementById('lock-modal');
        if(modal) modal.classList.add('active');
    } else {
        window.location.href = 'register.html';
    }
}

function closeModal() {
    const modal = document.getElementById('lock-modal');
    if(modal) modal.classList.remove('active');
}

// 4. ROSTER & SLOT TRACKER (Updates automatically)
const teamList = document.getElementById('team-list');
if (teamList) {
    database.ref('registrations').on('value', (snapshot) => {
        const data = snapshot.val();
        const entries = data ? Object.values(data) : [];
        
        // Update List
        teamList.innerHTML = entries.map(t => `
            <li><small>[${t.type}]</small> ${t.name}</li>
        `).join('');

        // Update Counter
        const slotCount = document.getElementById('slot-count');
        if(slotCount) slotCount.innerText = `${entries.length} / ${totalSlots}`;

        // Update Progress Bar
        const barFill = document.getElementById('bar-fill');
        if(barFill) {
            const percentage = (entries.length / totalSlots) * 100;
            barFill.style.width = percentage + "%";
        }
    });
}

// 5. ENROLLMENT LOGIC (For Register Page)
const regForm = document.getElementById('regForm');
if (regForm) {
    regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const regType = document.getElementById('regType').value;
        const regName = document.getElementById('regName').value.trim().toUpperCase();
        const regContact = document.getElementById('regContact').value.trim();

        database.ref('registrations').push({
            type: regType,
            name: regName,
            contact: regContact,
            timestamp: Date.now()
        }).then(() => {
            alert("SCRIM UPLINK SUCCESSFUL. PREPARE FOR DROPS.");
            window.location.href = 'tournament.html';
        }).catch((error) => {
            alert("UPLINK FAILED: " + error.message);
        });
    });

    // Dynamic Label Change
    document.getElementById('regType').addEventListener('change', (e) => {
        const label = document.getElementById('nameLabel');
        label.innerText = e.target.value === 'SOLO' ? 'PLAYER NAME' : 'SQUAD NAME';
    });
}

// 6. COUNTDOWN TIMER
const targetDate = new Date("March 15, 2026 18:00:00").getTime();
const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById("days");
    if (!daysEl) return; // Exit if not on the main page

    if (distance < 0) {
        clearInterval(timerInterval);
        daysEl.parentElement.parentElement.innerHTML = "SCRIM LIVE";
        return;
    }

    document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
}, 1000);