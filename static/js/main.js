/* ============================================
   StandardMatch AI — demo interaction layer
   Replace fetchRecommendations() with your real
   API call; everything else (loading states,
   animated score rings, toasts) will keep working.
   ============================================ */

const EXAMPLE_QUERIES = [
    'PVC insulated electrical cables',
    'Portland cement 43 grade',
    'LED street lighting fixtures',
    'Stainless steel kitchen utensils',
    'Fire extinguisher — dry powder'
];

// Small mock corpus so the UI has something real to react to.
const MOCK_STANDARDS = [
    {
        num: 'IS 694:2010', title: 'PVC insulated cables for working voltages up to 1100V',
        desc: 'Specifies requirements for PVC insulated, single and multicore cables used in wiring for electric power, light and control.',
        tags: ['Electrical', 'Cables', 'Mandatory'], keywords: ['pvc', 'cable', 'insulated', 'wiring', 'electrical', 'voltage']
    },
    {
        num: 'IS 8130:2013', title: 'Conductors for insulated electric cables and flexible cords',
        desc: 'Covers copper and aluminium conductors used in the manufacture of insulated cables and flexible cords.',
        tags: ['Electrical', 'Conductors'], keywords: ['conductor', 'cable', 'copper', 'aluminium', 'flexible']
    },
    {
        num: 'IS 269:2015', title: 'Ordinary Portland cement, 33, 43 and 53 grade — Specification',
        desc: 'Lays down requirements for physical and chemical properties of ordinary Portland cement.',
        tags: ['Construction', 'Cement', 'Mandatory'], keywords: ['cement', 'portland', 'grade', 'construction', 'concrete']
    },
    {
        num: 'IS 10322:2019', title: 'Luminaires — General requirements and tests',
        desc: 'General safety and performance requirements for luminaires, including LED street lighting fixtures.',
        tags: ['Lighting', 'Electrical'], keywords: ['led', 'light', 'lighting', 'luminaire', 'street', 'fixture']
    },
    {
        num: 'IS 6008:2020', title: 'Stainless steel utensils — Specification',
        desc: 'Specifies material, dimensions and finish requirements for stainless steel kitchen utensils and cookware.',
        tags: ['Consumer Goods', 'Steel'], keywords: ['stainless', 'steel', 'utensil', 'kitchen', 'cookware']
    },
    {
        num: 'IS 15683:2016', title: 'Portable fire extinguishers — Performance and construction',
        desc: 'Requirements for the performance, construction and testing of portable dry powder and other fire extinguishers.',
        tags: ['Safety', 'Fire Equipment', 'Mandatory'], keywords: ['fire', 'extinguisher', 'dry', 'powder', 'safety']
    },
    {
        num: 'IS 1239 (Part 1):2004', title: 'Mild steel tubes — Specification',
        desc: 'Covers the requirements for mild steel tubes suitable for structural and general engineering purposes.',
        tags: ['Construction', 'Steel'], keywords: ['steel', 'tube', 'pipe', 'structural', 'mild']
    }
];

function startApp() {
    document.getElementById('intro-section').className = 'hidden-section';
    const app = document.getElementById('app-section');
    app.className = 'active-section';
    renderChips();
    document.getElementById('queryInput').focus();
}

function goHome() {
    document.getElementById('app-section').className = 'hidden-section';
    document.getElementById('intro-section').className = 'active-section';
    document.getElementById('results').innerHTML = '';
    document.getElementById('queryInput').value = '';
}

function renderChips() {
    const row = document.getElementById('chipRow');
    row.innerHTML = EXAMPLE_QUERIES.map(q =>
        `<button type="button" class="chip" onclick="runChip(this)">${q}</button>`
    ).join('');
}

function runChip(el) {
    document.getElementById('queryInput').value = el.textContent;
    getRecommendations();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement && document.activeElement.id === 'queryInput') {
        getRecommendations();
    }
});

function scoreMatch(query, standard) {
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    let hits = 0;
    words.forEach(w => {
        if (standard.keywords.some(k => k.includes(w) || w.includes(k))) hits++;
    });
    if (hits === 0) return 0;
    return Math.min(98, 55 + Math.round((hits / words.length) * 45));
}

function fetchRecommendations(query) {
    // Mock async lookup — swap this for a real API call.
    return new Promise(resolve => {
        setTimeout(() => {
            const scored = MOCK_STANDARDS
                .map(s => ({ ...s, score: scoreMatch(query, s) }))
                .filter(s => s.score > 0)
                .sort((a, b) => b.score - a.score);
            resolve(scored);
        }, 700);
    });
}

function showSkeletons(count) {
    const results = document.getElementById('results');
    results.innerHTML = Array.from({ length: count }).map(() =>
        '<div class="skeleton-card"></div>'
    ).join('');
}

function renderResults(query, matches) {
    const results = document.getElementById('results');

    if (matches.length === 0) {
        results.innerHTML = `
            <div class="empty-state">
                <strong>No matching standards found</strong>
                Try describing the material, product type, or intended use instead.
            </div>`;
        return;
    }

    results.innerHTML = `<div class="results-count">${matches.length} standard${matches.length > 1 ? 's' : ''} matched for “${query}”</div>` +
        matches.map((m, i) => `
            <div class="card" style="animation-delay:${i * 60}ms">
                <div class="score-ring" data-pct="${m.score}"><span>0%</span></div>
                <div class="card-body">
                    <div class="card-header">
                        <h4><span class="std-num">${m.num}</span> — ${m.title}</h4>
                    </div>
                    <p class="card-desc">${m.desc}</p>
                    <div class="card-meta">
                        ${m.tags.map(t => `<span class="meta-tag${t === 'Mandatory' ? ' status-active' : ''}">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

    // Animate each ring from 0 to its match score.
    document.querySelectorAll('.score-ring').forEach(ring => {
        const target = parseInt(ring.dataset.pct, 10);
        let current = 0;
        const label = ring.querySelector('span');
        const step = () => {
            current += Math.max(1, Math.round(target / 20));
            if (current >= target) current = target;
            ring.style.setProperty('--pct', current);
            label.textContent = current + '%';
            if (current < target) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    });
}

async function getRecommendations() {
    const input = document.getElementById('queryInput');
    const btn = document.getElementById('searchBtn');
    const query = input.value.trim();

    if (!query) {
        showToast('Enter a specification or product to search');
        input.focus();
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Searching…';
    showSkeletons(3);

    const matches = await fetchRecommendations(query);

    btn.disabled = false;
    btn.textContent = 'Search Standards';
    renderResults(query, matches);
}

let toastTimer = null;
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}