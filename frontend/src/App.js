import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/home_page/Home';
import Profile from './components/profile/Profile';
import Room from './components/room/Room';
import PrivateRoute from './components/auth/PrivateRoute';
import auth from './auth/fakeAuth'
import Login from './components/auth/Login';
import NavBar from './components/shared/NavBar';

import {ApolloClient, HttpLink, InMemoryCache, ApolloProvider} from '@apollo/client';
import Dashboard from './components/dashboard/Dashboard';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
})

function App() {


  const [isAuthenticated, setIsAuthenticated] = React.useState(auth.isAuthenticated)
  

  React.useEffect(()=>{

    setIsAuthenticated(auth.isAuthenticated)
  
  }, [auth.isAuthenticated])

  const login = () => {

    setIsAuthenticated(true);
  
  }

  
  
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <header className="App-header">
            <NavBar 
              isAuthenticated={isAuthenticated} 
              setIsAuthenticated={setIsAuthenticated}
            />
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
              <PrivateRoute>
                <Dashboard/>
              </PrivateRoute>
              <Route path='/login'>
                <Login onLogin={login}/>
              </Route>
            </Switch>
          </div>
        </div> 
      </Router>
    </ApolloProvider>
  );

}

export default App;
