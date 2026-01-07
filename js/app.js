// App initialization
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderHome();
    renderAwards();
    renderMembers();
    renderHeatmap();
    renderWordClouds();
    renderQuotes();
});

// Navigation
function initNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;

            // Update nav buttons
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update pages
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`page-${page}`).classList.add('active');

            // Scroll to top
            document.getElementById(`page-${page}`).scrollTop = 0;
        });
    });
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Home Page
function renderHome() {
    // Stats
    document.getElementById('stat-messages').textContent = formatNumber(DATA.meta.totalMessages);

    const startYear = new Date(DATA.meta.startDate).getFullYear();
    const endYear = new Date(DATA.meta.endDate).getFullYear();
    document.getElementById('stat-years').textContent = `${endYear - startYear}+`;

    document.getElementById('stat-members').textContent = DATA.meta.members.length;

    // Bromance
    const [p1, p2] = DATA.bromance.pair;
    document.getElementById('bromance-names').innerHTML = `${p1} <span style="color: var(--accent-pink)">❤️</span> ${p2}`;
    document.getElementById('bromance-stat').textContent = `${formatNumber(DATA.bromance.count)} samtaler sammen`;

    // Group names (random 15)
    const container = document.getElementById('group-names');
    const shuffled = [...DATA.groupNames].sort(() => Math.random() - 0.5).slice(0, 15);
    container.innerHTML = shuffled.map(g =>
        `<span class="group-name-tag">${escapeHtml(g.name)}</span>`
    ).join('');
}

// Awards Page
function renderAwards() {
    const container = document.getElementById('awards-list');

    container.innerHTML = DATA.awards.map(award => `
        <div class="award-card">
            <div class="award-icon">${award.icon}</div>
            <div class="award-info">
                <div class="award-title">${award.title}</div>
                <div class="award-winner" style="color: ${award.color}">${award.winner}</div>
                <div class="award-stat">${award.stat}</div>
            </div>
        </div>
    `).join('');
}

// Members Page
function renderMembers() {
    const container = document.getElementById('members-list');

    // Sort by message count
    const sorted = [...DATA.meta.members].sort((a, b) =>
        DATA.members[b].messages - DATA.members[a].messages
    );

    container.innerHTML = sorted.map(name => {
        const m = DATA.members[name];
        const avgWords = (m.words / m.messages).toFixed(1);

        return `
            <div class="member-card">
                <div class="member-header">
                    <span class="member-name" style="color: ${m.color}">${name}</span>
                    <span class="member-emojis">${m.topEmojis.join('')}</span>
                </div>
                <div class="member-stats">
                    <div class="member-stat">
                        <span class="member-stat-label">Beskeder</span>
                        <span class="member-stat-value">${formatNumber(m.messages)}</span>
                    </div>
                    <div class="member-stat">
                        <span class="member-stat-label">Ord</span>
                        <span class="member-stat-value">${formatNumber(m.words)}</span>
                    </div>
                    <div class="member-stat">
                        <span class="member-stat-label">Gns. ord/msg</span>
                        <span class="member-stat-value">${avgWords}</span>
                    </div>
                    <div class="member-stat">
                        <span class="member-stat-label">Emojis</span>
                        <span class="member-stat-value">${formatNumber(m.emojis)}</span>
                    </div>
                    <div class="member-stat">
                        <span class="member-stat-label">Nat (00-04)</span>
                        <span class="member-stat-value">${m.lateNight}</span>
                    </div>
                    <div class="member-stat">
                        <span class="member-stat-label">Bandeord</span>
                        <span class="member-stat-value">${m.swears}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Heatmap Page
function renderHeatmap() {
    const grid = document.getElementById('heatmap-grid');

    // Find max value for scaling
    let maxVal = 0;
    DATA.heatmap.forEach(row => {
        row.forEach(val => {
            if (val > maxVal) maxVal = val;
        });
    });

    // Render cells (rows = days, cols = hours)
    let html = '';
    for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
            const count = DATA.heatmap[day][hour];
            const intensity = count / maxVal;

            let color;
            if (intensity < 0.2) {
                color = 'rgba(26, 26, 46, 1)';
            } else if (intensity < 0.4) {
                color = 'rgba(22, 33, 62, 1)';
            } else if (intensity < 0.6) {
                color = 'rgba(13, 79, 79, 1)';
            } else if (intensity < 0.8) {
                color = 'rgba(15, 118, 110, 1)';
            } else {
                color = `rgba(100, 255, 218, ${0.6 + intensity * 0.4})`;
            }

            html += `<div class="heatmap-cell" style="background: ${color}" title="${count} beskeder"></div>`;
        }
    }

    grid.innerHTML = html;
}

// Word Clouds Page
let currentCloudMember = null;

function renderWordClouds() {
    const selector = document.getElementById('word-cloud-selector');

    selector.innerHTML = DATA.meta.members.map(name => {
        const color = DATA.meta.colors[name];
        return `<button class="word-cloud-btn" data-member="${name}" style="color: ${color}">${name.split(' ')[0]}</button>`;
    }).join('');

    // Add click handlers
    selector.querySelectorAll('.word-cloud-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selector.querySelectorAll('.word-cloud-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showWordCloud(btn.dataset.member);
        });
    });

    // Show first member by default
    selector.querySelector('.word-cloud-btn').classList.add('active');
    showWordCloud(DATA.meta.members[0]);
}

function showWordCloud(member) {
    const display = document.getElementById('word-cloud-display');
    const words = DATA.wordClouds[member] || [];
    const color = DATA.meta.colors[member];

    // Shuffle for visual variety
    const shuffled = [...words].sort(() => Math.random() - 0.5);

    display.innerHTML = shuffled.map(w => `
        <span class="cloud-word" style="font-size: ${w.size}rem; color: ${color}; opacity: ${0.5 + w.size * 0.25}">${w.word}</span>
    `).join('');
}

// Quotes Page
function renderQuotes() {
    const container = document.getElementById('quotes-container');

    // Sort years descending
    const years = Object.keys(DATA.quotes).sort((a, b) => b - a);

    container.innerHTML = years.map(year => {
        const quotes = DATA.quotes[year];
        if (!quotes || quotes.length === 0) return '';

        return `
            <div class="year-section">
                <div class="year-badge">${year}</div>
                ${quotes.map(q => `
                    <div class="quote-card" style="border-left-color: ${q.color}">
                        <div class="quote-text">"${escapeHtml(q.text)}"</div>
                        <div class="quote-meta">
                            <span class="quote-author" style="color: ${q.color}">— ${q.sender}</span>
                            <span>
                                <span class="quote-date">${q.date}</span>
                                <span class="quote-reactions">${'😂'.repeat(Math.min(q.reactions, 5))}</span>
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
}

// Utility: Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
