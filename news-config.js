// * FRX FRACTURE - LIVE NEWS CONFIG Edit this file to update the side notification without touching HTML. */

const CLAN_NEWS = {
    title: "CLAN UPDATE",
    message: "Weekend Trainings are now live. All members must NOT forget to join the Discord.",
    buttonText: "JOIN DISCORD",
    buttonLink: "https://discord.gg/nYF2F32E8T",
    active: false, // Set to false to hide the notification
    
    // UI Settings
    delay: 3500, // Time in milliseconds before it slides in (3.5 seconds)
    enableSound: true, // Set to false to mute the "ping"
    soundUrl: "https://assets.mixkit.co/active_storage/sfx/2861/2861-preview.mp3" // Tactical UI sound
};

// Initialize the logic
window.addEventListener("load", () => {
    // Check if the notification is active
    if (CLAN_NEWS.active) {
        initNewsNotification();
    }
});

/**
 * Injects data into the HTML and triggers the slide-in effect
 */
function initNewsNotification() {
    const modal = document.getElementById('newsModal');
    const title = document.getElementById('updateTitle');
    const text = document.getElementById('updateText');
    const link = document.getElementById('updateLink');

    // Ensure all elements exist before injecting data
    if (modal && title && text && link) {
        
        // Inject Data from the Config Object
        title.innerText = CLAN_NEWS.title;
        text.innerText = CLAN_NEWS.message;
        link.innerText = CLAN_NEWS.buttonText;
        link.href = CLAN_NEWS.buttonLink;

        // Slide in and Play Sound after the set delay
        setTimeout(() => {
            modal.classList.add('active');
            
            if (CLAN_NEWS.enableSound) {
                const audio = new Audio(CLAN_NEWS.soundUrl);
                audio.volume = 0.3; // Set volume to 30% (not too loud)
                
                // Browsers require a user interaction usually, 
                // but this catch prevents console errors if it's blocked.
                audio.play().catch(e => {
                    console.log("Audio notification blocked by browser autoplay policy.");
                });
            }
        }, CLAN_NEWS.delay);
    }
}

/**
 * Closes the notification panel
 */
function closeModal() {
    const modal = document.getElementById('newsModal');
    if (modal) {
        modal.classList.remove('active');
    }

}
