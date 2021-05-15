function subscribe(symbol) {
//check if already subscribed

axios.get('https://localhost:5000/?symbols=GME,TSLA,AAPL')
  .then((response) => {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });

}

function unsubscribe(symbol) {
//check if already subscribed

}