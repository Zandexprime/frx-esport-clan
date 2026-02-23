const SYSTEM_CONFIG = {
    tournamentOpen: false, 
};

function handleTournamentAccess(event) {
    if (!SYSTEM_CONFIG.tournamentOpen) {
        event.preventDefault(); // Stops the link from opening tournament.html
        const modal = document.getElementById('pending-modal');
        if (modal) {
            modal.classList.add('active');
        }
    }
}

function closePending() {
    const modal = document.getElementById('pending-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}