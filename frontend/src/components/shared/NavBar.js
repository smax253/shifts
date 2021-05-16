import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import auth from '../../config/auth';

const NavBar = () => {
  
  // eslint-disable-next-line no-unused-vars
  const [authUser, setAuthUser] = useContext(AuthContext);
  const history = useHistory();

  const [searchInput, setSearchInput] = React.useState('');
  const handleInput = (event) => {

    setSearchInput(event.target.value);
      
  }
  const navigateRoom = (event) => {

    event.preventDefault();

          
    history.push(`/stock/${searchInput}`)
  
  }

  const logout = async()=>{

    await auth.signOut();
    setAuthUser(undefined);
  
  }


  return (<nav>
    <Link to="/">Home</Link>
    {!!authUser && <Link to="/dashboard">Dashboard</Link>}

    <form onSubmit={navigateRoom}>
      <input onChange={handleInput} type="text"/>
      <Link to={`/stock/${searchInput}`}>Search</Link>
    </form>
    {!!authUser && <Link to="/profile/123">My Profile</Link>}

    {
      authUser
        ? <button onClick={logout}>Log out</button>
        : <Link to="/login">Login</Link>
    }
  </nav>)

}


export default NavBar