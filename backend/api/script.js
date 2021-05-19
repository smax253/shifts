const scraper = require('./app');
const WebSocket = require('ws');
const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.finnhub_key}`);

const fetch = require('node-fetch');
const { generateStocks, wipeStocks, getAllStocks } = require('../data/stocks');
const stocks = require('../data/stocks');
const { initializeCloudFirebase } = require('../config/firebaseConnections');
const admin = initializeCloudFirebase();
const io = require('socket.io-client');
const { workerData } = require('worker_threads');

const socketio = io(`${process.env.backend_base_uri}:${workerData.socketioport}`, { query: { userToken: workerData.password }, forceNew: false });

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
    let results = await scraper.scrapeReddit(["wallstreetbets", "stocks", "investing", "pennystocks"], 2);
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

        let presets = [
            {
                stock: 'MSFT',
                timesCounted: 0
            },
            {
                stock: 'AAPL',
                timesCounted: 0
            },
            {
                stock: 'SNAP',
                timesCounted: 0
            },
            {
                stock: 'TSLA',
                timesCounted: 0
            },
            {
                stock: 'NFLX',
                timesCounted: 0
            },
            {
                stock: 'GOOG',
                timesCounted: 0
            },
            {
                stock: 'FB',
                timesCounted: 0
            },
        ];

        let all = await getAllStocks();
        presets.forEach(({ stock }, index) => {
            if (all.includes(stock)) {
                presets.splice(index, index)
            }
        });
        topTickers = [...presets, ...topTickers];

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

       
        //get the new tickers to add by doing old - new
        let oldStocks = new Set(allStockSymbols);
        let differences = new Set(topTickers.filter(({stock}) => !oldStocks.has(stock)))
        differences = [...differences];

        let topTickerStocks = topTickers.map((value) => {
            return value.stock
        });

        //get the old tickers to delete by doing new - old 
        let newStocks = new Set(topTickerStocks);
        let stocksToDelete = new Set(allStockSymbols.filter(element => !newStocks.has(element)))
        stocksToDelete = [...stocksToDelete];

        await generateStocks(differences);

        if (stocksToDelete.length !== 0) {
            let refreshedStockObjs= await wipeStocks(stocksToDelete);
        }
 
        socket.addEventListener('message', (event) => {
            let data = JSON.parse(event.data);

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
                        let filledAvgPrice = (sum / prices[symbol].length).toFixed(2);

                        prices[symbol] = [];
                        socketio.emit('price-update', symbol, filledAvgPrice);
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
    console.log('updating all stocks...')
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