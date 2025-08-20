async function fetchTopStories() {
    try {
        console.log("Fetching top stories…");
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();

        const stories = await Promise.all(
            storyIds.slice(0, 10).map(async id => {
                const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
                return storyResponse.json();
            })
        );

        renderStories(stories);
    } catch (error) {
        console.error("Error fetching Hacker News:", error);
        document.dispatchEvent(new Event("newsLoaded")); // make sure loader hides even on error
    }
}

function renderStories(stories) {
    const container = document.getElementById("cards-placeholder");
    container.innerHTML = `<div class="card-container"></div>`;
    const cardContainer = container.querySelector(".card-container");

    stories.forEach(story => {
        if (!story) return;

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-image">
                <img src="assets/stockphotocode.jpg" alt="HN article">
            </div>
            <div class="category"> Hacker News </div>
            <div class="heading">
                <a href="${story.url || "#"}" target="_blank">${story.title}</a>
                <div class="author">
                    By <span class="name">${story.by}</span> • ${story.score} points
                </div>
            </div>
        `;

        cardContainer.appendChild(card);
    });

    document.dispatchEvent(new Event("newsLoaded"));
}

fetchTopStories();
