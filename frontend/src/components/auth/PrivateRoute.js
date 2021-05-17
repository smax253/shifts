import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router';
import PropTypes from 'prop-types';
import { AuthContext } from '../../auth/AuthContext';

const PrivateRoute = ({children, ...rest}) => {

  const [auth] = useContext(AuthContext);
  

  return (
    <Route {...rest} render={() => {
      
      if(auth === undefined) return <div>Loading...</div>
      return auth ? children : <Redirect to="/login" />
    
    }} />
  )

}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
}

export default PrivateRoute;