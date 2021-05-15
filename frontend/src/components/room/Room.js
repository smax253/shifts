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

  const renderClassname = (value) => {

    return value > 0 ? 'positive' : 'negative';
  
  }

  const renderNumber = (value) => {

    return value > 0 ? '+'+(value.toFixed(2)) : value.toFixed(2);
  
  }
  const {name, ticker, price, change} = data;
  const dailyChange = renderNumber(change.day);
  return (
    <div className="stock-data-summary">
      <div><div id="company-name">{name}</div><div>{ticker}</div></div>
      
      <div><div id="price">{price}<span className={renderClassname(change.day)}>{dailyChange}</span></div></div>
      <div><div>1 Week</div><div className={renderClassname(change.week)}>{renderNumber(change.week)}</div></div>
      <div><div>1 Month</div><div className={renderClassname(change.month)}>{renderNumber(change.month)}</div></div>

      <div><div>3 Months</div><div className={renderClassname(change.threeMonth)}>{renderNumber(change.threeMonth)}</div></div>

      <div><div>1 Year</div><div className={renderClassname(change.year)}>{renderNumber(change.year)}</div></div>

      <div><div>5 Years</div><div className={renderClassname(change.fiveYear)}>{renderNumber(change.fiveYear)}</div></div>

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