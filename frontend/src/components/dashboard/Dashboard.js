import React from 'react';
import { Grid } from '@material-ui/core';
import RoomList from '../shared/RoomList';
import fakeQueryData from '../../fakeQueryData';
import '../../styles/Dashboard.scss';
import PropTypes from 'prop-types';

const StockItem = ({name, change}) => {

  const value = change > 0 ? '+'+change : ''+change;

  return (
    <Grid xs={12} sm={4} className="top-stock-item">
      <div>
        {name} <span className={change > 0 ? 'positive' : 'negative'}>{value}</span>
      </div>
    </Grid>
  )

}
StockItem.propTypes = {
  name: PropTypes.string.isRequired,
  change: PropTypes.number.isRequired,
}

const TopStockTickers = () => {

  const stockData = fakeQueryData.topStockData;
  return (
    <Grid container className="full-height">
      <StockItem name="NASDAQ" change={stockData.NASDAQ}/>
      <StockItem name="SP500" change={stockData.SP500}/>
      <StockItem name="Dow Jones" change={stockData.DOW}/>
    </Grid>
  )

}

const Dashboard = () => {

  const topMovers = fakeQueryData.topMovers;
  const popular = fakeQueryData.topMovers;
  const myList = fakeQueryData.topMovers;
  const active = fakeQueryData.activeRooms;
  return (
    <Grid container spacing={3} id="dashboard">
      <Grid item xs={12} sm={9} id="right-dashboard">
        <Grid item xs={12} className="top-stocks" id="top-stocks">
          <TopStockTickers/>
        </Grid>
        <Grid container>
          <Grid item xs={12} sm={4} className='list-container'>
            <RoomList title="Top Movers" tickerList={topMovers} showPrices/>
          </Grid>
          <Grid item xs={12} sm={4} className='list-container'>
            <RoomList title="Popular" tickerList={popular} showPrices/>
          </Grid>
          <Grid item xs={12} sm={4} className='list-container'>
            <RoomList title="My List" tickerList={myList} showPrices/>   
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={3} id="active-rooms">
        <RoomList title="Active Rooms" tickerList={active} />    
      </Grid>
    </Grid>
  )

}

export default Dashboard;
