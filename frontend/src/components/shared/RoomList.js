import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../styles/RoomList.scss';
import people from '../../img/people.png';
import { useQuery } from '@apollo/client';
import queries from '../../queries';

const RoomList = ({ title, tickerList, showPrices, className, id, sortActive }) => {
  const tickerStrings = useMemo(() => tickerList.map((item) => item.stockSymbol), [tickerList]);
  const { loading, data } = useQuery(queries.GET_STOCK_LIST, {
    variables: {
      tickerList: tickerStrings
    }
  });

  const generateActiveLinks = useCallback((stockDataList)=>{
    const sortedTickers = tickerList.map((item) => {

      return { ...item, active: item.activeUsers.length };
      
    });
    
    sortActive && sortedTickers.sort((a, b) => b.active - a.active);
    const links = sortedTickers.map((stock) => {

      const stockData = stockDataList.find((item) => item && item.symbol === stock.stockSymbol);
      if (!stockData) {
        console.log('missing data for ', stock)
        return;
      }
      const value = stock.active;
      const current = stockData.daily.find((item) => item && item.date === 'c').value;
      const prev = stockData.daily.find((item) => item && item.date === 'pc').value;
      const change = Math.round((current - prev)*100)/100;
      const changeString = change > 0 ? '+'+change : ''+change;
      const percent = Math.round((change / prev)*10000)/100;
      const percentString = percent > 0 ? '+'+percent : ''+percent;
      return (
        <li key={stock.stockSymbol}>
            
          <Link to={`/stock/${stock.stockSymbol}`} >
            <div className='activity'>
              <div className="list-ticker">{stock.stockSymbol}</div>
              <div className={`change ${change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral'}`}>
                <span className="list-change">{changeString}</span>
                <span className="list-percent">&nbsp;{`(${percentString}%)`}</span>
              </div>
              <div className={'active'}>
                {value}
                <img src={people} alt="people-icon"/>
              </div>
            </div>
          </Link>
           
        </li>
      );
    
    })
    return <ul>{links}</ul>;
  
  }, tickerList)

  return (
    <div id={id ? id : ''} className={`room-list ${showPrices ? 'prices' : 'active'} ${className ? className : ''}`}>
      <span className="room-list-title">{title}</span>
      {!loading && data && data.getStocks && generateActiveLinks(data.getStocks)}
    </div>
  )

}

RoomList.propTypes = {
  title: PropTypes.string.isRequired,
  tickerList: PropTypes.array.isRequired,
  showPrices: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  sortActive: PropTypes.bool,
}

export default RoomList