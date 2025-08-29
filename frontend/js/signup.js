/* global dcodeIO */

document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("signupUsername").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const age = document.getElementById("signupAge").value.trim();

        if (!username || !email || !password || !age) {
            alert("Please fill in all fields.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        if (users.some((u) => u.email === email)) {
            alert("This email is already registered. Try logging in.");
            return;
        }

        const hashedPassword = await dcodeIO.bcrypt.hash(password, 10);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            age
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedInUser", JSON.stringify(newUser));
        localStorage.setItem("userData", JSON.stringify(newUser));

        window.location.href = "account.html";
    });
});
