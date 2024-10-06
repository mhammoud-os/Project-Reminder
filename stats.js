const { remote } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const dbPath = 'path_to_your_database.db'; // Replace with your actual database path
const ctx = document.getElementById('focusChart').getContext('2d');
const focusData = {
    labels: [], // Dates will go here
    datasets: [
        {
            label: 'Worked on Focus (Yes/No)',
            data: [], // 1 for yes, -1 for no
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
        },
    ],
};

// Function to fetch data from the database
function fetchData() {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    db.all(`SELECT date, worked, reason FROM focus_log ORDER BY date DESC`, [], (err, rows) => {
        if (err) {
            throw err;
        }

        rows.forEach(entry => {
            focusData.labels.push(entry.date);
            focusData.datasets[0].data.push(entry.worked ? 1 : -1);

            if (!entry.worked) {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.date}: ${entry.reason}`;
                document.getElementById('missedDaysList').appendChild(listItem);
            }
        });

        // Create the line chart after data is fetched
        createChart();
    });

    db.close();
}

// Function to create the line chart
function createChart() {
    const focusChart = new Chart(ctx, {
        type: 'line',
        data: focusData,
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value === 1 ? 'Yes' : value === -1 ? 'No' : '';
                        }
                    }
                }
            },
        },
    });
}

// Fetch data on load
fetchData();
