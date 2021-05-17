import React from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { AuthContext } from '../../auth/AuthContext';
import email from 'email-validator';
import auth from '../../config/auth';
import { useApolloClient, useMutation } from '@apollo/client';
import { useAlert } from 'react-alert';
import queries from '../../queries';

const Login = () => {

  const alert = useAlert();

  // eslint-disable-next-line no-unused-vars
  const [authUser, setAuthUser] = React.useContext(AuthContext);
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(!!authUser);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [passwordInput, setPasswordInput] = React.useState('');
  const [emailInput, setEmailInput] = React.useState('');
  const [usernameInput, setUsernameInput] = React.useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = React.useState('');
  const [addUser] = useMutation(queries.ADD_USER);
  const client = useApolloClient();

  const login = async(event) => {
    
    event.preventDefault();
    const valid = email.validate(emailInput);
    if (!valid) {
      
      alert.show('Invalid email. Please try again.', {
        title: 'Login failed!'
      });

      return;
    
    }
    try {

      const user = await auth.signInWithEmailAndPassword(emailInput, passwordInput);
      setAuthUser(user);
      // eslint-disable-next-line no-console
      console.log(user);

      setRedirectToReferrer(true);

    } catch (e) {

      alert.show('That username and password combination does not exist. Please try again', {
        title: 'Login failed.'
      });

      return;

    }
   
  
  }

  const register = async(event) => {
    
    event.preventDefault();
    const valid = email.validate(emailInput);
    const takenQuery = await client.query({ query: queries.CHECK_USERNAME, variables: { username: usernameInput } });
    const taken = takenQuery.data.checkUsername;
    if (!valid || !usernameInput || passwordInput != confirmPasswordInput) {

      alert.show('Invalid form data. Please make sure you have completed the entire form and the passwords match', {
        title: 'Registration failed'
      })
      return;
    
    }

    if (taken) {
      
      alert.show('Please try again with another username.', {
        title: 'Username taken.'
      })
      return;

    }

    try {

      const user = await auth.createUserWithEmailAndPassword(emailInput, passwordInput);
      
      addUser({ variables: { username: usernameInput, userID: user.user.uid } })
      setAuthUser(user);
      setRedirectToReferrer(true);

    } catch (e) {
      
      alert.show('Oh no! We were not able to register you. Please try again with a valid email and password.', {
        title: 'Registration failed',
      });

      return;

    }


  }

  return (
    <div>
      {
        redirectToReferrer 
          ? <Redirect to='/' />
          : (
            isRegistering ?
              (<form onSubmit={register}>
                <label htmlFor="email-input">Email</label>
                <input id="email-input" type="text" onChange={(event) => setEmailInput(event.target.value)} />
                <label htmlFor="username-input">Username</label>
                <input id="username-input" type="text" onChange={(event) => setUsernameInput(event.target.value)} />
                <label htmlFor="password-input">Password</label>
                <input id="password-input" type="password" onChange={(event)=>setPasswordInput(event.target.value)}/>
                <label htmlFor="confirm-password-input">Confirm Password</label>
                <input id="confirm-password-input" type="password" onChange={(event)=>setConfirmPasswordInput(event.target.value)}/>
                <button type="submit">Register!</button>
              </form>)
              : (<form onSubmit={login}>
                <label htmlFor="email-input">Email</label>
                <input id="email-input" type="text" onChange={(event)=>setEmailInput(event.target.value)}/>
                <label htmlFor="password-input">Password</label>
                <input id="password-input" type="password" onChange={(event)=>setPasswordInput(event.target.value)}/>
                <button type="submit">Login!</button>
                <button onClick={()=>setIsRegistering(true)}>Register an account!</button>
              </form>)
          )
      }  
    </div>
  )

}

Login.propTypes = {
  onLogin: PropTypes.func,
}

export default Login;