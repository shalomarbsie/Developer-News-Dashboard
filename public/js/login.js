/* global dcodeIO */

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === email);

        if (!user) {
            alert("Invalid email or password.");
            return;
        }

        const isMatch = await dcodeIO.bcrypt.compare(password, user.password);
        if (!isMatch) {
            alert("Invalid email or password.");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(user));
        localStorage.setItem("userData", JSON.stringify(user));

        window.location.href = "account.html";
    });
});
