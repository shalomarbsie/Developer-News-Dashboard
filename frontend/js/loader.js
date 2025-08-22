export function showSkeletons(count = 12) {
    const container = document.getElementById("cards-placeholder");
    container.innerHTML = `<div class="card-container"></div>`;
    const cardContainer = container.querySelector(".card-container");

    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement("div");
        skeleton.classList.add("card", "skeleton-card");
        skeleton.innerHTML = `
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-text-block"></div>
        `;
        cardContainer.appendChild(skeleton);
    }
}

export function hideSkeletons() {
    const container = document.getElementById("cards-placeholder");
    container.innerHTML = "";
}
