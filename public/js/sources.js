import { showSkeletons } from "./loader.js";

let allStories = [];
let currentFilter = "All";
let currentSearch = "";
let storiesPerPage = 50;
let currentIndex = 0;

// Fetch Hacker News
async function fetchHackerNews() {
    const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const storyIds = await response.json();

    const stories = await Promise.all(
        storyIds.slice(0, 50).map(async id => {
            const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            const data = await storyResponse.json();
            return {
                title: data.title,
                url: data.url,
                author: data.by,
                score: data.score,
                source: "Hacker News",
                description: data.text || "", 
                image: "../assets/hackernews.png",
                publishedAt: new Date(data.time * 1000)
            };
        })
    );
    return stories;
}

// Fetch Dev.to
async function fetchDevTo() {
    const response = await fetch("https://dev.to/api/articles?per_page=50");
    const articles = await response.json(); 

    return articles.map(article => ({
        title: article.title,
        url: article.url,
        author: article.user.username,
        score: article.public_reactions_count,
        source: "Dev.to",
        description: article.description || "",
        image: "../assets/devto.png",
        publishedAt: new Date(article.published_at)
    }));
}

// Helper for safe fetch with JSON parsing
async function safeFetchJson(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (err) {
        console.warn(`safeFetchJson failed for ${url}:`, err);
        return null;
    }
}

async function fetchReddit(subreddit = "programming") {
    const localUrl = `http://localhost:3000/reddit/${encodeURIComponent(subreddit)}`;
    const vercelUrl = `/api/reddit?subreddit=${encodeURIComponent(subreddit)}`;

    let data = await safeFetchJson(localUrl);
    if (!data) {
        console.info(`fetchReddit: local proxy failed, trying fallback: ${vercelUrl}`);
        data = await safeFetchJson(vercelUrl);
    }

    if (!data || !data.data || !Array.isArray(data.data.children)) {
        console.warn("fetchReddit: no reddit data available from any endpoint.", { localUrl, vercelUrl, data });
        return [];
    }

    return data.data.children.map(post => ({
        title: post.data.title,
        url: post.data.url,
        author: post.data.author,
        score: post.data.score,
        source: "Reddit",
        description: post.data.selftext || "",
        image: "../assets/reddit.png",
        publishedAt: new Date(post.data.created_utc * 1000)
    }));
}

// Master fetch
async function fetchAllSources() {
    showSkeletons();
    try {
        const [hnStories, devtoStories, redditStories] = await Promise.all([
            fetchHackerNews(),
            fetchDevTo(),
            fetchReddit("programming")
        ]);

        allStories = [...hnStories, ...devtoStories, ...redditStories];
        allStories.sort((a, b) => b.publishedAt - a.publishedAt); 

        resetAndRender();
    } catch (error) {
        console.error("Error fetching sources:", error);
    }
}
// Get filtered stories
function getFilteredStories() {
    const loggedInUser = localStorage.getItem("loggedInUser");

    let stories = (currentFilter === "All")
        ? [...allStories]
        : allStories.filter(story => story.source === currentFilter);

    if (currentFilter === "Favorites") {
        if (!loggedInUser) {
            showLoginMessage(); 
            return [];
        }

        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        stories = allStories.filter(story => favorites.includes(story.url));
    }

    if (currentSearch) {
        const query = currentSearch.toLowerCase();
        stories = stories.filter(story =>
            story.title.toLowerCase().includes(query) ||
            story.description.toLowerCase().includes(query)
        );
    }

    return stories;
}

// Show login message
function showLoginMessage() {
    const container = document.getElementById("cards-placeholder");
    container.innerHTML = `
        <div class="login-message" style="text-align:center; margin-top: 50px; font-size: 1.2rem;">
            Log in to add favorite articles
        </div>
    `;
}

// Truncate words
function truncateWords(str, numWords) {
  if (!str) return "";
  const words = str.split(/\s+/);
  return words.length > numWords 
    ? words.slice(0, numWords).join(" ") + "…" 
    : str;
}

// Render chunk of stories
export function renderStoriesChunk(stories) {
    const container = document.getElementById("cards-placeholder");
    let cardContainer = container.querySelector(".card-container");
    if (!cardContainer) {
        container.innerHTML = `<div class="card-container"></div>`;
        cardContainer = container.querySelector(".card-container");
    }

    const chunk = stories.slice(currentIndex, currentIndex + storiesPerPage);

    chunk.forEach(story => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="card-image">
                <img src="${story.image}" alt="${story.source}">
            </div>
            <div class="category">${story.source}</div>
            <div class="heading">
                <a href="${story.url || "#"}" target="_blank">${truncateWords(story.title, 10)}</a>
            </div>
            <div class="card-footer">
                <div class="author">
                    By <span class="name">${story.author || "Unknown"}</span>
                    <div class="date">${story.publishedAt.toLocaleDateString()}</div>
                </div>
                <div class="favorite-icon" data-url="${story.url}">&#9734;</div>
            </div>
        `;
        cardContainer.appendChild(card);
    });

    currentIndex += chunk.length;
    attachFavorites(cardContainer);
}

// Reset and render (for new filter/search)
function resetAndRender() {
    currentIndex = 0;
    const container = document.getElementById("cards-placeholder");
    container.innerHTML = `<div class="card-container"></div>`;
    renderStoriesChunk(getFilteredStories());
}

// Favorite icons
function attachFavorites(cardContainer) {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const loggedInUser = localStorage.getItem("loggedInUser");

    cardContainer.querySelectorAll(".favorite-icon").forEach(icon => {
        const url = icon.dataset.url;
        if (favorites.includes(url)) {
            icon.classList.add("active");
            icon.innerHTML = "★"; 
        } else {
            icon.innerHTML = "☆";
        }

        icon.addEventListener("click", () => {
            if(!loggedInUser) {
                alert("Log in to favorite articles");
                return;
            }

            if (favorites.includes(url)) {
                favorites.splice(favorites.indexOf(url), 1);
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

// Filters
function setupFilterButtons() {
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentFilter = button.textContent.trim();
            resetAndRender();
        });
    });
}

// Search
function setupSearch() {
    const searchInput = document.querySelector(".input");
    searchInput.addEventListener("input", e => {
        currentSearch = e.target.value.trim();
        resetAndRender();
    });
}

// Max cards to render
const MAX_STORIES = 150;

// extend scroll
window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Check if near bottom
    if (scrollTop + windowHeight >= documentHeight - 100) {
        const filteredStories = getFilteredStories();

        // Limit total rendered cards to MAX_STORIES
        if (currentIndex < filteredStories.length && currentIndex < MAX_STORIES) {
            renderStoriesChunk(filteredStories);
        }
    }
});


// Redirects to account.html
document.getElementById('accountBtn').addEventListener('click', () => {
    window.location.href = '/account.html';
});

// Init
document.addEventListener("DOMContentLoaded", () => {
    setupFilterButtons();
    setupSearch();
    fetchAllSources();
});
