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

function App() {


  const [isAuthenticated, setIsAuthenticated] = React.useState(auth.isAuthenticated)
  

  React.useEffect(()=>{

    setIsAuthenticated(auth.isAuthenticated)
  
  }, [auth.isAuthenticated])

  const login = () => {

    setIsAuthenticated(true);
  
  }

  
  
  return (
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
            <Route path='/login'>
              <Login onLogin={login}/>
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );

}

export default App;
