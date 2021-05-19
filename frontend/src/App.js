import React from 'react';
import './styles/App.scss';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/home_page/Home';
import PrivateRoute from './components/auth/PrivateRoute';
import Login from './components/auth/Login';
import NavBar from './components/shared/NavBar';
import Dashboard from './components/dashboard/Dashboard';
import { AuthContext } from './auth/AuthContext';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-mui';

import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from '@apollo/client';
import auth from './config/auth';
import RoomWrapper from './components/room/RoomWrapper';
import queries from './queries';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${process.env.REACT_APP_BACKEND_URI || 'http://localhost:4000'}/graphql`
  })
})

function App() {

  
  const [authUser, setAuthUser] = React.useState(undefined);
  auth.onAuthStateChanged((user) => {

    if (user) {
      client.query({ query: queries.GET_USERNAME, variables: { userID: user.uid } }).then(({ data }) => {
        const username = data.getUserById.username;
        user.username = username;
        setAuthUser(user);
      })
      
    
    }
    else setAuthUser(null);

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
                  <PrivateRoute path="/stock/:id">
                    <RoomWrapper/>
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
