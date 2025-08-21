let allStories = []; // cache for all fetched stories

// Fetch Hacker News
async function fetchHackerNews() {
    const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const storyIds = await response.json();

    const stories = await Promise.all(
        storyIds.slice(0, 10).map(async id => {
            const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            const data = await storyResponse.json();
            return {
                title: data.title,
                url: data.url,
                author: data.by,
                score: data.score,
                source: "Hacker News",
                image: "assets/hackernews.png" // default HN icon
            };
        })
    );
    return stories;
}

// Fetch Dev.to
async function fetchDevTo() {
    const response = await fetch("https://dev.to/api/articles?top=10");
    const articles = await response.json();

    return articles.map(article => ({
        title: article.title,
        url: article.url,
        author: article.user.username,
        score: article.public_reactions_count,
        source: "Dev.to",
        image: article.social_image || "assets/devto.png"
    }));
}

// Master fetch
async function fetchAllSources() {
    try {
        const [hnStories, devtoStories] = await Promise.all([
            fetchHackerNews(),
            fetchDevTo()
        ]);

        allStories = [...hnStories, ...devtoStories];

        // Default load = All
        renderStories(getStoriesBySource("All"));
    } catch (error) {
        console.error("Error fetching sources:", error);
        document.dispatchEvent(new Event("newsLoaded"));
    }
}

// Filtering helper
function getStoriesBySource(source) {
    if (source === "All") {
        return [...allStories].sort((a, b) => (b.score || 0) - (a.score || 0));
    }
    return allStories.filter(story => story.source === source);
}

// Render
function renderStories(stories) {
    const container = document.getElementById("cards-placeholder");
    container.innerHTML = `<div class="card-container"></div>`;
    const cardContainer = container.querySelector(".card-container");

    stories.forEach(story => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <div class="card-image">
                <img src="${story.image}" alt="${story.source}">
            </div>
            <div class="category">${story.source}</div>
            <div class="heading">
                <a href="${story.url}" target="_blank">${story.title}</a>
                <div class="author">
                    By <span class="name">${story.author}</span> • ${story.score || 0} points
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    });

    document.dispatchEvent(new Event("newsLoaded"));
}

// ✅ Hook up navbar buttons
function setupFilterButtons() {
    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const source = button.textContent.trim(); // "All", "Hacker News", etc.
            renderStories(getStoriesBySource(source));
        });
    });
}

// Run once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    setupFilterButtons();
    fetchAllSources();
});
