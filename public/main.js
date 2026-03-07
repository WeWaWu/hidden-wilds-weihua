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

async function displaySpecies() {
    const facts = (await apiSearch()).assessments[0];
    const specificFact = (await apiSpecificSearch(facts.assessment_id));

    document.querySelector(".card-name").innerHTML =
        facts.taxon_scientific_name || "Unknown Name";

    document.querySelector(".card-text").innerHTML += `
        <li>Category: ${ "Unknown"} </li>
        <li>Population trend: ${facts.population_trend || "Unknown"}</li>
        <li>Habitat: ${specificFact.habitats[1].description.en || "No habitat info"}</li>
        <li>Threats: ${facts.threats || "No threat info"}</li>`;
}

displaySpecies();