const NEWS_ITEMS = [
    { tag: "WAR ALERT", text: "FRX ELITE VS TEAM X - FEB 25TH @ 21:00" },
    { tag: "RECRUITMENT", text: "TRYOUTS ARE CURRENTLY OPEN" },
    { tag: "RANKING", text: "龙 GlORY REACHES TOP 100 REGIONAL SLAYERS" },
    { tag: "SYSTEM", text: "NEW WAR RECORDS PROTOCOL ESTABLISHED" }
];

window.addEventListener("load", () => {
    const tickerContainer = document.getElementById('news-ticker-content');
    if (tickerContainer) {
        // Double the array to make the scroll seamless
        const fullNews = [...NEWS_ITEMS, ...NEWS_ITEMS]; 
        tickerContainer.innerHTML = fullNews.map(item => `
            <div class="ticker-item">
                <span>[ ${item.tag} ]</span> ${item.text}
            </div>
        `).join('');
    }
});