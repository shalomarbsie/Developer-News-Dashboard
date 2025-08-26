const filterBtns = document.querySelectorAll(".filter-btn");

function getBtnByLabel(label) {
  return Array.from(filterBtns).find(
    (b) => b.textContent.trim().toLowerCase() === label.toLowerCase()
  );
}

filterBtns.forEach((btn) => {
    btn.addEventListener(
        "click",
        (e) => {
        const label = btn.textContent.trim().toLowerCase();

        if (label === "favorites") {
            const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

            if (!loggedInUser) {
                alert("Log in to see your favorite articles");

                e.stopImmediatePropagation();

                const allBtn = getBtnByLabel("all");
                if (allBtn) {
                    allBtn.click();
                }

                return;
            }
        }
        },
        true
    );
});
