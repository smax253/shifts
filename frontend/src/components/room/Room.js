import { Grid } from '@material-ui/core';
import React from 'react';
import { useParams } from 'react-router';
import fakeQueryData from '../../fakeQueryData';
import '../../styles/Room.scss'
import RoomList from '../shared/RoomList';
import Chart from './Chart';
import PropTypes from 'prop-types';
import UserList from './UserList';
import ChatBox from './ChatBox';

const StockDataSummary = ({data}) => {

  const { name, ticker, price, change } = data;

  const calcPercentage = (difference) => {

    const percent = `${(difference / price * 100).toFixed(2)}%`;
    return ` (${difference > 0 ? '+' + percent : percent})`;

  }

  const renderNumber = (value) => {

    return <div className={value > 0 ? 'positive' : 'negative'}>
      <span className="price-value">{value > 0 ? '+' + (value.toFixed(2)) : value.toFixed(2)}</span>
      <span className="price-change">{calcPercentage(value)}</span>
    </div>
  
  }
  return (
    <div className="stock-data-summary">
      <div><div id="company-name">{name}</div><div>{ticker}</div></div>
      
      <div id="current-price"><div id="price">{price}</div>{renderNumber(change.day)}</div>
      <div><div>1 Week</div>{renderNumber(change.week)}</div>
      <div><div>1 Month</div>{renderNumber(change.month)}</div>

      <div><div>3 Months</div>{renderNumber(change.threeMonth)}</div>

      <div><div>1 Year</div>{renderNumber(change.year)}</div>

      <div><div>5 Years</div>{renderNumber(change.fiveYear)}</div>

    </div>
  );

}

StockDataSummary.propTypes = {
  data: PropTypes.object.isRequired,
}

const Room = () => {

  // eslint-disable-next-line no-unused-vars
  const {id} = useParams();

  const active = fakeQueryData.activeRooms;
  const stockData = fakeQueryData.stockData;
  const users = fakeQueryData.users;
  const messages = fakeQueryData.messages;
  const [messageText, setMessageText] = React.useState('');

  const sendMessage = React.useCallback((event)=>{

    event.preventDefault();
    // eslint-disable-next-line no-console
    console.log('message sent: ', messageText);
  
  })
  return (
    <Grid container className="full-height">
      <Grid container className="room-half">
        <Grid item xs={12} sm={4}>
          <StockDataSummary data={stockData.summary}/>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Chart data={stockData.chart}/>
        </Grid>
      </Grid>
      <Grid container className="room-half">
        <Grid item xs={12} sm={5}>
          <RoomList tickerList={active} title={'Other Rooms'} className={'chat-room-list'}/>
        </Grid>
        <Grid item xs={12} sm={2}>
          <UserList userList={users}/>
        </Grid>
        <Grid item xs={12} sm={5}>
          <ChatBox chatLog={messages} sendMessage={sendMessage} setMessageText={setMessageText}/>
        </Grid>
      </Grid>
    </Grid>
  )

}

export default Room