const themeSwitch = document.getElementById("themeSwitch");
const themeLabel = document.querySelector(".theme-label");

themeSwitch.addEventListener("change", () => {
    if (themeSwitch.checked) {
        themeLabel.textContent = "Light";
        document.body.classList.add("light-theme");
        document.body.classList.remove("dark-theme");
    } else {
        themeLabel.textContent = "Dark";
        document.body.classList.add("dark-theme");
        document.body.classList.remove("light-theme");
    }
});
