import React from 'react';
import './styles/App.scss';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/home_page/Home';
import Profile from './components/profile/Profile';
import Room from './components/room/Room';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import NavBar from './components/shared/NavBar';
import Dashboard from './components/dashboard/Dashboard';
import { AuthContext } from './auth/AuthContext';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-mui';

import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from '@apollo/client';
import auth from './config/auth';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql'
  })
})

function App() {

  
  const [authUser, setAuthUser] = React.useState(undefined);
  auth.onAuthStateChanged(user => {

    if (user) setAuthUser(user);
  
  })

  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      <AlertProvider template={AlertTemplate}>
        <ApolloProvider client={client}>
          <Router>
            <div className="App">
              <header className="App-header">
                <NavBar />
              </header>
              <div className="App-body">
                <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <PrivateRoute path="/profile/:id">
                    <Profile/>
                  </PrivateRoute>
                  <PrivateRoute path="/stock/:id">
                    <Room/>
                  </PrivateRoute>
                  <PrivateRoute path="/dashboard">
                    <Dashboard/>
                  </PrivateRoute>
                  <Route path='/login'>
                    <Login />
                  </Route>
                </Switch>
              </div>
            </div> 
          </Router>
        </ApolloProvider>
      </AlertProvider>
    </AuthContext.Provider>
  );

}

export default App;
