const scraper = require('./app');
const WebSocket = require('ws');
const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.finnhub_key}`);
const fetch = require('node-fetch');
const sendStockData = require('../socket/');
const { generateStocks, wipeStocks, getAllStocks } = require('../data/stocks');
const stocks = require('../data/stocks');
const { initializeCloudFirebase } = require('../config/firebaseConnections');
const admin = initializeCloudFirebase();


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
        console.log(topTickers)
        console.log("we got the top tickers")

        console.log("yeet")
        // topTickers = [{
        //     stock:'T'
        // }, {
        //         stock:'AMC'
        // }]
        // //topTickers.push({ stock: 'BINANCE:BTCUSDT', timesCounted: 0 }); // remove this as this is just test data

        topTickers.forEach(({ stock }) => {
            prices[stock] = [];
        });


        topTickers.forEach(({stock}) => {
            socket.send(JSON.stringify({ 'type': 'subscribe', 'symbol': `${stock}` }));
        });

        let allStocks = await getAllStocks();


        let allStockSymbols = []

        allStocks.forEach((stock) => {
            allStockSymbols.push(stock.symbol);
        })

       
        let topTickerStocks = topTickers.map((value) => {
            return value.stock
        });

       
        //get the new tickers to add by doing old - new
        let oldStocks = new Set(allStockSymbols);
        let differences = new Set(topTickerStocks.filter(element => !oldStocks.has(element)))
        differences = [...differences];

        console.log(differences) //tells us what new stocks there are

        //get the old tickers to delete by doing new - old 
        let newStocks = new Set(topTickerStocks);
        let stocksToDelete = new Set(allStockSymbols.filter(element => !newStocks.has(element)))
        stocksToDelete = [...stocksToDelete]

        console.log(stocksToDelete);

        await generateStocks(differences);
        console.log("generating")
        let refreshedStockObjs= await wipeStocks(stocksToDelete);
        console.log("wiped stocks")
        let refreshedStocks = refreshedStockObjs.map((item) => {
            return item.symbol
        })
        topTickers.forEach((item, index) => {
            if (!(refreshedStocks.includes(item))) {
                topTickers.splice(index, index);
            }
        })
        console.log(topTickers);
        await stocks.updateMentions(topTickers);
        
        socket.addEventListener('message', (event) => {
            let data = JSON.parse(event.data);
            //console.log('data', data);
            if (data.type === 'trade') {
                let totalPrices = {};

                data.data.forEach((data) => {
                    let symbol = data.s;
                    if (!(symbol in totalPrices)) {
                        totalPrices[symbol] = [data.p];
                    } else {
                        totalPrices[symbol].push(data.p);
                    }
                });
                Object.keys(totalPrices).forEach((symbol) => {
                    const avgPrice =  totalPrices[symbol].reduce((a,b)=>a+b, 0) / totalPrices[symbol].length;
                    prices[symbol].push({
                        symbol,
                        price: avgPrice
                    });
                    if (prices[symbol].length > 10) { // change this value to something bigger
                        let sum = 0;
                        prices[symbol].forEach((entry) => {
                            sum += entry.price;
                        });
                        //console.log(sum, prices[symbol]);
                        let filledAvgPrice = (sum / prices[symbol].length).toFixed(2);

                        prices[symbol] = [];

                        sendStockData(symbol, filledAvgPrice);
                    }
                })
                
                
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
    }, 43200000); // change this to 24 hours
});

const updateTickers = () => {
    for (const ticker of topTickers) {
        stocks.updateStockData(ticker.stock);
    }
}
setInterval(() => {
    const timenow = new Date();
    if (
        (0 < timenow.getDay() && timenow.getDay() < 6) &&
        (9 <= timenow.getHours() && timenow.getHours() < 17)
    ) updateTickers();
}, 600000);