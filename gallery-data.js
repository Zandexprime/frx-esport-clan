const INTEL_FILES = [
    { id: "001", title: "WARZONE DOMINATION", cat: "INTEL_CLIP", file: "images/gallery/mvp_clip.mp4", isVid: true },
    { id: "002", title: "SQUAD_VICTORY_01", cat: "DATA_IMG", file: "images/gallery/squad_victory.jpg", isVid: false },
    { id: "003", title: "RECON_SIGHTS", cat: "DATA_IMG", file: "images/gallery/squad_victory2.jpg", isVid: false },
    { id: "004", title: "EXTRACTION_COMPLETE", cat: "DATA_IMG", file: "images/gallery/squad_victory3.jpg", isVid: false }
];

// --- GALLERY RENDERER ---
function initGameGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    grid.innerHTML = INTEL_FILES.map(item => `
        <div class="gallery-card" onclick="openIntel('${item.file}', ${item.isVid})">
            <div class="card-tag">ID_${item.id} // ${item.cat}</div>
            ${item.isVid 
                ? `<video muted loop playsinline><source src="${item.file}" type="video/mp4"></video>` 
                : `<img src="${item.file}" alt="${item.title}">`
            }
            <div style="position:absolute; bottom:15px; left:15px;">
                <h4 style="font-family:'Orbitron'; color:#fff; font-size:0.8rem; margin:0; letter-spacing:1px;">${item.title}</h4>
            </div>
        </div>
    `).join('');
}

// --- LIGHTBOX LOGIC ---
function openIntel(file, isVid) {
    const lb = document.getElementById('lightbox');
    const content = document.getElementById('lightbox-content');
    if (!lb || !content) return;
    
    lb.style.display = 'flex';
    content.innerHTML = isVid 
        ? `<video controls autoplay style="width:100%"><source src="${file}" type="video/mp4"></video>` 
        : `<img src="${file}" style="width:100%">`;
}



// --- TIMEZONE CONVERTER ---
function convertScheduleTimes() {
    const timeElements = document.querySelectorAll('.local-time');
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const viewer = document.getElementById('timezone-viewer');
    if(viewer) viewer.innerText = `[ SYSTEM DETECTED: ${userTimeZone.replace('_', ' ')} ]`;

    timeElements.forEach(el => {
        const baseTime = el.getAttribute('data-time'); 
        if (!baseTime) return;
        
        const [hours, minutes] = baseTime.split(':');
        const date = new Date();
        
        // Sets time relative to Nigeria Time (UTC+1)
        date.setUTCHours(hours - 1, minutes, 0); 

        const localTimeString = date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });

        el.innerText = localTimeString;
    });
}

// --- INITIALIZE ALL SYSTEMS ---
document.addEventListener('DOMContentLoaded', () => {
    initGameGallery();      // Load the Intel Archive
    convertScheduleTimes(); // Localize the Schedule
});