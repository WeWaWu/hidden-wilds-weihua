export default async function search(req) {
    console.log("Assessments Search Function RUNNING");
    try {
        const reqData = await req.json();
        console.log(reqData);

        const endpointURL = `https://api.iucnredlist.org/api/v4/assessment/${encodeURIComponent(reqData.searchTerm)}`;
        const options = {
            method: "GET",
            headers: {
                "accept": "application/json",
                "Authorization": Netlify.env.get("SECRET_API_KEY")
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
        console.error(error);
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