 /**
 * CloudFlare Worker.
 *
 * Block access to given countries.
 */
addEventListener('fetch', event => {
    event.respondWith(block(event.request));
});

// Add countries to this Set to block them.
const countries = new Set([
    'US', // United States.
    'SG', // Singapore.
    'BR', // Brazil.
    'PK', // Pakistan.
    'NG' // Nigeria.
]);

/**
 * Block requests.
 *
 * @param {*} request User's request.
 */
async function block(request) {
    // Get country value from request headers.
    const country = request.headers.get('cf-ipcountry');

    // Find out if country is on the block list.
    const isCountryBlocked = countries.has(country);

    // If it's on the blocked list, give back a 403.
    if (isCountryBlocked) {
        return new Response(`SORRY: This page not available in your country!`, {
            status: 403,
            statusText: 'Forbidden'
        });
    }

    // Catch-all return of the original response.
    return await fetch(request);
}
