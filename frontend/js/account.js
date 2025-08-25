document.addEventListener("DOMContentLoaded", () => {
    // 🌙 Apply theme from localStorage
    const theme = localStorage.getItem("theme");
    document.body.classList.toggle("dark-mode", theme === "dark");

    // 👤 Retrieve user data
    const userData = JSON.parse(localStorage.getItem("userData")) || {
        email: "example@email.com",
        username: "User123",
        password: "password123",
        age: 20
    };

    // 🔹 Fill account info (only on account.html)
    const emailField = document.getElementById("email");
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    const ageField = document.getElementById("age");

    if (emailField && usernameField && passwordField && ageField) {
        emailField.textContent = userData.email;
        usernameField.textContent = userData.username;
        passwordField.textContent = "••••••••"; // Always masked
        ageField.textContent = userData.age;
    }

    // 🔹 Update account button text on index.html
    const accountBtn = document.getElementById("accountBtn");
    if (accountBtn) {
        if (!localStorage.getItem("loggedInUser")) {
            accountBtn.textContent = "Signup";
            accountBtn.addEventListener("click", () => {
                window.location.href = "signup.html"; // Adjust if your signup page is named differently
            });
        } else {
            accountBtn.textContent = "Account";
            accountBtn.addEventListener("click", () => {
                window.location.href = "account.html";
            });
        }
    }

    // 🚪 Logout button logic
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("loggedInUser");
            window.location.href = "index.html";
        });
    }

    // ✏️ Change details (placeholder)
    const changeBtn = document.getElementById("changeBtn");
    if (changeBtn) {
        changeBtn.addEventListener("click", () => {
            alert("Feature coming soon: Edit account details.");
            // Future: redirect to edit page or open modal
        });
    }

    // 🗑️ Delete account
    const deleteBtn = document.getElementById("deleteBtn");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            const confirmDelete = confirm("Are you sure you want to delete your account? This cannot be undone.");
            if (confirmDelete) {
                localStorage.removeItem("loggedInUser");
                localStorage.removeItem("userData");
                window.location.href = "index.html";
            }
        });
    }

    // 🔐 Optional: Redirect to home if visiting account.html while logged out
    if (window.location.pathname.includes("account.html") && !localStorage.getItem("loggedInUser")) {
        window.location.href = "index.html";
    }
});
