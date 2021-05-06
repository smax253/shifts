import React from 'react';
import { Redirect } from 'react-router';
import auth from '../../auth/fakeAuth'
import PropTypes from 'prop-types';
import queries from '../../queries'
import { useLazyQuery } from '@apollo/client';

const Login = ({onLogin}) => {

  const [redirectToReferrer, setRedirectToReferrer] = React.useState(auth.is);
  const [usernameInput, setUsernameInput] = React.useState('');
  const [passwordInput, setPasswordInput] = React.useState('');
  const [loginUserQuery, {called, loading, data}] = useLazyQuery(queries.LOGIN_USER)

  const login = async() =>{

    const {loginUser} =loginUserQuery({variables:{username: usernameInput, password: passwordInput}})
    
    auth.authenticate(loginUser[0].AccessToken);
    onLogin();
    setRedirectToReferrer(true);
  
  }

  return (
    <div>
      {
        redirectToReferrer 
          ?<Redirect to='/'/>
          :
          <div>
            <form onSubmit={login}>
              <label htmlFor="username-input">Username</label>
              <input id="username-input" type="text" onChange={(event)=>{

                setUsernameInput(event.target.value)

              }}/>
              <label htmlFor="password-input">Password</label>
              <input id="password-input" type="password" onChange={(event)=>{

                setPasswordInput(event.target.value)

              }}/>
              
              <button type="submit">Login!</button>

            </form>
          </div>
      }  
    </div>
  )

}

Login.propTypes = {
  onLogin: PropTypes.func,
}

export default Login;