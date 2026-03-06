export default async function search() {
    try {
        const endpointURL = "https://api.iucnredlist.org/api/v4/red_list_categories/";
        const options = {
            method: "GET",
            headers: {
                "accept": "*/*",
                "Authorization": Netlify.env.get("SECRET-API-KEY")
            }
        };

        const response = await fetch(endpointURL, options);
        const data = await response.json();

        return new Response(
            JSON.stringify(data),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    catch(error) {
        return new Response(
            JSON.stringify({
                error: "Could not complete fetch call"
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}