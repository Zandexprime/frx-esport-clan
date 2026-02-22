const WAR_DATA = {
    totalWins: 0,
    totalLosses: 0,
    matches: [
        {
            type: "INTERNAL SCRIM",
            team1: { name: "FRX CLAN 1", logo: "logo-c1.jpg", result: "WIN" },
            team2: { name: "FRX CLAN 2", logo: "logo-c2.jpg", result: "LOSS" },
            score: "0 - 0",
            date: "FEB 21, 2026",
            isWin: true
        },
        {
            type: "INTERNAL WAR",
            team1: { name: "FRX CLAN 1", logo: "logo-c1.jpg", result: "WIN" },
            team2: { name: "FRX CLAN 2", logo: "logo-c2.jpg", result: "LOSS" },
            score: "0 - 0",
            date: "FEB 21, 2026",
            isWin: true
        },
        {
            type: "EXTERNAL SCRIM",
            team1: { name: "FRX CLAN 1", logo: "logo-c1.jpg", result: "WIN" },
            team2: { name: "FRX CLAN 2", logo: "logo-c2.jpg", result: "LOSS" },
            score: "0 - 0",
            date: "FEB 21, 2026",
            isWin: true
        },
        {
            type: "EXTERNAL WAR",
            team1: { name: "FRX ELITE", logo: "logo-c1.jpg", result: "WIN" },
            team2: { name: "TEAM X", logo: "enemy-logo.jpg", result: "LOSS" },
            score: "0 - 0",
            date: "FEB 15, 2026",
            isWin: true
        }
    ]
};

window.addEventListener("load", () => {
    // 1. Inject Stats
    const statsContainer = document.getElementById('war-stats-container');
    const winRate = ((WAR_DATA.totalWins / (WAR_DATA.totalWins + WAR_DATA.totalLosses)) * 100).toFixed(0);
    
    statsContainer.innerHTML = `
        <div class="stat-card"><span class="stat-number">${WAR_DATA.totalWins}</span><span class="stat-desc">Wins</span></div>
        <div class="stat-card"><span class="stat-number">${WAR_DATA.totalLosses}</span><span class="stat-desc">Losses</span></div>
        <div class="stat-card"><span class="stat-number">${winRate}%</span><span class="stat-desc">Win Rate</span></div>
    `;

    // 2. Inject Match Cards
    const cardsContainer = document.getElementById('war-cards-container');
    cardsContainer.innerHTML = WAR_DATA.matches.map(match => `
        <div class="war-card ${match.isWin ? 'win' : 'loss'}">
            <div class="team-box">
                <img src="${match.team1.logo}" alt="Team 1">
                <h4 style="font-size: 0.8rem; margin-top: 10px;">${match.team1.name}</h4>
                <span class="status-label ${match.team1.result === 'WIN' ? 'status-win' : 'status-loss'}">${match.team1.result}</span>
            </div>

            <div class="score-box">
                <div class="vs-text">${match.type}</div>
                <div class="score">${match.score}</div>
                <div style="font-size: 0.6rem; color: #555; font-family: 'Orbitron';">${match.date}</div>
            </div>

            <div class="team-box">
                <img src="${match.team2.logo}" alt="Team 2">
                <h4 style="font-size: 0.8rem; margin-top: 10px;">${match.team2.name}</h4>
                <span class="status-label ${match.team2.result === 'WIN' ? 'status-win' : 'status-loss'}">${match.team2.result}</span>
            </div>
        </div>
    `).join('');
});