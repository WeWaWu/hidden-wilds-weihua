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
    let factsList = (await apiSearch()).assessments;

    factsList = factsList.sort(() => Math.random() - 0.5);
    factsList = factsList.slice(0, 6);

    const cards = document.querySelectorAll(".card");

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

        const btn = card.querySelector(".btn");
        btn.addEventListener("click", () => {
            location.href = specificFact.url;
        });

        // const fav = card.querySelector(".card-img-top");
        // fav.addEventListener("click", )
    }
}
displaySpecies();