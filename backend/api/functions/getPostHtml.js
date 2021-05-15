const fetch =require('node-fetch');
const BASE_URL = require('../api/api');
const ERROR_MESSAGE = require('../data/errorMessage');

const getPostHtml = async (hrefArr) => {
	let htmlToParse = '';

	for (const href of hrefArr) {
		try {
			const postResponse = await fetch(`${BASE_URL.BASE_URL}${href}`);
			const postHTML = await postResponse.text();

			htmlToParse += postHTML;

		} catch (error) {
			if (error) console.log(ERROR_MESSAGE);
            console.log(error);
		}
	}

	return htmlToParse;
};

// export default getPostHtml;
module.exports = {
    getPostHtml
}