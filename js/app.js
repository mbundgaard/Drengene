// App initialization
document.addEventListener('DOMContentLoaded', () => {
    initMenu();
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
    renderReplySpeed();
    renderGhostDetector();
    renderTopicTrends();
    renderMood();
});

// Slide-in Menu
function initMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');
    const overlay = document.getElementById('menu-overlay');

    function openMenu() {
        menu.classList.add('active');
        overlay.classList.add('active');
        menuToggle.classList.add('active');
    }

    function closeMenu() {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        menuToggle.classList.remove('active');
    }

    menuToggle.addEventListener('click', () => {
        if (menu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking a menu item
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', closeMenu);
    });
}

// Navigation
function initNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;

            // Update menu items
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Update pages
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`page-${page}`).classList.add('active');

            // Update header title
            const pageTitle = item.textContent.trim();
            document.getElementById('header-title').textContent = pageTitle;

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

// Reply Speed Page
function renderReplySpeed() {
    const container = document.getElementById('replyspeed-list');
    if (!DATA.replySpeed || Object.keys(DATA.replySpeed).length === 0) {
        container.innerHTML = '<p class="empty-state">Ingen data</p>';
        return;
    }
    const sorted = Object.entries(DATA.replySpeed)
        .sort((a, b) => a[1].avgSeconds - b[1].avgSeconds);

    const maxTime = sorted.length > 0 ? sorted[sorted.length - 1][1].avgSeconds : 1;
    container.innerHTML = sorted.map(([name, data], index) => {
        const barWidth = maxTime > 0 ? (data.avgSeconds / maxTime) * 100 : 0;
        return `
            <div class="replyspeed-card">
                <div class="replyspeed-header">
                    <div>
                        <span class="replyspeed-rank">#${index + 1}</span>
                        <span class="replyspeed-name" style="color: ${data.color}">${name}</span>
                    </div>
                    <span class="replyspeed-time">${data.avgDisplay}</span>
                </div>
                <div class="replyspeed-bar">
                    <div class="replyspeed-bar-fill" style="width: ${barWidth}%; background: ${data.color}"></div>
                </div>
                <div class="replyspeed-meta">${formatNumber(data.totalReplies)} svar målt</div>
            </div>
        `;
    }).join('');
}

// Ghost Detector Page
function renderGhostDetector() {
    const container = document.getElementById('ghost-list');
    if (!DATA.ghostDetector || Object.keys(DATA.ghostDetector).length === 0) {
        container.innerHTML = '<p class="empty-state">Ingen data</p>';
        return;
    }
    const sorted = Object.entries(DATA.ghostDetector)
        .sort((a, b) => b[1].longestGhost - a[1].longestGhost);

    container.innerHTML = sorted.map(([name, data], index) => `
        <div class="ghost-card">
            <div class="ghost-header">
                <div>
                    <span class="ghost-rank">#${index + 1}</span>
                    <span class="ghost-name" style="color: ${data.color}">${name}</span>
                </div>
                <span class="ghost-days">${data.longestGhost} dage</span>
            </div>
            <div class="ghost-details">
                <span>Længste fravær: ${data.longestStart} - ${data.longestEnd}</span>
            </div>
            <div class="ghost-meta">Forsvundet ${data.totalGhosts} gange (7+ dage)</div>
        </div>
    `).join('');
}

// Topic Trends Page
function renderTopicTrends() {
    const container = document.getElementById('topics-container');
    if (!DATA.topicTrends || Object.keys(DATA.topicTrends).length === 0) {
        container.innerHTML = '<p class="empty-state">Ingen data</p>';
        return;
    }
    const years = Object.keys(DATA.topicTrends).sort((a, b) => b - a);

    container.innerHTML = years.map(year => {
        const topics = DATA.topicTrends[year];
        if (!topics || topics.length === 0) return '';
        const maxCount = topics[0].count;
        return `
            <div class="topics-year">
                <div class="topics-year-badge">${year}</div>
                <div class="topics-words">
                    ${topics.map(t => {
                        const size = 0.7 + (t.count / maxCount) * 0.6;
                        const opacity = 0.5 + (t.count / maxCount) * 0.5;
                        return `<span class="topic-word" style="font-size: ${size}rem; opacity: ${opacity}">${t.word}</span>`;
                    }).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Mood/Sentiment Page
function renderMood() {
    const summaryContainer = document.getElementById('mood-summary');
    const personsContainer = document.getElementById('mood-persons');
    const timelineContainer = document.getElementById('mood-timeline');
    const weekdaysContainer = document.getElementById('mood-weekdays');

    // Check if sentiment data exists
    if (typeof SENTIMENT === 'undefined' || !SENTIMENT) {
        personsContainer.innerHTML = '<p class="empty-state">Sentiment data ikke tilgængelig</p>';
        timelineContainer.innerHTML = '';
        weekdaysContainer.innerHTML = '';
        return;
    }

    // Summary stats
    if (SENTIMENT.byPerson) {
        const sorted = Object.entries(SENTIMENT.byPerson)
            .sort((a, b) => b[1].score - a[1].score);

        const mostPositive = sorted[0];
        const mostNegative = sorted[sorted.length - 1];
        const balanced = sorted.find(([_, d]) => Math.abs(d.score) < 2) || sorted[Math.floor(sorted.length / 2)];

        summaryContainer.innerHTML = `
            <div class="mood-highlights">
                <div class="mood-highlight sunshine">
                    <div class="mood-highlight-icon">☀️</div>
                    <div class="mood-highlight-label">Solstrålen</div>
                    <div class="mood-highlight-name" style="color: ${mostPositive[1].color}">${mostPositive[0]}</div>
                    <div class="mood-highlight-score">+${mostPositive[1].score}%</div>
                </div>
                <div class="mood-highlight balanced">
                    <div class="mood-highlight-icon">⚖️</div>
                    <div class="mood-highlight-label">Balanceret</div>
                    <div class="mood-highlight-name" style="color: ${balanced[1].color}">${balanced[0]}</div>
                    <div class="mood-highlight-score">${balanced[1].score > 0 ? '+' : ''}${balanced[1].score}%</div>
                </div>
                <div class="mood-highlight realist">
                    <div class="mood-highlight-icon">🌧️</div>
                    <div class="mood-highlight-label">Realisten</div>
                    <div class="mood-highlight-name" style="color: ${mostNegative[1].color}">${mostNegative[0]}</div>
                    <div class="mood-highlight-score">${mostNegative[1].score}%</div>
                </div>
            </div>
        `;
    }

    // Persons - sorted by positivity score
    if (SENTIMENT.byPerson) {
        const sorted = Object.entries(SENTIMENT.byPerson)
            .sort((a, b) => b[1].score - a[1].score);

        personsContainer.innerHTML = sorted.map(([name, data], index) => {
            const emoji = data.score > 10 ? '😊' : data.score > 0 ? '🙂' : data.score > -10 ? '😐' : '😔';
            return `
                <div class="mood-person-card">
                    <div class="mood-person-header">
                        <span class="mood-person-emoji">${emoji}</span>
                        <span class="mood-person-name" style="color: ${data.color}">${name}</span>
                        <span class="mood-person-score" style="color: ${data.score >= 0 ? 'var(--accent)' : 'var(--accent-pink)'}">${data.score > 0 ? '+' : ''}${data.score}%</span>
                    </div>
                    <div class="mood-bar">
                        <div class="mood-bar-positive" style="width: ${data.positive}%"></div>
                        <div class="mood-bar-neutral" style="width: ${data.neutral}%"></div>
                        <div class="mood-bar-negative" style="width: ${data.negative}%"></div>
                    </div>
                    <div class="mood-bar-labels">
                        <span class="positive">😊 ${data.positive}%</span>
                        <span class="neutral">😐 ${data.neutral}%</span>
                        <span class="negative">😔 ${data.negative}%</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Timeline - monthly mood
    if (SENTIMENT.timeline && SENTIMENT.timeline.length > 0) {
        const maxScore = Math.max(...SENTIMENT.timeline.map(t => Math.abs(t.score)));

        timelineContainer.innerHTML = `
            <div class="mood-timeline-chart">
                ${SENTIMENT.timeline.map(t => {
                    const height = Math.abs(t.score) / maxScore * 50;
                    const isPositive = t.score >= 0;
                    return `
                        <div class="mood-timeline-bar" title="${t.month}: ${t.score > 0 ? '+' : ''}${t.score}%">
                            <div class="mood-timeline-fill ${isPositive ? 'positive' : 'negative'}"
                                 style="height: ${height}px; ${isPositive ? 'bottom: 50%' : 'top: 50%'}"></div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="mood-timeline-labels">
                <span>${SENTIMENT.timeline[0].month}</span>
                <span>${SENTIMENT.timeline[SENTIMENT.timeline.length - 1].month}</span>
            </div>
        `;
    }

    // Weekdays
    if (SENTIMENT.byWeekday) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const dayNames = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];

        weekdaysContainer.innerHTML = days.map((day, i) => {
            const data = SENTIMENT.byWeekday[day];
            if (!data) return '';
            const emoji = data.score > 5 ? '😊' : data.score > 0 ? '🙂' : data.score > -5 ? '😐' : '😔';
            return `
                <div class="mood-weekday">
                    <span class="mood-weekday-name">${dayNames[i]}</span>
                    <span class="mood-weekday-emoji">${emoji}</span>
                    <span class="mood-weekday-score" style="color: ${data.score >= 0 ? 'var(--accent)' : 'var(--accent-pink)'}">${data.score > 0 ? '+' : ''}${data.score}%</span>
                </div>
            `;
        }).join('');
    }
}
