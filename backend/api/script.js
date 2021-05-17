const scraper = require('./app');
const WebSocket = require('ws');
const socket = new WebSocket('wss://ws.finnhub.io?token=c2feaaqad3ien4445gh0');
const fetch = require('node-fetch');
const sendStockData = require('../socket/');

let prices = {};
let topTickers = [];

/**
 * takes in ticker symbol and unsubs from it
 * @param {string} symbol 
 */
const unsubscribe = (symbol) => {
    socket.send(JSON.stringify({'type':'unsubscribe','symbol': symbol}))
}

/**
 * 
 * @returns array of top tickers from scraper
 */
const fetchTopTickers = async () => {
    let results = await scraper.scrapeReddit(["wallstreetbets", "stocks", "investing", "pennystocks"], 5);
    results = results[0];
    results = results.sort((a,b) => {
        return b.timesCounted - a.timesCounted;
    });

    return results;
}

/**
 * Grabs list of tickers and sets global variable. Then offsets the messages
 * per second to reduce the amount of data being sent to the server by adding to
 * an array and checking to see once a ticker has received enough trades. Then it
 * wipes the old database with these tickers and adds in the new ones every 24 hours.
 */
const runScript = async () => {
    try {
        topTickers = await fetchTopTickers();
        topTickers.push({ stock: 'BINANCE:BTCUSDT', timesCounted: 0 }); // remove this as this is just test data

        topTickers.forEach(({ stock }) => {
            prices[stock] = [];
        });

        console.log("prices", prices);

        topTickers.forEach(({stock}) => {
            socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': `${stock}` }));
        });

        // drop database here?
        // and add in the database

        socket.addEventListener('message', (event) => {
            let data = JSON.parse(event.data);
            if (data.type === 'trade') {
                data = data.data;
                let totalPrice = 0;
                let symbol = data[0].s;

                data.forEach((value) => {
                    totalPrice += value.p;
                });
                let avgPrice = totalPrice / data.length;
                
                prices[symbol].push({
                    symbol,
                    price: avgPrice
                });

                if (prices[symbol].length > 10) { // change this value to something bigger
                    let sum = 0;
                    prices[symbol].forEach((entry) => {
                        sum += entry.price;
                    });
                    let filledAvgPrice = (sum / 10).toFixed(2);

                    prices[symbol] = [];

                    // console.log(filledAvgPrice); // replace with socket call
                    sendStockData(symbol, filledAvgPrice);
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
}

socket.addEventListener('open', async () => {
    runScript();

    setInterval(async () => {
        socket.removeEventListener('message');

        topTickers.forEach((value) => {
            unsubscribe(value.stock);
        });

        runScript();
    }, 900000); // change this to 24 hours
});
