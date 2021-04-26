import React from 'react';
import { Redirect, Route } from 'react-router';
import auth from '../../auth/fakeAuth'
import PropTypes from 'prop-types';

const PrivateRoute = ({children, ...rest}) => {

  return (
    <Route {...rest} render={()=>{

      return auth.isAuthenticated === true ? children : <Redirect to="/login" />
    
    }} />
  )

}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
}

export default PrivateRoute;