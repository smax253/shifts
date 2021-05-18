import { useApolloClient } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import auth from '../../config/auth';
import queries from '../../queries';
import RoomList from '../shared/RoomList';

const MyList = () => {

  const [userToken, setUserToken] = useState(null);
  const [favoriteList, setFavoriteList] = useState(null);
  const client = useApolloClient();

  useEffect(() => {
    auth.currentUser.getIdToken(true).then((idToken) => {
      setUserToken(idToken);
    })
  }, [])
    
  useEffect(async() => {
    if (userToken) {
      const favoriteRooms = await client.query({
        query: queries.GET_FAVORITE_ROOMS,
        variables: {
          userToken
        },
        fetchPolicy: 'no-cache'
      })
      setFavoriteList(favoriteRooms.data.getUserFavorites);
    }
  }, [userToken])

  return (
    favoriteList
      ? <RoomList showPrices tickerList={favoriteList} title="My List"/>
      : <div>Loading...</div>
  )
}

export default MyList;
