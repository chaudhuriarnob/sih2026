// --- Navigation Logic ---
function startApp() {
    document.getElementById('intro-section').classList.remove('active-section');
    document.getElementById('intro-section').classList.add('hidden-section');
    
    document.getElementById('app-section').classList.remove('hidden-section');
    document.getElementById('app-section').classList.add('active-section');
}

function goHome() {
    document.getElementById('app-section').classList.remove('active-section');
    document.getElementById('app-section').classList.add('hidden-section');
    
    document.getElementById('intro-section').classList.remove('hidden-section');
    document.getElementById('intro-section').classList.add('active-section');
    
    // Optional: Clear previous search when going home
    document.getElementById('queryInput').value = '';
    document.getElementById('results').innerHTML = '';
}

// --- Search Engine Logic ---
async function getRecommendations() {
    const query = document.getElementById('queryInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!query.trim()) {
        resultsDiv.innerHTML = '<p style="color: #e11d48; font-weight: bold;">Please enter a specification query.</p>';
        return;
    }
    
    resultsDiv.innerHTML = '<p style="color: #64748b; font-weight: bold;">Processing AI recommendation...</p>';
    
    try {
        const response = await fetch('/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });
        const data = await response.json();
        resultsDiv.innerHTML = '<h3 style="margin-bottom: 20px; color: #1e293b;">Top AI Matches:</h3>';
        
        if (data.matches && data.matches.length > 0) {
            data.matches.forEach(match => {
                const details = match.details;
                const matchPercent = (match.score * 100).toFixed(1);
                
                const standardNum = details.standard_number || 'Standard ID';
                const title = details.title || 'Untitled Document';
                const description = details.description || 'No description available.';
                const status = details.status || 'Active';
                const category = details.category || 'General';
                const year = details.version_year || 'N/A';

                resultsDiv.innerHTML += `
                    <div class="card">
                        <div class="card-header">
                            <h4><span class="std-num">${standardNum}</span>: ${title}</h4>
                            <span class="score-badge">${matchPercent}% Match</span>
                        </div>
                        <p class="card-desc">${description}</p>
                        <div class="card-meta">
                            <span class="meta-tag status-${status.toLowerCase().replace(/\s+/g, '-')}">${status}</span>
                            <span class="meta-tag">${category}</span>
                            <span class="meta-tag">Year: ${year}</span>
                        </div>
                    </div>
                `;
            });
        } else {
            resultsDiv.innerHTML += '<p style="color: #64748b;">No highly relevant standards found for this query.</p>';
        }
    } catch (err) {
        resultsDiv.innerHTML = '<p style="color: #e11d48; font-weight: bold;">Error connecting to the NLP backend server.</p>';
    }
}