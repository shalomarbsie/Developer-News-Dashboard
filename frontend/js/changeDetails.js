document.addEventListener("DOMContentLoaded", () => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (!userData) {
        window.location.href = "login.html";
        return;
    }

    const form = document.getElementById("changeForm");
    const backBtn = document.getElementById("backBtn");

    document.getElementById("newUsername").value = userData.username || "";
    document.getElementById("newEmail").value = userData.email || "";
    document.getElementById("newAge").value = userData.age || "";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedUsername = document.getElementById("newUsername").value.trim();
        const updatedEmail = document.getElementById("newEmail").value.trim();
        const updatedAge = document.getElementById("newAge").value.trim();
        const updatedPassword = document.getElementById("newPassword").value.trim();

        if (!updatedUsername || !updatedEmail || !updatedAge) {
            alert("Please fill out all fields (password is optional).");
            return;
        }

        const noChanges =
            updatedUsername === userData.username &&
            updatedEmail === userData.email &&
            updatedAge === userData.age &&
            !updatedPassword; // password left empty means no change

        if (noChanges) {
            alert("No changes detected. Please update a field before saving.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        let hashedPassword = userData.password; // default to existing hash
        if (updatedPassword) {
            hashedPassword = await bcrypt.hash(updatedPassword, 10);
        }

        users = users.map(user => {
            if (user.email === userData.email) {
                return {
                    ...user,
                    username: updatedUsername,
                    email: updatedEmail,
                    age: updatedAge,
                    password: updatedPassword || user.password,
                };
            }
            return user;
        });

        localStorage.setItem("users", JSON.stringify(users));

        const updatedUser = users.find(u => u.email === updatedEmail);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

        alert("Account details updated successfully!"); 
        window.location.href = "account.html";
    });

    // Back button
    backBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const confirmLeave = confirm("Changes haven't been saved, are you sure you want to leave?");
        if (!confirmLeave) return;

        window.location.href = "account.html";
    });
});
