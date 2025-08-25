document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("signupUsername").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value.trim();
        const age = document.getElementById("signupAge").value.trim();

        if (!username || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        console.log(users);

        const existingUser = users.find((user) => user.email === email);
        if (existingUser) {
            alert("This email is already registered. Try logging in.");
            return;
        }

        const newUser = {
            username,
            email,
            password, // NOTE: This is plain text for now. In production, hash it.
            age
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("loggedInUser", JSON.stringify(newUser));

        alert("Signup successful! Redirecting to account...");
        window.location.href = "account.html";
    });
});
