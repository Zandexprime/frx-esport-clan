/**
 * FRX FRACTURE - DATA ENGINE
 * Controls Recruitment/Registration status and the Leaderboard.
 */

const LEADERBOARD_CONFIG = {
    recruitmentOpen: true,  // Controls "JOIN TRYOUT GROUP" status
    registrationOpen: false, // Controls General Registration status
    members: [
        { name: "龙 _Ghost", kd: "12010", role: "Legend", status: "Online" },
        { name: "龙 Nono", kd: "11100", role: "Legend", status: "Online" },
        { name: "龙 riri", kd: "2141", role: "Legend", status: "Online" },
        { name: "龙 zandex", kd: "14201", role: "Legend", status: "In-Game" },
        { name: "龙 Viper", kd: "1214", role: "Grandmaster", status: "In-Game" },
        { name: "龙 Zelda", kd: "1214", role: "Grandmaster", status: "Offline" },
        { name: "龙 Death Note", kd: "11000", role: "Diamond", status: "Online" },
        { name: "龙 Matrix", kd: "1121", role: "Sliver", status: "Offline" }
    ]
};

window.addEventListener("load", () => {
    
    // 1. RECRUITMENT BADGE (For Recruitment Hub)
    const recruitBadge = document.getElementById('recruit-badge');
    if (recruitBadge) {
        if (LEADERBOARD_CONFIG.recruitmentOpen) {
            recruitBadge.innerHTML = `<span class="badge-dot pulse"></span> RECRUITMENT: OPEN`;
            recruitBadge.className = "recruit-badge open";
        } else {
            recruitBadge.innerHTML = `<span class="badge-dot"></span> RECRUITMENT: CLOSED`;
            recruitBadge.className = "recruit-badge closed";
        }
    }

    // 2. REGISTRATION BADGE (Optional)
    const regBadge = document.getElementById('reg-badge');
    if (regBadge) {
        if (LEADERBOARD_CONFIG.registrationOpen) {
            regBadge.innerHTML = `<span class="badge-dot pulse"></span> REGISTRATION: OPEN`;
            regBadge.className = "recruit-badge open";
        } else {
            regBadge.innerHTML = `<span class="badge-dot"></span> REGISTRATION: CLOSED`;
            regBadge.className = "recruit-badge closed";
        }
    }

    // 3. LEADERBOARD TABLE
    const tableBody = document.getElementById('leaderboard-body');
    if (tableBody) {
        const sortedMembers = [...LEADERBOARD_CONFIG.members].sort((a, b) => b.kd - a.kd);
        tableBody.innerHTML = "";
        sortedMembers.forEach((player, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td><span class="player-name">${player.name}</span></td>
                    <td><span class="kd-badge">${player.kd}</span></td>
                    <td>${player.role}</td>
                    <td><span class="status-dot ${player.status.toLowerCase()}"></span> ${player.status}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }
});