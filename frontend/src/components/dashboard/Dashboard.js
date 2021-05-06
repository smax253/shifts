import { useQuery } from '@apollo/client';
import React from 'react';
import queries from '../../queries'
import ChatRoomList from './ChatRoomList';

const Dashboard = ()=>{

  const popularCompaniesQuery = useQuery(queries.GET_POPULAR_COMPANIES)
  const gainingCompaniesQuery = useQuery(queries.GET_GAINING_COMPANIES);
  const losingCompaniesQuery = useQuery(queries.GET_LOSING_COMPANIES);

  
  return (
    <div>
        Dashboard
      <ChatRoomList
        tickerList={popularCompaniesQuery.data.popularCompanies}
        isError={popularCompaniesQuery.error}
        isLoading={popularCompaniesQuery.loading}
      />

      <ChatRoomList
        tickerList={gainingCompaniesQuery.data.gainingCompanies}
        isError={gainingCompaniesQuery.error}
        isLoading={gainingCompaniesQuery.loading}
      />
      <ChatRoomList
        tickerList={losingCompaniesQuery.data.losingCompanies}
        isError={losingCompaniesQuery.error}
        isLoading={losingCompaniesQuery.loading}
      />
    </div>);

}

export default Dashboard;