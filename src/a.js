const https = require('https');
const { url } = require('inspector');

https.get('https://newsapi.org/v2/top-headlines?country=in&q=cricket&category=sports&apiKey=5c11ebffeec94be1a53221296fb72097', (resp) => {
    let data = '';

    // A chunk of data has been received.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        N=JSON.parse(data).articles.length;
        for (let i = 0; i < 10; i++) {
            title=JSON.parse(data).articles[i].title;
            urls=JSON.parse(data).articles[i].url;
            description=JSON.parse(data).articles[i].description;
            content=JSON.parse(data).articles[i].content;
        }
    });

})
.on("error", (err) => {
        console.log("Error: " + err.message);
});