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

async function displaySpecies(facts, specificFact) {
    facts = (await apiSearch()).assessments[0];
    specificFact = (await apiSpecificSearch()).assessments[0];

    document.querySelector(".card-name").innerHTML =
        facts.taxon_scientific_name || "No name found";

    document.querySelector(".card-text").innerHTML = `
        "Category: " + ${ "Unknown"}
        "Population trend: " + ${facts.population_trend || "Unknown"}
        "Habitat: " + ${specificFact.habitats || "No habitat info"}
        "Threats: " + ${facts.threats || "No threat info"}`;
}

displaySpecies();