let allStories = [];
let currentFilter = "All"; 
let currentSearch = "";

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
                description: data.text || "", 
                image: "assets/hackernews.png",
                publishedAt: new Date(data.time * 1000)
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
        description: article.description || "",
        image: "assets/devto.png",
        publishedAt : new Date(article.published_at)
    }));
}

async function fetchReddit(subreddit = "programming") {
    const response = await fetch(`http://localhost:3000/reddit/${subreddit}`);
    const data = await response.json();

    return data.data.children.map(post => ({
        title: post.data.title,
        url: post.data.url,
        author: post.data.author,
        score: post.data.score,
        source: "Reddit",
        description: post.data.selftext || "",
        image:  "assets/reddit.png",
        publishedAt: new Date(post.data.created_utc * 1000)
    }));
}



// Master fetch
async function fetchAllSources() {
    try {
        const [hnStories, devtoStories, redditStories] = await Promise.all([
            fetchHackerNews(),
            fetchDevTo(),
            fetchReddit("programming")
        ]);

        allStories = [...hnStories, ...devtoStories, ...redditStories];
        console.log(allStories)

        renderStories(getFilteredStories());
    } catch (error) {
        console.error("Error fetching sources:", error);
        document.dispatchEvent(new Event("newsLoaded"));
    }
}

// Filtering logic
function getFilteredStories() {
    let stories = (currentFilter === "All")
        ? [...allStories]
        : allStories.filter(story => story.source === currentFilter);

    if (currentSearch) {
        const query = currentSearch.toLowerCase();
        stories = stories.filter(story =>
            story.title.toLowerCase().includes(query) ||
            story.description.toLowerCase().includes(query)
        );
    }

    stories.sort((a, b) => b.publishedAt - a.publishedAt)
    return stories;
}

// Render
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
                <a href="${story.url || "#"}" target="_blank">${story.title}</a>
            </div>
            <div class="card-footer">
                <div class="author">
                    By <span class="name">${story.author || "Unknown"}</span> • ${story.score ? `${story.score} points` : ""} 
                    <div class="date">
                        ${story.publishedAt.toLocaleDateString()}
                    </div>
                </div>
                <div class="favorite-icon" data-url="${story.url}">&#9734;</div>
            </div>
        `;

        cardContainer.appendChild(card);
    });

    document.dispatchEvent(new Event("newsLoaded"));

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    cardContainer.querySelectorAll(".favorite-icon").forEach(icon => {
        const url = icon.dataset.url;
        if (favorites.includes(url)) {
            icon.classList.add("active");
            icon.innerHTML = "★"; 
        } else {
            icon.innerHTML = "☆";
        }

        icon.addEventListener("click", () => {
            if (favorites.includes(url)) {
                const index = favorites.indexOf(url);
                favorites.splice(index, 1);
                icon.classList.remove("active");
                icon.innerHTML = "☆";
            } else {
                favorites.push(url);
                icon.classList.add("active");
                icon.innerHTML = "★";
            }
            localStorage.setItem("favorites", JSON.stringify(favorites));
        });
    });
}

// Navbar filters
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

// Search input
function setupSearch() {
    const searchInput = document.querySelector(".input");
    searchInput.addEventListener("input", e => {
        currentSearch = e.target.value.trim();
        renderStories(getFilteredStories());
    });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
    setupFilterButtons();
    setupSearch();
    fetchAllSources();
});
