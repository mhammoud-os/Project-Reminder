document.getElementById('yesButton').addEventListener('click', () => {
    document.getElementById('logSection').style.display = 'block';
});

document.getElementById('noButton').addEventListener('click', () => {
    document.getElementById('whyNoSection').style.display = 'block';
});

document.getElementById('logYes').addEventListener('click', () => {
    alert('Great! Keep up the work!');
});

document.getElementById('logNo').addEventListener('click', () => {
    alert('Please make sure to log your progress!');
});

document.getElementById('submitReason').addEventListener('click', () => {
    const reason = document.getElementById('reason').value;
    alert(`Reason saved: ${reason}`);
});

document.getElementById('uploadDoc').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});
