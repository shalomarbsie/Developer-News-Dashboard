document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme");
     document.body.classList.toggle("dark-mode", theme === "dark");

    const userData = JSON.parse(localStorage.getItem("userData")) || {
        email: "example@email.com",
        username: "User123",
        password: "password123",
        age: 20
    };
    // Populate fields
    document.getElementById("email").textContent = userData.email;
    document.getElementById("username").textContent = userData.username;
    document.getElementById("password").textContent = "••••••••";
    document.getElementById("age").textContent = userData.age;

    document.getElementById("logoutBtn").addEventListener("click", () => {
        
    });

    document.getElementById("changeBtn").addEventListener("click", () => {
        
    });

    document.getElementById("deleteBtn").addEventListener("click", () => {
        
    });
});
