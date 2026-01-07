// App initialization
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    renderHome();
    renderAwards();
    renderMembers();
    renderHeatmap();
    renderWordClouds();
    renderQuotes();
    renderRelationships();
    renderGifKing();
    renderStakkelsFar();
});

// Simple navigation (no menu toggle needed)

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

// Format numbers
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Home Page
function renderHome() {
    document.getElementById('stat-messages').textContent = formatNumber(DATA.meta.totalMessages);

    const startYear = new Date(DATA.meta.startDate).getFullYear();
    const endYear = new Date(DATA.meta.endDate).getFullYear();
    document.getElementById('stat-years').textContent = `${endYear - startYear}+`;
    document.getElementById('stat-members').textContent = DATA.meta.members.length;

    const [p1, p2] = DATA.bromance.pair;
    document.getElementById('bromance-names').innerHTML = `${p1} <span style="color: var(--accent-pink)">❤️</span> ${p2}`;
    document.getElementById('bromance-stat').textContent = `${formatNumber(DATA.bromance.count)} samtaler sammen`;

    const container = document.getElementById('group-names');
    container.innerHTML = DATA.groupNames.map(g =>
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
                    <div class="member-stat"><span class="member-stat-label">Beskeder</span><span class="member-stat-value">${formatNumber(m.messages)}</span></div>
                    <div class="member-stat"><span class="member-stat-label">Ord</span><span class="member-stat-value">${formatNumber(m.words)}</span></div>
                    <div class="member-stat"><span class="member-stat-label">Gns. ord/msg</span><span class="member-stat-value">${avgWords}</span></div>
                    <div class="member-stat"><span class="member-stat-label">Emojis</span><span class="member-stat-value">${formatNumber(m.emojis)}</span></div>
                    <div class="member-stat"><span class="member-stat-label">Nat (00-04)</span><span class="member-stat-value">${m.lateNight}</span></div>
                    <div class="member-stat"><span class="member-stat-label">Bandeord</span><span class="member-stat-value">${m.swears}</span></div>
                </div>
            </div>
        `;
    }).join('');
}

// Heatmap Page
function renderHeatmap() {
    const grid = document.getElementById('heatmap-grid');
    let maxVal = 0;
    DATA.heatmap.forEach(row => row.forEach(val => { if (val > maxVal) maxVal = val; }));

    let html = '';
    for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
            const count = DATA.heatmap[day][hour];
            const intensity = count / maxVal;
            let color;
            if (intensity < 0.2) color = 'rgba(26, 26, 46, 1)';
            else if (intensity < 0.4) color = 'rgba(22, 33, 62, 1)';
            else if (intensity < 0.6) color = 'rgba(13, 79, 79, 1)';
            else if (intensity < 0.8) color = 'rgba(15, 118, 110, 1)';
            else color = `rgba(100, 255, 218, ${0.6 + intensity * 0.4})`;
            html += `<div class="heatmap-cell" style="background: ${color}"></div>`;
        }
    }
    grid.innerHTML = html;
}

// Word Clouds Page
function renderWordClouds() {
    const selector = document.getElementById('word-cloud-selector');
    selector.innerHTML = DATA.meta.members.map(name => {
        const color = DATA.meta.colors[name];
        return `<button class="word-cloud-btn" data-member="${name}" style="color: ${color}">${name.split(' ')[0]}</button>`;
    }).join('');

    selector.querySelectorAll('.word-cloud-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selector.querySelectorAll('.word-cloud-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            showWordCloud(btn.dataset.member);
        });
    });

    selector.querySelector('.word-cloud-btn').classList.add('active');
    showWordCloud(DATA.meta.members[0]);
}

function showWordCloud(member) {
    const display = document.getElementById('word-cloud-display');
    const words = DATA.wordClouds[member] || [];
    const color = DATA.meta.colors[member];
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    display.innerHTML = shuffled.map(w => `
        <span class="cloud-word" style="font-size: ${w.size}rem; color: ${color}; opacity: ${0.5 + w.size * 0.25}">${w.word}</span>
    `).join('');
}

// Quotes Page
function renderQuotes() {
    const container = document.getElementById('quotes-container');
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
                            <span><span class="quote-date">${q.date}</span> ${'😂'.repeat(Math.min(q.reactions, 5))}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }).join('');
}

// Relationships Page
function renderRelationships() {
    const webContainer = document.getElementById('relationship-web');
    const listContainer = document.getElementById('relationship-list');

    // Simple SVG network visualization
    const width = webContainer.clientWidth || 300;
    const height = 280;
    const nodes = DATA.relationshipWeb.nodes;
    const links = DATA.relationshipWeb.links;

    // Position nodes in a circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 50;

    nodes.forEach((node, i) => {
        const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
        node.x = centerX + radius * Math.cos(angle);
        node.y = centerY + radius * Math.sin(angle);
    });

    // Find max link value for scaling
    const maxLink = Math.max(...links.map(l => l.value));

    // Create SVG
    let svg = `<svg viewBox="0 0 ${width} ${height}">`;

    // Draw links
    links.forEach(link => {
        const source = nodes.find(n => n.id === link.source);
        const target = nodes.find(n => n.id === link.target);
        if (source && target) {
            const strokeWidth = 1 + (link.value / maxLink) * 6;
            svg += `<line class="link" x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}"
                    stroke="rgba(100, 255, 218, 0.4)" stroke-width="${strokeWidth}"/>`;
        }
    });

    // Draw nodes
    nodes.forEach(node => {
        const nodeRadius = 15 + (node.messages / 50000) * 15;
        svg += `<circle class="node-circle" cx="${node.x}" cy="${node.y}" r="${nodeRadius}" fill="${node.color}"/>`;
        svg += `<text class="node-label" x="${node.x}" y="${node.y + 4}" text-anchor="middle">${node.id.split(' ')[0]}</text>`;
    });

    svg += '</svg>';
    webContainer.innerHTML = svg;

    // Render list of top relationships
    const sortedLinks = [...links].sort((a, b) => b.value - a.value).slice(0, 10);
    listContainer.innerHTML = sortedLinks.map(link => `
        <div class="relationship-item">
            <span class="relationship-pair">${link.source} ↔ ${link.target}</span>
            <span class="relationship-count">${formatNumber(link.value)} samtaler</span>
        </div>
    `).join('');
}

// GIF King Page
function renderGifKing() {
    const container = document.getElementById('gifking-list');
    const maxTotal = DATA.gifKing[0]?.total || 1;

    container.innerHTML = DATA.gifKing.map((item, index) => {
        const barWidth = (item.total / maxTotal) * 100;
        return `
            <div class="gifking-card">
                <div class="gifking-header">
                    <div>
                        <span class="gifking-rank">#${index + 1}</span>
                        <span class="gifking-name" style="color: ${item.color}">${item.name}</span>
                    </div>
                    <span class="gifking-total">${formatNumber(item.total)} medier</span>
                </div>
                <div class="gifking-bar">
                    <div class="gifking-bar-fill" style="width: ${barWidth}%; background: ${item.color}"></div>
                </div>
                <div class="gifking-breakdown">
                    <span>🖼️ ${item.images}</span>
                    <span>🎬 ${item.gifs}</span>
                    <span>📹 ${item.videos}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Stakkels Far Page
function renderStakkelsFar() {
    const rankingContainer = document.getElementById('stakkels-ranking');
    const mentionsContainer = document.getElementById('stakkels-mentions');

    // Sort by count
    const sorted = Object.entries(DATA.stakkelsFar.byPerson)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    rankingContainer.innerHTML = sorted.map(([name, count], index) => {
        const color = DATA.meta.colors[name] || '#64ffda';
        return `
            <div class="stakkels-rank-item">
                <span class="stakkels-rank-pos">${index + 1}</span>
                <span class="stakkels-rank-name" style="color: ${color}">${name}</span>
                <span class="stakkels-rank-count">${count} klager</span>
            </div>
        `;
    }).join('');

    // Recent mentions
    const recentMentions = DATA.stakkelsFar.mentions.slice(-20).reverse();
    mentionsContainer.innerHTML = recentMentions.map(m => {
        const color = DATA.meta.colors[m.sender] || '#64ffda';
        return `
            <div class="stakkels-mention">
                <div class="stakkels-mention-text">"${escapeHtml(m.text)}"</div>
                <div class="stakkels-mention-meta">
                    <span style="color: ${color}">— ${m.sender}</span>
                    <span>${m.date}</span>
                </div>
            </div>
        `;
    }).join('');
}
