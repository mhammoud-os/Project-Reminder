const { app, BrowserWindow, ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { insertStat, getStats } = require('./database'); // Import database functions
const dbPath = path.join(__dirname, 'focus_stats.db');
const db = new sqlite3.Database(dbPath);

function createWindow() {
    const win = new BrowserWindow({
        width: 1400, // Increase window size
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
    
    // Insert stat from renderer process
    ipcMain.on('insert-stat', (event, statData) => {
        const { date, worked, reason, logbookStatus } = statData;
        insertStat(date, worked, reason, logbookStatus);
    });

    // Get stats and send them back to the renderer
    ipcMain.on('get-stats', (event) => {
        getStats((rows) => {
            event.sender.send('stats-data', rows);
        });
    });
});
// Handle request for stats
ipcMain.on('get-stats', (event) => {
    const query = 'SELECT * FROM stats'; // Replace with your actual SQL query
    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            event.reply('send-stats', []); // Send an empty array if there's an error
            return;
        }
        event.reply('send-stats', rows); // Send the fetched rows back to the renderer process
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});