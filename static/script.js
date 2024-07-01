document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('uploadForm').onsubmit = async function (e) {
        e.preventDefault(); // Prevent the default form submission
        let formData = new FormData(this);

        try {
            console.log('Submitting form'); // Debug log

            let response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            console.log('Response Status:', response.status); // Debug log

            if (response.ok) {
                let result = await response.json();
                console.log('Result:', result); // Debug log

                if (result.error) {
                    alert(result.error);
                } else {
                    // Display the score with color based on value
                    const scoreElement = document.getElementById('score');
                    const score = result.score.toFixed(2); // Display score as a percentage
                    scoreElement.innerHTML = `<span class="score" style="color: ${getScoreColor(score)};">Resume Score: ${score}%</span>`;

                    // Show the results section
                    document.getElementById('results').classList.remove('hidden');

                    // Update tables with the new data
                    updateTable('found_keywords_table', result.found_keywords);
                    updateTable('missing_keywords_table', result.missing_keywords);
                }
            } else {
                alert('Failed to submit form');
                console.error('Response status:', response.status);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };
});

function getScoreColor(score) {
    // Ensure the score is within the range [0, 100]
    score = Math.min(Math.max(score, 0), 100);
    
    // Convert score to color from red (low) to green (high)
    const green = Math.min(255, Math.round((score / 100) * 255));
    const red = 255 - green;
    return `rgb(${red}, ${green}, 0)`;
}

function updateTable(tableId, data) {
    let tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = '';
    for (const [keyword, count] of Object.entries(data)) {
        let row = document.createElement('tr');
        let keywordCell = document.createElement('td');
        keywordCell.textContent = keyword;
        let countCell = document.createElement('td');
        countCell.textContent = count;
        row.appendChild(keywordCell);
        row.appendChild(countCell);
        tableBody.appendChild(row);
    }
}

function showResults(tabName) {
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });

    // Show the selected tab content
    document.getElementById(tabName).classList.remove('hidden');

    // Update tab button states
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`.tab-button[onclick="showResults('${tabName}')"]`).classList.add('active');
}
