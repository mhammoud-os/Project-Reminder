const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize the database
const dbPath = path.join(__dirname, 'focus_stats.db');
const db = new sqlite3.Database(dbPath);

// Create the table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            worked INTEGER,
            reason TEXT,
            logbook_status INTEGER
        )
    `);
});

// Insert new stat record
function insertStat(date, worked, reason, logbookStatus) {
    db.run(`
        INSERT INTO stats (date, worked, reason, logbook_status)
        VALUES (?, ?, ?, ?)
    `, [date, worked, reason, logbookStatus], function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Stat added with ID: ${this.lastID}`);
    });
}

// Fetch all stats
function getStats(callback) {
    db.all(`SELECT * FROM stats`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        callback(rows);
    });
}

module.exports = {
    insertStat,
    getStats
};
