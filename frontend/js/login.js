    document.addEventListener("DOMContentLoaded", () => {
        const loginForm = document.getElementById("loginForm");

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value.trim();

            if (!email || !password) {
                alert("Please fill in all fields.");
                return;
            }

            // Get all registered users
            const users = JSON.parse(localStorage.getItem("users")) || [];

            // Find matching user
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                alert("Invalid email or password.");
                return;
            }

            // ✅ Save logged-in user in both keys
            localStorage.setItem("loggedInUser", JSON.stringify(user)); // Optional, just the username
            localStorage.setItem("userData", JSON.stringify(user)); // Full user data

            window.location.href = "account.html";
        });
    });
