async function apiSearch(searchTerm) {
    const netlifyFunctionURL = "/.netlify/functions/search";
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

function displaySpecies(facts) {
    document.querySelector(".card-name").innerHTML =
        facts.scientific_name || "No name found";

    document.querySelector(".card-text").innerHTML = `
        "Category: " + ${facts.category || "Unknown"}
        "Population trend: " + ${facts.population_trend || "Unknown"}
        "Habitat: " + ${facts.habitat || "No habitat info"}
        "Threats: " + ${facts.threats || "No threat info"}`;
}

async function searchAndDisplay(term) {
    const speciesData = await apiSearch(term);
    displaySpecies(speciesData);
}

searchAndDisplay();