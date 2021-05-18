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

  // eslint-disable-next-line no-unused-vars
  const popular = fakeQueryData.topMovers;
  // eslint-disable-next-line no-unused-vars
  const myList = fakeQueryData.topMovers;
  const allRoomsQuery = useQuery(queries.GET_ALL_ROOMS);
  const topMoversQuery = useQuery(queries.GET_TOP_MOVERS);

  const loading = useMemo(() => allRoomsQuery.loading, [allRoomsQuery]);
  const [activeRooms, setActiveRooms] = useState(null);
  const [topMovers, setTopMovers] = useState(null);
  useEffect(() => {

    if(allRoomsQuery.data &&  allRoomsQuery.data.rooms){

      setActiveRooms(allRoomsQuery.data.rooms);
    
    }else {
      setActiveRooms(null);
    }
  
  }, [allRoomsQuery])

  useEffect(() => {

    if(topMoversQuery.data &&  topMoversQuery.data.topMovers){
      setTopMovers( topMoversQuery.data.topMovers );
    
    }else {
      setTopMovers(null);
    }
  
  }, [topMoversQuery])

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
                {
                  topMovers
                    ? <RoomList title="Top Movers" showPrices tickerList={topMovers} />
                    : <div>Loading...</div>
                }
              </Grid>
              <Grid item xs={12} sm={4} className='list-container'>
                {
                  activeRooms
                    ? <RoomList title="Popular" showPrices tickerList={activeRooms} />
                    : <div>Loading...</div>
                }
              </Grid>
              <Grid item xs={12} sm={4} className='list-container'>
                
                {
                  activeRooms
                    ? <RoomList title="My List" showPrices tickerList={activeRooms} />
                    : <div>Loading...</div>
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3} id="active-rooms">
            {
              activeRooms
                ? <RoomList title="Active Rooms" sortActive tickerList={activeRooms} />
                : <div>Loading...</div>
            }
          </Grid>
        </Grid>
      )
  )

}

export default Dashboard;
