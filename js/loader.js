// loader.js
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    // Listen for the signal from hackerNews.js
    document.addEventListener("newsLoaded", () => {
        loader.style.transition = "opacity 0.3s ease";
        loader.style.opacity = "0";

        setTimeout(() => loader.remove(), 300);
    });
});
