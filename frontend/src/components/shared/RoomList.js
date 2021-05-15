import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import '../../styles/RoomList.scss';
import people from '../../img/people.png';

const RoomList = ({title, tickerList, showPrices, className}) => {

  const generateActiveLinks = useCallback(()=>{

    const links = tickerList.map((stock)=>{

      const value = stock.active;
      return (
        <li key={stock.ticker}>
            
          <Link to={`/stock/${stock.ticker}`} >
            <div className='activity'>
              <div className="list-ticker">{stock.ticker}</div>
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

  const generateLinks = useCallback(()=>{

    const links = tickerList.map((stock)=>{

      const value = stock.change > 0 ? '+'+stock.change : ''+stock.change;
      return (
        <li key={stock.ticker}>
            
          <Link to={`/stock/${stock.ticker}`} >
            <div className='prices'>
              <span className="list-ticker">{stock.ticker}</span>
              <span className={`change ${stock.change > 0 ? 'positive' : 'negative'}`}>{value}</span>
            </div>
          </Link>
           
        </li>
      );
    
    })
    return <ul>{links}</ul>;
  
  }, tickerList)
  return (
    <div className={`room-list ${showPrices ? 'prices' : 'active'} ${className ? className : ''}`}>
      <span className="room-list-title">{title}</span>
      {showPrices ? generateLinks() : generateActiveLinks()}
    </div>
  )

}

RoomList.propTypes = {
  title: PropTypes.string.isRequired,
  tickerList: PropTypes.array.isRequired,
  showPrices: PropTypes.bool,
  className: PropTypes.string
}

export default RoomList