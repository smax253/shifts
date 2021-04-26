import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import auth from '../../auth/fakeAuth'
import PropTypes from 'prop-types'

const NavBar = ({isAuthenticated, setIsAuthenticated}) => {

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

    await auth.signout();
    setIsAuthenticated(false);

  }


  return (<nav>
    <Link to="/">Home</Link>
    <form onSubmit={navigateRoom}>
      <input onChange={handleInput} type="text"/>
      <Link to={`/stock/${searchInput}`}>Search</Link>
    </form>
    {isAuthenticated && <Link to="/profile/123">My Profile</Link>}

    {
      isAuthenticated
        ? <button onClick={logout}>Log out</button>
        : <Link to="/login">Login</Link>
    }
  </nav>)

}

NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired
}

export default NavBar