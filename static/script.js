document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('uploadForm').onsubmit = async function (e) {
        e.preventDefault();
        let formData = new FormData(this);

        try {
            let response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                let result = await response.json();
                if (result.error) {
                    alert(result.error);
                } else {
                    updateResults(result);
                }
            } else {
                alert('Error uploading file');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the file.');
        }
    };
});

function getScoreColor(score) {
    const red = Math.min(255, 255 - Math.round(score * 2.55));
    const green = Math.min(255, Math.round(score * 2.55));
    return `rgb(${red}, ${green}, 0)`;
}

function updateTable(table, data, tableType) {
    table.innerHTML = '';
    Object.keys(data).forEach(keyword => {
        let row = table.insertRow();
        let keywordCell = row.insertCell(0);
        let countCell = row.insertCell(1);
        let deleteCell = row.insertCell(2);

        keywordCell.textContent = keyword;
        countCell.textContent = data[keyword];
        deleteCell.innerHTML = `<button onclick="deleteKeyword('${keyword}', '${tableType}')">Delete</button>`;
    });
}

function updateResults(result) {
    const scoreElement = document.getElementById('score');
    const score = result.score.toFixed(2); // Display score as a percentage
    scoreElement.innerHTML = `<span class="score" style="color: ${getScoreColor(score)};">Resume Score: ${score}%</span>`;
    scoreElement.style.display = 'block';

    const missingKeywordsTable = document.getElementById('missing_keywords_table').getElementsByTagName('tbody')[0];
    const foundKeywordsTable = document.getElementById('found_keywords_table').getElementsByTagName('tbody')[0];

    updateTable(missingKeywordsTable, result.missing_keywords, 'missing');
    updateTable(foundKeywordsTable, result.found_keywords, 'found');

    document.getElementById('results').classList.remove('hidden');
}

async function deleteKeyword(keyword, tableType) {
    const jobDescription = document.getElementById('job_description').value;
    const missingKeywordsTable = document.getElementById('missing_keywords_table').getElementsByTagName('tbody')[0];
    const foundKeywordsTable = document.getElementById('found_keywords_table').getElementsByTagName('tbody')[0];
    
    let missingKeywords = {};
    let foundKeywords = {};
    
    Array.from(missingKeywordsTable.rows).forEach(row => {
        const keyword = row.cells[0].textContent;
        const count = parseInt(row.cells[1].textContent);
        missingKeywords[keyword] = count;
    });
    
    Array.from(foundKeywordsTable.rows).forEach(row => {
        const keyword = row.cells[0].textContent;
        const count = parseInt(row.cells[1].textContent);
        foundKeywords[keyword] = count;
    });

    try {
        let response = await fetch('/delete_keyword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                job_description: jobDescription,
                found_keywords: foundKeywords,
                missing_keywords: missingKeywords,
                keyword: keyword,
                table: tableType
            })
        });

        if (response.ok) {
            let result = await response.json();
            if (result.error) {
                alert(result.error);
            } else {
                updateResults(result);
            }
        } else {
            alert('Error recalculating score');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while recalculating the score.');
    }
}

function showResults(tab) {
    let missingTab = document.getElementById('missing');
    let foundTab = document.getElementById('found');
    let missingButton = document.querySelector('.tab-button:nth-child(1)');
    let foundButton = document.querySelector('.tab-button:nth-child(2)');

    if (tab === 'missing') {
        missingTab.classList.remove('hidden');
        foundTab.classList.add('hidden');
        missingButton.classList.add('active');
        foundButton.classList.remove('active');
    } else {
        foundTab.classList.remove('hidden');
        missingTab.classList.add('hidden');
        foundButton.classList.add('active');
        missingButton.classList.remove('active');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('uploadForm').onsubmit = async function (e) {
        e.preventDefault();
        let formData = new FormData(this);

        try {
            let response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                let result = await response.json();
                if (result.error) {
                    alert(result.error);
                } else {
                    updateResults(result);
                }
            } else {
                alert('Error uploading file');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while uploading the file.');
        }
    };
});

function getScoreColor(score) {
    const red = Math.min(255, 255 - Math.round(score * 2.55));
    const green = Math.min(255, Math.round(score * 2.55));
    return `rgb(${red}, ${green}, 0)`;
}

function updateTable(table, data, tableType) {
    table.innerHTML = '';
    Object.keys(data).forEach(keyword => {
        let row = table.insertRow();
        let keywordCell = row.insertCell(0);
        let countCell = row.insertCell(1);
        let deleteCell = row.insertCell(2);

        keywordCell.textContent = keyword;
        countCell.textContent = data[keyword];
        deleteCell.innerHTML = `<button onclick="deleteKeyword('${keyword}', '${tableType}')">Delete</button>`;
    });
}

function updateResults(result) {
    const scoreElement = document.getElementById('score');
    const score = result.score.toFixed(2); // Display score as a percentage
    scoreElement.innerHTML = `<span class="score" style="color: ${getScoreColor(score)};">Resume Score: ${score}%</span>`;
    scoreElement.style.display = 'block';

    const missingKeywordsTable = document.getElementById('missing_keywords_table').getElementsByTagName('tbody')[0];
    const foundKeywordsTable = document.getElementById('found_keywords_table').getElementsByTagName('tbody')[0];

    updateTable(missingKeywordsTable, result.missing_keywords, 'missing');
    updateTable(foundKeywordsTable, result.found_keywords, 'found');

    document.getElementById('results').classList.remove('hidden');
}

async function deleteKeyword(keyword, tableType) {
    const jobDescription = document.getElementById('job_description').value;
    const missingKeywordsTable = document.getElementById('missing_keywords_table').getElementsByTagName('tbody')[0];
    const foundKeywordsTable = document.getElementById('found_keywords_table').getElementsByTagName('tbody')[0];
    
    let missingKeywords = {};
    let foundKeywords = {};
    
    Array.from(missingKeywordsTable.rows).forEach(row => {
        const keyword = row.cells[0].textContent;
        const count = parseInt(row.cells[1].textContent);
        missingKeywords[keyword] = count;
    });
    
    Array.from(foundKeywordsTable.rows).forEach(row => {
        const keyword = row.cells[0].textContent;
        const count = parseInt(row.cells[1].textContent);
        foundKeywords[keyword] = count;
    });

    try {
        let response = await fetch('/delete_keyword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                job_description: jobDescription,
                found_keywords: foundKeywords,
                missing_keywords: missingKeywords,
                keyword: keyword,
                table: tableType
            })
        });

        if (response.ok) {
            let result = await response.json();
            if (result.error) {
                alert(result.error);
            } else {
                updateResults(result);
            }
        } else {
            alert('Error recalculating score');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while recalculating the score.');
    }
}

function showResults(tab) {
    let missingTab = document.getElementById('missing');
    let foundTab = document.getElementById('found');
    let missingButton = document.querySelector('.tab-button:nth-child(1)');
    let foundButton = document.querySelector('.tab-button:nth-child(2)');

    if (tab === 'missing') {
        missingTab.classList.remove('hidden');
        foundTab.classList.add('hidden');
        missingButton.classList.add('active');
        foundButton.classList.remove('active');
    } else {
        foundTab.classList.remove('hidden');
        missingTab.classList.add('hidden');
        foundButton.classList.add('active');
        missingButton.classList.remove('active');
    }
}
