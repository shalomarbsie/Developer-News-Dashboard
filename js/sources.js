let allStories = [];
let currentFilter = "All"; // default category
let currentSearch = "";    // default search query

// --- Fetch Hacker News
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
                description: data.text || "", // add description if available
                image: "assets/hackernews.png"
            };
        })
    );
    return stories;
}

// --- Fetch Dev.to
async function fetchDevTo() {
    const response = await fetch("https://dev.to/api/articles?top=10");
    const articles = await response.json();

    return articles.map(article => ({
        title: article.title,
        url: article.url,
        author: article.user.username,
        score: article.public_reactions_count,
        source: "Dev.to",
        description: article.description || "",
        image: article.social_image || "assets/devto.png"
    }));
}

// --- Master fetch
async function fetchAllSources() {
    try {
        const [hnStories, devtoStories] = await Promise.all([
            fetchHackerNews(),
            fetchDevTo()
        ]);

        allStories = [...hnStories, ...devtoStories];
        renderStories(getFilteredStories());
    } catch (error) {
        console.error("Error fetching sources:", error);
        document.dispatchEvent(new Event("newsLoaded"));
    }
}

// --- Filtering logic
function getFilteredStories() {
    let stories = (currentFilter === "All")
        ? [...allStories].sort((a, b) => (b.score || 0) - (a.score || 0))
        : allStories.filter(story => story.source === currentFilter);

    if (currentSearch) {
        const query = currentSearch.toLowerCase();
        stories = stories.filter(story =>
            story.title.toLowerCase().includes(query) ||
            story.description.toLowerCase().includes(query)
        );
    }

    return stories;
}

// --- Render
function renderStories(stories) {
    const container = document.getElementById("cards-placeholder");
    container.innerHTML = `<div class="card-container"></div>`;
    const cardContainer = container.querySelector(".card-container");

    if (stories.length === 0) {
        cardContainer.innerHTML = `<p class="no-results">No results found.</p>`;
    }

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

// --- Navbar filters
function setupFilterButtons() {
    document.querySelectorAll(".filter-btn").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            currentFilter = button.textContent.trim();
            renderStories(getFilteredStories());
        });
    });
}

// --- Search input
function setupSearch() {
    const searchInput = document.querySelector(".input");
    searchInput.addEventListener("input", e => {
        currentSearch = e.target.value.trim();
        renderStories(getFilteredStories());
    });
}

// --- Init
document.addEventListener("DOMContentLoaded", () => {
    setupFilterButtons();
    setupSearch();
    fetchAllSources();
});
