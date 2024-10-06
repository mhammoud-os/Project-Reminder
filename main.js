const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { insertStat, getStats } = require('./database'); // Import database functions

function createWindow() {
    const win = new BrowserWindow({
        width: 800, // Increase window size
        height: 600,
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

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
