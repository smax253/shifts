//Originally implemented by andrews1022.
//Original source code found here: https://github.com/andrews1022/reddit-stock-scraper
//Modified by Hamzah Nizami
// All credit goes to original implementer

// packages
const cheerio = require('cheerio');
const fetch =require('node-fetch');

// api
const BASE_URL = require('./api/api');

// data
const ERROR_MESSAGE = require('./data/errorMessage');
const invalidTickers = require('./data/invalidTickers');

// functions
const getPostHtml = require('./functions/getPostHtml');

const normalizeMentionsCount = (denoms, allSubTickers) => {
	let minimum = Math.min.apply(Math, denoms) / 100000; //calculate the minimum and scale it down by a factor of 100,000 (lets work with smaller numbers)
	for(let i = 0; i < allSubTickers.length; i++){ 
		for(let stockObj of allSubTickers[i]){
			stockObj.timesCounted *= minimum;
			stockObj.timesCounted /= (denoms[i] / 100000); //apply the proportion
		}
	}

	return allSubTickers	
}

const twoArrayObjectCombine = (arr1, arr2) => {
	const res = Object.values([...arr1, ...arr2].reduce((acc, { stock, timesCounted  }) => {
		if (acc[stock]) acc[stock].timesCounted  += parseInt(timesCounted);
		else acc[stock] = { stock, timesCounted : parseInt(timesCounted) };
		return acc;
	  }, {}));
	  return res;
}

const combineResults = (modifiedCountTickers) => {
	if(modifiedCountTickers.length === 1){ 
		return modifiedCountTickers[0]
	}

	while(modifiedCountTickers.length !== 1) { 
		let firstArrayObj = twoArrayObjectCombine(modifiedCountTickers[0], modifiedCountTickers[1]);
		modifiedCountTickers.splice(1, 1);
		modifiedCountTickers[0] = firstArrayObj
	}
	//console.log(modifiedCountTickers)
	return modifiedCountTickers;

}

//take in a list of strings of subreddits to query
const scrapeReddit = async (allSubreddits, topXTickers) => {
	// start user prompt/input
	let denominators = [];
	try {
		let allSubResults = [];
		
		for (let i = 0; i < allSubreddits.length; i++) {
			// fetch subreddit page html
			const response = await fetch(`${BASE_URL.BASE_URL}/r/${allSubreddits[i]}/`);
            
			const html = await response.text();

			// initialize cheerio
			const $ = cheerio.load(html);

			// grab all hrefs
			const hrefs = [];
			$('.thing .entry .top-matter .title a.title').each((i, el) => {
				hrefs[i] = $(el).attr('href');
			});

			const subscriberCount = $('.number');
			const subscribersAndActive = subscriberCount.text().split(',');
			let subscribers = "";
			for(let j = 0; j < subscribersAndActive.length; j++){ 
				if(subscribersAndActive[j].length > 3){ 
					let endOfFirstNum = subscribersAndActive[j].slice(0, 3);
					subscribersAndActive[j] = subscribersAndActive[j].slice(3)
					subscribersAndActive.splice(j, 0, endOfFirstNum);
					subscribers += subscribersAndActive[j]
					break;
				}
				subscribers += subscribersAndActive[j]
			}
			subscribers = parseInt(subscribers);
			denominators.push(subscribers);
			// filter the hrefs - only get hrefs that include the subreddit name (avoids links for ads)
			const filteredHrefs = hrefs.filter((href) => href.includes(`/r/${allSubreddits[i]}`));
			// call the getPostHtml fn
			const parsedHtml = await getPostHtml.getPostHtml(filteredHrefs);

			// ticker regex
			const regex = /\$?\b[A-Z]{1,4}\b/g;

			// extract all tickers matching the regex
			// this is including duplicates, as we want to count them later
			const tickers = parsedHtml
				.match(regex)
				.sort()
				.map((ticker) => ticker.replace('$', ''))
				.filter((ticker) => invalidTickers.invalidTickers.indexOf(ticker) < 0);

			// object structure {stock: 'TICKER_NAME_HERE', timesCounted: 1'}
			const countedTickers = [];

			tickers.forEach((ticker) => {
				// if not found...
				if (!countedTickers.filter((match) => match.stock === ticker).length) {
					// add it to array
					countedTickers.push({ stock: ticker, timesCounted: 1 });
				} else {
					// if already in the array, just increase timesCounted by 1
					countedTickers.find((dupe) => dupe.stock === ticker).timesCounted += 1;
				}
			});

			// sort tickers by timesCounted (highest to lowest)
			const sortedTickers = countedTickers.sort((tickerA, tickerB) =>
				tickerA.timesCounted < tickerB.timesCounted ? 1 : -1
			);

			const topTickers = sortedTickers.splice(0, topXTickers);
			allSubResults.push(topTickers);
		}
		let updatedCounts = normalizeMentionsCount(denominators, allSubResults)
		return combineResults(updatedCounts)

	} catch (error) {
		if (error) console.log(ERROR_MESSAGE.ERROR_MESSAGE);
	}
};

//scrapeReddit(["wallstreetbets", "stocks", "investing", "pennystocks"], 10); 

module.exports = { 
	scrapeReddit
}
