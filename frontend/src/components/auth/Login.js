import React from 'react';
import { Redirect } from 'react-router';
import auth from '../../auth/fakeAuth'
import PropTypes from 'prop-types';

const Login = ({onLogin}) => {

  const [redirectToReferrer, setRedirectToReferrer] = React.useState(auth.is);

  const login = async() =>{

    await auth.authenticate();
    onLogin();
    setRedirectToReferrer(true);
  
  }

  return (
    <div>
      {
        redirectToReferrer 
          ?<Redirect to='/'/>
          :<button onClick={login}>Login!</button>
      }  
    </div>
  )

}

Login.propTypes = {
  onLogin: PropTypes.func,
}

export default Login;