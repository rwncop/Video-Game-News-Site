async function fetchNews() {
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = "<p>Loading gaming news...</p>";

    const RSS_URL = "https://www.thegamer.com/feed/";

    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`);
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "application/xml");
        const items = xml.querySelectorAll("item");

        newsContainer.innerHTML = ""; // Clear loading text

        items.forEach((item) => {
            const title = item.querySelector("title").textContent;
            const link = item.querySelector("link").textContent;
            const pubDate = new Date(item.querySelector("pubDate").textContent);
            const description = item.querySelector("description") ? item.querySelector("description").textContent : "No summary available.";

            // Format date with time
            const formattedDate = pubDate.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true
            });

            // Attempt to find an image (from enclosure or media:content)
            const enclosure = item.querySelector("enclosure");
            const imageUrl = enclosure ? enclosure.getAttribute("url") : null;
            const image = imageUrl ? imageUrl : "default-image.jpg"; // Default image if none found

            // Create a news article element
            const newsItem = document.createElement("div");
            newsItem.classList.add("news-item");
            newsItem.innerHTML = `
                <h2>${title}</h2>
                <p><strong>Published:</strong> ${formattedDate}</p>
                <img src="${image}" alt="Article image" />
                <p class="summary">${description}</p>
                <a href="${link}" target="_blank">Read more</a>
            `;
            newsContainer.appendChild(newsItem);
        });

        if (newsContainer.innerHTML === "") {
            newsContainer.innerHTML = "<p>No gaming news found.</p>";
        }

    } catch (error) {
        console.error("Error fetching gaming news:", error);
        newsContainer.innerHTML = `<p>Failed to load gaming news.</p>`;
    }
}

// Refresh news when button is clicked
document.getElementById("refresh-news").addEventListener("click", fetchNews);

// Load news when the page starts
fetchNews();
