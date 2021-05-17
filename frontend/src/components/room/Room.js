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

const StockDataSummary = ({name, symbol, data}) => {

  const price = 2316.16;
  const change = {};
  data.forEach((item) => {

    change[item.date] = item.value;
  
  })
  const calcPercentage = (difference) => {

    const percent = `${(difference / price * 100).toFixed(2)}%`;
    return ` (${difference > 0 ? '+' + percent : percent})`;

  }

  const renderNumber = (value) => {

    value = price - value;
    return <div className={value > 0 ? 'positive' : 'negative'}>
      <span className="price-value">{value > 0 ? '+' + (value.toFixed(2)) : value.toFixed(2)}</span>
      <span className="price-change">{calcPercentage(value)}</span>
    </div>
  
  }

  return (
    <div className="stock-data-summary">
      <div><div id="company-name">{name}</div><div>{symbol}</div></div>
      
      <div id="current-price"><div id="price">{price}</div>{renderNumber(2310)}</div>
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
  symbol: PropTypes.string.isRequired
}

const Room = ({ id, messages, setMessages }) => {

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
  const getRoomQuery = useQuery(queries.GET_ROOM_DATA, { variables: { ticker: id.toUpperCase() } });
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
            ? <StockDataSummary symbol={id.toUpperCase()} data={getStockQuery.data.getStock.prices} />
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
  setMessages:PropTypes.func,
}

export default Room