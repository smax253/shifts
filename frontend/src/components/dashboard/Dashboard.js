import React, { useEffect, useMemo, useState } from 'react';
import { Grid } from '@material-ui/core';
import RoomList from '../shared/RoomList';
import fakeQueryData from '../../fakeQueryData';
import '../../styles/Dashboard.scss';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import queries from '../../queries';

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
  const allRoomsQuery = useQuery(queries.GET_ALL_ROOMS);

  const loading = useMemo(() => allRoomsQuery.loading, [allRoomsQuery]);
  const [activeRooms, setActiveRooms] = useState(null);
  useEffect(() => {

    if (allRoomsQuery.loading) setActiveRooms(null);
    else {

      const active = allRoomsQuery.data.rooms.map((item) => {

        return { ...item, active: item.activeUsers.length };
      
      })

      active.sort((a, b) => a.active - b.active);
      
      setActiveRooms(active);
    
    }
  
  }, [allRoomsQuery])
  return (
    loading ? <div>Loading...</div>
      : (
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
            {
              activeRooms
                ? <RoomList title="Active Rooms" tickerList={activeRooms} />
                : <div>Loading...</div>
            }
          </Grid>
        </Grid>
      )
  )

}

export default Dashboard;
