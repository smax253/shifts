import { useQuery } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import auth from '../../config/auth';
import queries from '../../queries';
import Autocomplete from '@material-ui/lab/Autocomplete'
import { TextField } from '@material-ui/core';

const NavBar = () => {
  
  // eslint-disable-next-line no-unused-vars
  const [authUser, setAuthUser] = useContext(AuthContext);
  const history = useHistory();

  const allRoomsQuery = useQuery(queries.GET_ALL_ROOMS);

  const [symbols, setSymbols] = React.useState([]);

  const [searchInput, setSearchInput] = React.useState('');
  // const handleInput = (event) => {

  //   setSearchInput(event.target.value);
      
  // }
  const navigateRoom = (event) => {

    event.preventDefault();

          
    history.push(`/stock/${searchInput}`)
  
  }

  const logout = async()=>{

    await auth.signOut();
    setAuthUser(undefined);
  
  }

  useEffect(() => {

    if (!allRoomsQuery.loading && allRoomsQuery.data) {
      const tickers = allRoomsQuery.data.rooms.map(item => item.stockSymbol);
      console.log(tickers);
      setSymbols(tickers);
    }
  
  }, [allRoomsQuery])


  return (<nav>
    <Link to="/">Home</Link>
    {!!authUser && <Link to="/dashboard">Dashboard</Link>}

    {
      !!authUser && <form onSubmit={navigateRoom}>
        <Autocomplete
          id="combo-box-demo"
          options={symbols}
          onChange={(event, newInputValue) => {
            setSearchInput(newInputValue);
          }}
          style={{ width: 300 }}
          disableClearable
          renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
        <Link to={`/stock/${searchInput}`}>Search</Link>
      </form>
    }
    
    {!!authUser && <Link to="/profile/123">My Profile</Link>}

    {
      authUser
        ? <button onClick={logout}>Log out</button>
        : <Link to="/login">Login</Link>
    }
  </nav>)

}


export default NavBar