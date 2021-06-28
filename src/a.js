const https = require('https');

https.get('https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=5c11ebffeec94be1a53221296fb72097', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        console.log(JSON.parse(data));
    });

})
.on("error", (err) => {
        console.log("Error: " + err.message);
});