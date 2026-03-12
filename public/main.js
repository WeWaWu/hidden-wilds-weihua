//Search Through Entire Api
async function apiSearch() {
    const netlifyFunctionURL = "/.netlify/functions/search";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    };

    const response = await fetch(netlifyFunctionURL, options);
    const data = await response.json();

    console.log("API result:", data);
    return data;
}

//Search Through Specific Api using assessment code
async function apiSpecificSearch(searchTerm) {
    const netlifyFunctionURL = "/.netlify/functions/assessmentsSearch";
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            searchTerm: searchTerm
        })
    };

    const response = await fetch(netlifyFunctionURL, options);
    const data = await response.json();

    console.log("API result:", data);
    return data;
}

//Displaying the Animal Cards
async function displaySpecies() {
    let factsList = (await apiSearch()).assessments;

    //Shuffle (Randomize Card info)
    factsList = factsList.sort(() => Math.random() - 0.5);
    factsList = factsList.slice(0, 6);

    const cards = document.querySelectorAll(".card");

    //Cards
    for (let i = 0; i < cards.length; i++) {
        const facts = factsList[i];
        const specificFact = await apiSpecificSearch(facts.assessment_id);

        const card = cards[i];

        card.querySelector(".card-name").textContent =
            facts.taxon_scientific_name || "Unknown Name";

        card.querySelector(".card-text").innerHTML = `
            <li>Common Name: <p> ${specificFact.taxon.common_names[0]?.name || "Unknown"} </p></li>
            <li>Population Trend: <p> ${specificFact.population_trend.description.en || "Unknown"} </p></li>
            <li>Population Size: <p> ${specificFact.supplementary_info.population_size || "Unknown"} </p></li>
            <li>Habitat/Conditions: <p> ${specificFact.habitats[0]?.description.en || "No habitat info"} </p></li>
        `;

        // Read More Btn
        const btn = card.querySelector(".btn");
        btn.addEventListener("click", () => {
            btn.href = specificFact.url;
        });

        //Fav system
        const fav = card.querySelector(".favorite-star");

        fav.addEventListener("click", () => {
            const name = card.querySelector(".card-name").textContent;

            const facts = Array.from(card.querySelectorAll(".card-text li")).map(li => li.textContent);

            const favorite = { name, facts };

            let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

            // Prevent dupes
            if (!favorites.some(f => f.name === name)) {
                favorites.push(favorite);
                localStorage.setItem("favorites", JSON.stringify(favorites));
                displayFavorite(favorite, favorites.length - 1);
            }

            // Keeps star Yellow (Hopefully)
            fav.src = "images/star.png";
        });
    }
}
displaySpecies();

// Clear All Fav from LocalStrong & Sidebar
function clearAllFavorites() {
    localStorage.removeItem("favorites");
    loadFavorites();
}

// Load/Keep Fav after refresh
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const favlist = document.querySelector("#favList");
    const emptyMsg = document.querySelector("#emptyMsg")

    favlist.innerHTML = "";

    if (favorites.length === 0) {
        // Show Msg mode
        emptyMsg.textContent = "No favorites yet!";
        emptyMsg.disabled = true;
        emptyMsg.classList.remove("btn-danger");
        emptyMsg.classList.add("btn-secondary");
        return;
    }

    // Switch to Clear All mode
    emptyMsg.textContent = "Clear All Favorites";
    emptyMsg.disabled = false;
    emptyMsg.classList.remove("btn-secondary");
    emptyMsg.classList.add("btn-danger");
    emptyMsg.onclick = clearAllFavorites;

    favorites.forEach((fav, index) => {
        displayFavorite(fav, index);
    });
}
document.addEventListener("DOMContentLoaded", loadFavorites);

// Remove Fav
function removeFavorite(event) {
    const index = event.target.getAttribute("data-index");

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    loadFavorites();
}

// Displaying Fav on sidebar
function displayFavorite(favorite, index) {
    const favlist = document.querySelector("#favList");

    const item = document.createElement("li");
    item.classList.add("list-group-item", "d-flex", "justify-content-between");

    item.innerHTML = `
        <div>
            <strong>${favorite.name}</strong>
            <ul>${favorite.facts.map(f => `<li>${f}</li>`).join("")}</ul>
        </div>
        <button class="btn btn-sm btn-danger" data-index="${index}">X</button>
    `;

    favlist.appendChild(item);

    // Delete Fav
    item.querySelector("button").addEventListener("click", removeFavorite);
}