const fs = require('fs-extra');
const path = require('path');
const { ipcRenderer } = require('electron');

// Disable buttons after selection
let stats = [];
let imageUploaded = false;
const todayDate = new Date().toISOString().slice(0, 10); // Get today's date

// Check if image already exists and display it
const savedImagePath = path.join(__dirname, 'uploads', 'document.png');
if (fs.existsSync(savedImagePath)) {
    imageUploaded = true;
    document.getElementById('uploadDoc').style.display = 'none'; // Hide upload button
    document.getElementById('imagePreview').src = `uploads/document.png`;
    document.getElementById('imagePreview').style.display = 'block';
}

document.getElementById('yesButton').addEventListener('click', () => {
    stats.push({ worked: true, date: todayDate });
    document.getElementById('logSection').style.display = 'block';
    disableButtons();
});

document.getElementById('noButton').addEventListener('click', () => {
    stats.push({ worked: false, date: todayDate });
    document.getElementById('whyNoSection').style.display = 'block';
    disableButtons();
});

document.getElementById('logYes').addEventListener('click', () => {
    saveStat(true);
});

document.getElementById('logNo').addEventListener('click', () => {
    saveStat(false);
});

document.getElementById('submitReason').addEventListener('click', () => {
    const reason = document.getElementById('reason').value;
    stats[stats.length - 1].reason = reason;
    saveStat(false);
});

// Disable buttons to prevent changing mind
function disableButtons() {
    document.getElementById('yesButton').disabled = true;
    document.getElementById('noButton').disabled = true;
}

// Save stats to the database
function saveStat(logbookStatus) {
    const worked = stats[stats.length - 1].worked;
    const reason = stats[stats.length - 1].reason || '';
    
    ipcRenderer.send('insert-stat', {
        date: todayDate,
        worked,
        reason,
        logbookStatus
    });
}

// Handle image upload and save
document.getElementById('uploadDoc').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';

            // Save the file to the local directory
            fs.ensureDirSync(path.join(__dirname, 'uploads')); // Ensure the uploads folder exists
            fs.writeFile(savedImagePath, Buffer.from(e.target.result.split(',')[1], 'base64'), (err) => {
                if (err) {
                    console.error('Failed to save image', err);
                } else {
                    console.log('Image saved successfully:', savedImagePath);
                }
            });
            document.getElementById('uploadDoc').style.display = 'none'; // Hide upload button after upload
        };
        reader.readAsDataURL(file);
    }
});

// View statistics using a database
document.getElementById('viewStats').addEventListener('click', function() {
    window.location.href = 'stats.html';
});

ipcRenderer.on('stats-data', (event, rows) => {
    let statsStr = rows.map(row => 
        `Date: ${row.date}, Worked: ${row.worked ? 'Yes' : 'No'}, Reason: ${row.reason || 'N/A'}, Logged: ${row.logbook_status ? 'Yes' : 'No'}`
    ).join('\n');
    alert(`Stats:\n${statsStr}`);
});
