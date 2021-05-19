import React from 'react';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { AuthContext } from '../../auth/AuthContext';
import email from 'email-validator';
import auth from '../../config/auth';
import { useApolloClient, useMutation } from '@apollo/client';
import { useAlert } from 'react-alert';
import queries from '../../queries';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));


const Login = () => {

  const classes = useStyles();
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
          ? <Redirect to='/dashboard' />
          : (
            isRegistering ?
              (
                <Grid container spacing={0} alignItems="center" justify="center">
                  <Grid item xs={0}>
                    <form className={classes.root} onSubmit={register}>
                      <Grid container spacing={4} >
                        <Grid item xs={12}>
                          <TextField id="" className="SearchBar"   type="text" label="Email" variant="filled" onChange={(event) => setEmailInput(event.target.value)} value={ emailInput }/>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField id="username-input" className="SearchBar" type="text" label="Username" variant="filled" onChange={(event) => setUsernameInput(event.target.value)} value={ usernameInput }/>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField id="password-input" className="SearchBar" type="password" label="Password" variant="filled" onChange={(event) => setPasswordInput(event.target.value)} value={passwordInput}/>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField id="confirm-password-input" className="SearchBar"  type="password" label="Confirm Password" variant="filled" onChange={(event) => setConfirmPasswordInput(event.target.value)} value={confirmPasswordInput} />
                        </Grid>
                        <Grid item xs={12}>
                          <Button variant="contained" type="submit">Register!</Button>
                        </Grid><Grid item xs={12}>
                          <Button variant="contained" onClick={ () => setIsRegistering(false)}>Login!</Button> 
                        </Grid>
                      </Grid>
                    </form> 
                  </Grid>
                </Grid>
                                 
              )
              : (
                <Grid container spacing={0} alignItems="center" justify="center">
                  <Grid item xs={0}>      
                    <form className={classes.root} onSubmit={login}>
                      <Grid container spacing={4}>
                        <Grid item xs={12}>
                          <TextField id="email-input" className="SearchBar" type="text" label="Email" variant="filled" onChange={(event) => setEmailInput(event.target.value)} value={ emailInput }/>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField id="password-input" className="SearchBar" label="Password" type="password" variant="filled" onChange={(event) => setPasswordInput(event.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                          <Button variant="contained" type="submit">Login!</Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Button variant="contained" onClick={ () => setIsRegistering(true)}>Register!</Button> 
                        </Grid>
                      </Grid>
                    </form>
                  </Grid>
                </Grid>
              )
          )
      }  
    </div>
  )
}

Login.propTypes = {
  onLogin: PropTypes.func,
}

export default Login;