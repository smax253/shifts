import { Grid } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import fakeQueryData from '../../fakeQueryData';
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
  console.warn(change);
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

const Room = () => {

  // eslint-disable-next-line no-unused-vars
  const {id} = useParams();

  // eslint-disable-next-line no-unused-vars
  const getStockQuery = useQuery(queries.GET_STOCK_DATA,
    {
      variables: {
        ticker: id.toUpperCase()
      }
    }
  )
  const allRoomsQuery = useQuery(queries.GET_ALL_ROOMS);

  const [activeRooms, setActiveRooms] = useState(null);
  useEffect(() => {

    if (allRoomsQuery.loading) setActiveRooms(null);
    else {

      const active = allRoomsQuery.data.rooms.map((item) => {

        return { ...item, active: item.activeUsers.length };
      
      }).filter((item)=>item.stockSymbol !== id.toUpperCase())

      active.sort((a, b) => a.active - b.active);
      
      setActiveRooms(active);
    
    }
  
  }, [allRoomsQuery, id])
  const users = fakeQueryData.users;
  const messages = fakeQueryData.messages;
  const [messageText, setMessageText] = React.useState('');

  // eslint-disable-next-line no-unused-vars
  const loading = useMemo(() => allRoomsQuery.loading || getStockQuery.loading, [allRoomsQuery, getStockQuery]);

  const sendMessage = React.useCallback((event)=>{

    event.preventDefault();
    // eslint-disable-next-line no-console
    console.log('message sent: ', messageText);
  
  })
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
          {getStockQuery.data && getStockQuery.data.getStock
            ? <Chart data={getStockQuery.data.getStock.chart}/>
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
          <UserList userList={users}/>
        </Grid>
        <Grid item xs={12} sm={5}>
          <ChatBox chatLog={messages} sendMessage={sendMessage} setMessageText={setMessageText}/>
        </Grid>
      </Grid>
    </Grid>)
      
  )

}

export default Room