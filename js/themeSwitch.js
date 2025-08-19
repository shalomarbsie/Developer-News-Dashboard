const themeSwitch = document.getElementById('themeSwitch');
const themeLabel = document.getElementById('themeLabel');

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeSwitch.checked = true;
    themeLabel.textContent = "Dark ";
} else {
    themeLabel.textContent = "Light";
}

themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        themeLabel.textContent = "Dark ";
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        themeLabel.textContent = "Light";
    }
});
