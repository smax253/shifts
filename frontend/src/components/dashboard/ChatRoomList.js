import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


const ChatRoomList = ({tickerList, isLoading, isError})=>{

  const generateList = React.useCallback(()=>{

    if(tickerList || tickerList.length > 0){

      tickerList.map(({ticker, companyName})=>{

        return <Link key={ticker} to={`/stock/${ticker}`}>{`${companyName}: (${ticker})`}</Link>
      
      })
    
    }
    return 'No tickers found, try again later.'
  
  }, tickerList)
  return (
    <div>
      {isLoading 
        ? 'Loading...'
        : isError
          ? 'An error occurred, try again later.'
          : generateList()}
    </div>
  );

}

ChatRoomList.propTypes = {
  tickerList: PropTypes.array,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool
}

export default ChatRoomList;