import { Grid } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/Room.scss'
import RoomList from '../shared/RoomList';
import Chart from './Chart';
import PropTypes from 'prop-types';
import UserList from './UserList';
import ChatBox from './ChatBox';
import { useQuery } from '@apollo/client';
import queries from '../../queries';

const StockDataSummary = ({name, symbol, data, daily, currentPrice}) => {

  
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

  return (
    <div className="stock-data-summary">
      <div id="company-title"><div id="company-name">{name}</div><div>{symbol}</div></div>
      
      <div id="current-price"><div id="price">{price}</div>{renderNumber(change.pc)}</div>
      
      <div><div>1 Day</div>{renderNumber(change['1d'])}</div>
      <div><div>1 Week</div>{renderNumber(change['1w'])}</div>
      <div><div>1 Month</div>{renderNumber(change['1m'])}</div>
      <div><div>3 Months</div>{renderNumber(change['3m'])}</div>
      <div><div>6 Months</div>{renderNumber(change['6m'])}</div>
      <div><div>1 Year</div>{renderNumber(change['1y'])}</div>
      <div><div>5 Years</div>{renderNumber(change['5y'])}</div>

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
}

const Room = ({ id, messages, setMessages, price }) => {

  const [chartMode, setChartMode] = React.useState('1m');
  //const [, setCurrentPrice] = React.useState(0);
  const [chartData, setChartData] = React.useState(undefined);
  const [users, setUsers] = React.useState(undefined);
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
      console.log('query messages', getRoomQuery.data.getRoom.messages)
      setMessages(getRoomQuery.data.getRoom.messages);
    
    }
  
  }, [getRoomQuery.data]);

  useEffect(() => {

    if (getStockQuery.data && getStockQuery.data.getStock) {

      const rawData = getStockQuery.data.getStock.chart;
      switch (chartMode) {

      case '1m':
        setChartData(rawData);
        break;
      case '5d':
        setChartData(rawData.slice(Math.max(rawData.length - 5, 0)));
        break;
      case '15d':
        setChartData(rawData.slice(Math.max(rawData.length - 15, 0)));
        break;
      default:
        break;
      
      }
    
    }
  
  }, [chartMode, getStockQuery.data])
  
  // eslint-disable-next-line no-unused-vars
  const loading = useMemo(() => allRoomsQuery.loading || getStockQuery.loading, [allRoomsQuery, getStockQuery]);

  
  return (
     
    (<Grid container className="full-height">
      <Grid container className="room-half">
        <Grid item xs={12} sm={4}>
          {getStockQuery.data && getStockQuery.data.getStock
            ? <StockDataSummary
              name={getStockQuery.data.getStock.name}
              symbol={id.toUpperCase()}
              data={getStockQuery.data.getStock.prices}
              daily={getStockQuery.data.getStock.daily}
              currentPrice={price}
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
  setPrice: PropTypes.func
}

export default Room