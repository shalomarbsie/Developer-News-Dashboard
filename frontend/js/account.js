document.addEventListener("DOMContentLoaded", () => {
    const theme = localStorage.getItem("theme");
    document.body.classList.toggle("dark-mode", theme === "dark");

    const userData = JSON.parse(localStorage.getItem("userData")) || null;

    if (!userData) {
        window.location.href = "login.html";
        return;
    }

    const emailField = document.getElementById("email");
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");
    const ageField = document.getElementById("age");

    if (emailField && usernameField && passwordField && ageField) {
        emailField.textContent = userData.email;
        usernameField.textContent = userData.username;
        passwordField.textContent = "••••••••";
        ageField.textContent = userData.age;
    }

    const accountBtn = document.getElementById("accountBtn");
    if (accountBtn) {
        if (!localStorage.getItem("loggedInUser")) {
            accountBtn.textContent = "Signup";
            accountBtn.addEventListener("click", () => {
                window.location.href = "signup.html"; 
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

    const deleteBtn = document.getElementById("deleteBtn");

    if(deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            const confirmDelete = confirm("Are you sure you want to delete your account? This cannot be undone.");
            if (!confirmDelete) return;

            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

            if (loggedInUser) {
                let users = JSON.parse(localStorage.getItem("users")) || [];
                users = users.filter(u => u.email !== loggedInUser.email);
                localStorage.setItem("users", JSON.stringify(users));
            }

            // Remove session data
            localStorage.removeItem("loggedInUser");
            localStorage.removeItem("userData");

            window.location.href = "index.html";    
        });
    }



    // 🔐 Optional: Redirect to home if visiting account.html while logged out
    if (window.location.pathname.includes("account.html") && !localStorage.getItem("loggedInUser")) {
        window.location.href = "index.html";
    }
});
