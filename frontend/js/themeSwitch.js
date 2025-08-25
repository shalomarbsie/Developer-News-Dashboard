const themeSwitch = document.getElementById('themeSwitch');
const themeLabel = document.getElementById('themeLabel');

// Always apply saved theme, even if switch isn't on this page
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

if (themeSwitch && themeLabel) {
    // Load saved state
    if (localStorage.getItem('theme') === 'dark') {
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

        document.querySelectorAll('.skeleton-card').forEach(s => s.offsetHeight);
    });
}
