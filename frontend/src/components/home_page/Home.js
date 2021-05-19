import React from 'react';
import dashboard from '../../img/dashboard.png';
import '../../styles/Home.scss';
const Home = () => {

  return (
    <div id="home-container">
      <div id='title-container'>
        <div id="titles">
          <h1>shifts</h1>
          <br/>
          <h2>Let&apos;s talk stocks</h2>
        </div>
        <img id="dashboard-image" src={dashboard} alt="Shifts Dashboard"/>
      </div>
      <div id="home-text-container">
        <p>With stocks becoming easier for the average person to begin 
        investing in, the idea of shifts is to provide a community where
        like-minded investors can chat about a certain stock. The list
        of featured stocks will be updated on a daily basis through
        web scraping various news outlets and online communities to
        get the top mentioned stock tickers. Other stock tickers’ 
chat rooms will be available through a search functionality.</p>
      </div>
    </div>
  );

}

export default Home