/* eslint-disable indent */
import { Grid } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/Room.scss'
import RoomList from '../shared/RoomList';
import Chart from './Chart';
import PropTypes from 'prop-types';
import UserList from './UserList';
import ChatBox from './ChatBox';
import { useApolloClient, useQuery } from '@apollo/client';
import queries from '../../queries';

const StockDataSummary = ({name, symbol, data, daily, currentPrice, userToken, isFavorite, stockInfo}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const client = useApolloClient();
    
  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const change = {};
  data.forEach((item) => {

    change[item.date] = item.value;
  
  })
  daily.forEach(item => {
    change[item.date] = item.value;
  })
  const price = currentPrice || change.c;
  
  const calcPercentage = (difference) => {

    const percent = `${(difference / price * 100).toFixed(2)}%`;
    return ` (${difference > 0 ? '+' + percent : percent})`;

  }

  const renderNumber = (value) => {
    if (Number.isNaN(+value)) {
      return <div className={'neutral'}>
        <span className="price-value">-- </span>
        <span className="price-change">(--%)</span>
      </div>
    }
    value = price - value;
    return <div className={value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral'}>
      <span className="price-value">{value > 0 ? '+' + (value.toFixed(2)) : value.toFixed(2)}</span>
      <span className="price-change">{calcPercentage(value)}</span>
    </div>
  
  }

  const toggleFavorite = React.useCallback(async() => {
    let mutation;
    if (favorite) {
      mutation = queries.REMOVE_FAVORITE;
    } else {
      mutation = queries.ADD_FAVORITE;
    }
    await client.mutate({
      mutation, variables: {
        userToken,
        ticker: symbol
      }
    });
    setFavorite(!favorite);
    
  }, [favorite])
  return (
    <div className="stock-data-summary">
      <div id="company-title">
        <div id="company-name">{name}</div>
        <div>
          <button onClick={toggleFavorite}>{favorite ? 'Unfavorite' : 'Favorite'}</button>
          {symbol}
        </div>
      </div>
      
      <div id="current-price"><div id="price">{price}</div>{renderNumber(change.pc)}</div>
      
      <div><div>1 Day</div>{renderNumber(change['1d'])}</div>
      <div><div>1 Week</div>{renderNumber(change['1w'])}</div>
      <div><div>1 Month</div>{renderNumber(change['1m'])}</div>
      <div><div>3 Months</div>{renderNumber(change['3m'])}</div>
      <div><div>6 Months</div>{renderNumber(change['6m'])}</div>
      <div><div>1 Year</div>{renderNumber(change['1y'])}</div>
      <div><div>5 Years</div>{renderNumber(change['5y'])}</div>
      <div><div>Asset Type</div>{stockInfo.assetType ? stockInfo.assetType : 'N/A'}</div>
      <div><div>Analyst Target Price</div>{stockInfo.analystTargetPrice ? stockInfo.analystTargetPrice : 'N/A'}</div>
      <div><div>Description</div>{stockInfo.description ? stockInfo.description : 'N/A'}</div>
      <div><div>Industry</div>{stockInfo.industry ? stockInfo.industry : 'N/A'}</div>
      <div><div>Stock Exchange</div>{stockInfo.exchange ? stockInfo.exchange : 'N/A'}</div>    
    </div>
  );

}

StockDataSummary.propTypes = {
  data: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  daily: PropTypes.array.isRequired,
  currentPrice: PropTypes.number,
  isFavorite: PropTypes.bool,
  userToken: PropTypes.string.isRequired,
  stockInfo: PropTypes.object.isRequired
}

const Room = ({ id, messages, setMessages, price, userToken }) => {

  const [chartMode, setChartMode] = React.useState('1m');
  //const [, setCurrentPrice] = React.useState(0);
  const [chartData, setChartData] = React.useState(undefined);
  const [users, setUsers] = React.useState(undefined);
  const [isFavorite, setIsFavorite] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const getStockQuery = useQuery(queries.GET_STOCK_DATA,
    {
      variables: {
        ticker: id.toUpperCase()
      }
    }
  )
  const getRoomQuery = useQuery(queries.GET_ROOM_DATA, { fetchPolicy:'no-cache', variables: { ticker: id.toUpperCase() } });
  const allRoomsQuery = useQuery(queries.GET_ALL_ROOMS);
  const favoriteRooms = useQuery(queries.GET_FAVORITE_ROOMS,
    {
      variables: {userToken}
    }
  )
  const allStockInfo = useQuery(queries.GET_STOCK_INFO, { fetchPolicy: 'no-cache', variables: { symbol: id } });
//   if (allStockInfo && allStockInfo.data && allStockInfo.data.getStock) console.log('allStockInfo', allStockInfo.data.getStock.stockInfo);
    
  useEffect(() => {
    
    if (favoriteRooms.data && favoriteRooms.data.getUserFavorites) {
      const exists = favoriteRooms.data.getUserFavorites.find(item => item.stockSymbol === id.toUpperCase()) ? true : false;
      setIsFavorite(exists);
    }
  }, [favoriteRooms.data])

  const [activeRooms, setActiveRooms] = useState(null);
  useEffect(() => {

    if (allRoomsQuery.loading) setActiveRooms(null);
    else {

      const active = allRoomsQuery.data.rooms.map((item) => {

        return { ...item, active: item.activeUsers.length };
      
      }).filter((item) => item.stockSymbol !== id.toUpperCase());
      active.sort((a, b) => a.active - b.active);
      setActiveRooms(active);
      
    }
  
  }, [allRoomsQuery, id])

  useEffect(() => {

    if (getRoomQuery.data && getRoomQuery.data.getRoom) {

      setUsers(getRoomQuery.data.getRoom.activeUsers);
      setMessages(getRoomQuery.data.getRoom.messages);
    
    }
  
  }, [getRoomQuery.data]);

  useEffect(() => {

    if (getStockQuery.data && getStockQuery.data.getStock) {

      const rawData = getStockQuery.data.getStock.chart;
      let chartData = [];
      switch (chartMode) {

      
      case '5d':
        chartData = rawData.days.slice(Math.max(rawData.days.length - 5, 0))
        break;
      case '15d':
        chartData = rawData.days.slice(Math.max(rawData.days.length - 15, 0))
        break;
      case '1m':
        chartData = rawData.days
        break;
      case '3m':
        if (rawData.weeks.length < 5) break;
        chartData = rawData.weeks.slice(Math.max(rawData.weeks.length - 13, 0))
        break;
      case '6m':
        if (rawData.weeks.length < 13) break;
        chartData = rawData.weeks.slice(Math.max(rawData.weeks.length - 26, 0))
        break;
      case '1y':
        if (rawData.weeks.length < 26) break;
        chartData = rawData.weeks.slice(Math.max(rawData.weeks.length - 52, 0))
        break;
      case '3y':
        if (rawData.weeks.length < 52) break;
        chartData = rawData.weeks.slice(Math.max(rawData.weeks.length - 156, 0))
        break;
      case '5y':
        if (rawData.weeks.length < 156) break;
        chartData = rawData.weeks
        break;
      default:
        break;
      
      }
      setChartData(chartData)
    }
  
  }, [chartMode, getStockQuery.data])
  
  // eslint-disable-next-line no-unused-vars
  const loading = useMemo(() => allRoomsQuery.loading || getStockQuery.loading || allStockInfo.loading, [allRoomsQuery, getStockQuery]);
  return (
     
    (<Grid container className="full-height">
      <Grid container className="room-half">
        <Grid item xs={12} sm={4} className="stockInformation">
          {getStockQuery.data && getStockQuery.data.getStock
            ? <StockDataSummary
              name={getStockQuery.data.getStock.name}
              symbol={id.toUpperCase()}
              data={getStockQuery.data.getStock.prices}
              daily={getStockQuery.data.getStock.daily}
              currentPrice={price}
              isFavorite={isFavorite}
              userToken={userToken}
              stockInfo={allStockInfo.data.getStock.stockInfo}            
            />
            : <div>Loading...</div>
          }
        </Grid>
        <Grid item xs={12} sm={8}>
          {chartData
            ? (<Chart data={chartData} setChartMode={setChartMode}/>)
            : <div>Loading...</div>
          }
          
        </Grid>
      </Grid>
      <Grid container className="room-half">
        <Grid item xs={12} sm={5}>
          {activeRooms
            ? <RoomList id="stock-room-list" tickerList={activeRooms} title={'Other Rooms'} className={'chat-room-list'} />
            : <div>Loading...</div>
          }
        </Grid>
        <Grid item xs={12} sm={2}>
          {users
            ? <UserList userList={users} />
            : <div>Loading...</div>
          }
        </Grid>
        <Grid item xs={12} sm={5}>
          {
            messages
              ? <ChatBox chatLog={messages} />
              : <div>Loading...</div>
          }
        </Grid>
      </Grid>
    </Grid>)
      
  )

}

Room.propTypes = {
  id: PropTypes.string.isRequired,
  messages: PropTypes.array,
  setMessages: PropTypes.func,
  price: PropTypes.number,
  setPrice: PropTypes.func,
  userToken: PropTypes.string.isRequired,
}

export default Room