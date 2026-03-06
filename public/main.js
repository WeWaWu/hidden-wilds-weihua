async function apiSearch(searchTerm) {
    const netlifyFunctionURL = "/.netlify/functions/search";
    const options = {
        method: "GET"
    };

    const response = await fetch(netlifyFunctionURL, options);
    const data = response.json();

    console.log(data);
}