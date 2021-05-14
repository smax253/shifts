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

export default {topMovers, topStockData, activeRooms}