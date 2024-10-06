const { ipcRenderer } = require('electron');

// Function to fetch data from the database
function fetchData() {
    // Send a request to the main process for stats
    ipcRenderer.send('get-stats'); // Requesting stats from the main process
}

// Handle the response from the main process
ipcRenderer.on('send-stats', (event, stats) => {
    let totalDays = stats.length;
    let totalDaysWorked = 0;
    let todayStatus = '';
    let reasonsForMissedDays = [];

    // Process the fetched data
    stats.forEach(entry => {
        if (entry.worked) {
            totalDaysWorked++;
        } else {
            reasonsForMissedDays.push(`On ${entry.date}: ${entry.reason}`);
        }
    });

    // Check today's status
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const todayEntry = stats.find(entry => entry.date === today);
    todayStatus = todayEntry ? (todayEntry.worked ? 'Worked on focus today' : 'Missed focus today') : 'No entry for today';

    // Display results in the HTML
    document.getElementById('totalDays').textContent = `Total Days: ${totalDays}`;
    document.getElementById('totalDaysWorked').textContent = `Total Days Worked: ${totalDaysWorked}`;
    document.getElementById('todayStatus').textContent = `Today's Status: ${todayStatus}`;

    // Display reasons for missed days
    const reasonsList = document.getElementById('reasonsForMissedDays');
    reasonsList.innerHTML = ''; // Clear previous entries
    reasonsForMissedDays.forEach(reason => {
        const listItem = document.createElement('li');
        listItem.textContent = reason;
        reasonsList.appendChild(listItem);
    });
});

// Fetch data on load
fetchData();
