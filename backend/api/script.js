// const scraper = require('./app');

// setInterval( async () => {
//     let results = null;
//     results = await scraper.scrapeReddit(["wallstreetbets", "stocks", "investing", "pennystocks"], 5);
//     results = results[0]
//     results = results.sort((a,b) => {
//         return b.timesCounted - a.timesCounted;
//     });
// }, 180000);

// on interval of 12 or 24 hours run:
    // call hamzah's scraper, get the results push to db
    // call wipe
    // call through graphql mutation - 86400000