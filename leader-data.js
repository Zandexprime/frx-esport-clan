const LEADERS = [
    {
        name: "龙 Zandex",
        role: "FOUNDER & OVERSEER",
        specialty: "Strategic Ops",
        image: "images/leader1.jpg", // Replace with actual image path
        color: "#00f2ff"
    },
    {
        name: "龙 Prime",
        role: "CLAN 1 VICE",
        specialty: "Tactical Trainer",
        image: "images/leader2.jpg",
        color: "#25d366"
    },
    {
        name: "龙 Shadow",
        role: "HEAD RECRUITER",
        specialty: "Personnel Intel",
        image: "images/leader3.jpg",
        color: "#ff0050"
    }
];

window.addEventListener("load", () => {
    const leaderGrid = document.getElementById('leader-grid');
    if (leaderGrid) {
        leaderGrid.innerHTML = LEADERS.map(leader => `
            <div class="leader-card" style="border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); padding: 30px; border-radius: 20px; text-align: center; backdrop-filter: blur(10px); transition: 0.3s;">
                <div style="width: 100px; height: 100px; margin: 0 auto 20px; border-radius: 50%; padding: 5px; border: 2px solid ${leader.color}; box-shadow: 0 0 15px ${leader.color}44;">
                    <img src="${leader.image}" alt="${leader.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; filter: grayscale(1) brightness(1.2);">
                </div>
                <h3 style="font-family: 'Orbitron'; font-size: 1rem; color: #fff; margin-bottom: 5px;">${leader.name}</h3>
                <p style="color: ${leader.color}; font-size: 0.6rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 15px;">${leader.role}</p>
                <div style="border-top: 1px solid rgba(255,255,255,0.05); pt-15px; margin-top: 15px;">
                    <p style="font-size: 0.7rem; color: #555; font-style: italic;">Specialty: ${leader.specialty}</p>
                </div>
            </div>
        `).join('');
    }
});