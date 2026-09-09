async function getRecommendations() {
    const query = document.getElementById('queryInput').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Processing AI recommendation...</p>';
    
    try {
        const response = await fetch('/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });
        const data = await response.json();
        resultsDiv.innerHTML = '<h3>Top Matches:</h3>';
        
        if (data.matches && data.matches.length > 0) {
            data.matches.forEach(match => {
                const details = match.details;
                // Convert 0.5538 format into "55.4%"
                const matchPercent = (match.score * 100).toFixed(1);
                
                // Safely extract fields with fallbacks
                const standardNum = details.standard_number || 'Unknown Standard';
                const title = details.title || 'No Title Available';
                const description = details.description || 'No description available.';
                const status = details.status || 'Active';
                const category = details.category || 'General';
                const year = details.version_year || 'N/A';

                // Build a clean, structured HTML card for each result
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
            resultsDiv.innerHTML += '<p>No relevant standards found.</p>';
        }
    } catch (err) {
        resultsDiv.innerHTML = '<p style="color: red;">Error connecting to the backend server.</p>';
    }
}