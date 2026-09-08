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
                resultsDiv.innerHTML += `<div class="card"><strong>Match Score: ${match.score}</strong><p>${JSON.stringify(match.details)}</p></div>`;
            });
        } else {
            resultsDiv.innerHTML += '<p>No relevant standards found.</p>';
        }
    } catch (err) {
        resultsDiv.innerHTML = '<p style="color: red;">Error connecting to the backend server.</p>';
    }
}