const topMovers = [
  {
    ticker: 'TSLA',
    companyName: 'Tesla',
    change: 18.5
  },
  {ticker: 'GME', companyName: 'Gamestop', change: 12.2},
  {ticker: 'GME', companyName: 'Gamestop', change: -12.2},
  {ticker: 'GME', companyName: 'Gamestop', change: 10.2},
  {ticker: 'GME', companyName: 'Gamestop', change: -12.2},
  {ticker: 'GME', companyName: 'Gamestop', change: 4.3},
  {ticker: 'GME', companyName: 'Gamestop', change: 12.2},
  {ticker: 'GME', companyName: 'Gamestop', change: 12.2},
]

const activeRooms = [
  {
    ticker: 'TSLA',
    companyName: 'Tesla',
    active: 1231
  },
  {ticker: 'GME', companyName: 'Gamestop', active: 1100},
  {ticker: 'GME', companyName: 'Gamestop', active: 854},
  {ticker: 'GME', companyName: 'Gamestop', active: 730},
  {ticker: 'GME', companyName: 'Gamestop', active: 640},
  {ticker: 'GME', companyName: 'Gamestop', active: 592},
  {ticker: 'GME', companyName: 'Gamestop', active: 483},
  {ticker: 'GME', companyName: 'Gamestop', active: 332},
]

const topStockData ={
  NASDAQ: 14.2,
  SP500: -4.3,
  DOW: 5.3
}

const stockData = {
  chart:[
    {date: '5/12/2021', price:5.30},
    {date: '5/13/2021', price:5.60},
    {date: '5/14/2021', price:5.10},
    {date: '5/15/2021', price:5.80},
    {date: '5/16/2021', price:6.40},
    {date: '5/17/2021', price:4.20},
    {date: '5/17/2021', price:7.20},
  ],
  summary: {
    name: 'Tesla Inc.',
    ticker: 'TSLA',
    price: 7.20,
    change:{
      day: 3.0,
      week: 1.9,
      month: -1.32,
      threeMonth: 3.23,
      year: 5.92,
      fiveYear: -7.21,
    }
  }
}

const users = [
  {
    id: '123',
    name: 'dkimball'
  },
  {
    id: '5432',
    name: 'hniz'
  },
  {
    id: '1241451',
    name: 'ealtenburg'
  },
  {
    id: '6568945',
    name: 'mshi'
  }
]

const messages = [
  {
    author: {
      id: '5432',
      username: 'ealtenburg' 
    },
    time: '5/13 10:34AM',
    text: 'There\'s a pump and dump scheme going on here. I\'m thinking its crashing at 3PM today.'
  },
  {
    author: {
      id: '5432',
      username: 'hniz' 
    },
    time: '5/13 11:11AM',
    text: 'Ramadan SHEEEEEEEEESHHH'
  },
  {
    author: {
      id: '6568945',
      username: 'mshi' 
    },
    time: '5/14 5:33PM',
    text: 'You know what\'s cool? Tesla. You see a motorcycle. I see a environment destroying pollution ridden machine that exists solely to make this guy feel better about his tiny dick at the cost of our planet. How can people say this bullshit is \'cool\'?'
  },
  {
    author: {
      id: '123',
      username: 'dkimball' 
    },
    time: '5/14 5:59PM',
    text: 'I agree with @mshi'
  },
  {
    author: {
      id: '5432',
      username: 'ealtenburg' 
    },
    time: '5/14 6:12PM',
    text: 'Ayo tesla been kinda sus lately... anyone else agree?'
  }
]

export default {topMovers, topStockData, activeRooms, stockData, users, messages}