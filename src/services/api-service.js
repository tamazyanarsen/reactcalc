export function sendPostRequest(body = {}, url = 'http://localhost:3001/api', headers = {
    "Accept": "application/json",
    'Content-Type': 'application/json'
}) {
    console.log('send to url', url);
    return fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });
}
