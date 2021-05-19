import { useQuery } from '@apollo/client';
import React, { useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';
import queries from '../../queries';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withStyles } from '@material-ui/core/styles';
import { TextField, Menu, MenuItem, Button, ListItem, Grid } from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import pf from '../../img/pf.png';
import firebaseauth from '../../config/auth'

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(() => ({
  root: {
    '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
      color: 'black',
    },
  },
}))(MenuItem);

const NavBar = () => {
  const classes = useStyles();
  const [auth] = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [authUser, setAuthUser] = useContext(AuthContext);
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  let email = '';
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
    
  const handleModalOpen = () => {
    setOpen(true);
  };

  const handleModalClose = () => {
    setOpen(false);
  };
    
  const setEmailInput = (emailInput) => {
    email = emailInput;
  }
    
  const forgotPassword = (event) => {
    event.preventDefault();
    auth.sendPasswordResetEmail(email)
      .then(() => {
        console.log('check email')
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const allRoomsQuery = useQuery(queries.GET_ALL_ROOMS);

  const [symbols, setSymbols] = React.useState([]);

  const [searchInput, setSearchInput] = React.useState('');
  // const handleInput = (event) => {

  //   setSearchInput(event.target.value);
      
  // }
  const navigateRoom = (event) => {

    event.preventDefault();

          
    history.push(`/stock/${searchInput}`)
  
  }

  const logout = async()=>{
    await firebaseauth.signOut()
    setAuthUser(undefined);
    history.push('/');
  
  }

  useEffect(() => {

    if (!allRoomsQuery.loading && allRoomsQuery.data) {
      const tickers = allRoomsQuery.data.rooms.map(item => item.stockSymbol);
      console.log(tickers);
      setSymbols(tickers);
    }
  
  }, [allRoomsQuery])

  return (<nav>
    <div><Link className="myButton" to="/">Home</Link></div>
    {!!authUser && <div><Link className="myButton" to="/dashboard">Dashboard</Link></div>}

    {
      !!authUser && <form onSubmit={navigateRoom}>
        <Autocomplete
          className="SearchBar"
          id="combo-box-demo"
          options={symbols}
          onChange={(event, newInputValue) => {
            setSearchInput(newInputValue);
          }}
          style={{ width: 300 }}
          disableClearable
          
          renderInput={(params) => <TextField {...params} variant="outlined" label="search for a stock..." />}
        />
        <Link className="myButton" to={`/stock/${searchInput}`}>Search</Link>
      </form>
    }

    {
      authUser
        ? (<div>
          <Button className="myButton2" 
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={handleClick}
            
          >
            {auth.username}  <img src={pf}  alt="pf"/>
          </Button>
          <StyledMenu id="customized-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
            <StyledMenuItem>
              <ListItem button onClick={() => {
                handleClose();
                logout();
              }}>
                <ListItemText primary="Logout" />
              </ListItem>
              
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItem button onClick={handleModalOpen}>
                <ListItemText primary="Reset Password" />
              </ListItem>
              <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleModalClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}
              >
                <Fade in={open}>
                  <div className={classes.paper}>
                    <h2 id="transition-modal-title">Reset Password</h2>
                    <Grid container spacing={0} alignItems="center" justify="center">
                      <Grid item xs={0}>
                        <form>
                          <Grid container spacing={4}>
                            <Grid item xs={12}>
                              <TextField id="email-input" type="text" label="Enter your email" variant="filled" onChange={(event) => setEmailInput(event.target.value)} />
                            </Grid>
                            <Grid item xs={12}>
                              <Button variant="contained" type="submit" onClick={(event) => forgotPassword(event)}>Reset!</Button>
                            </Grid>
                          </Grid>
                        </form>
                      </Grid>
                    </Grid>
                  </div>
                </Fade>
              </Modal>
            </StyledMenuItem>
          </StyledMenu>
        </div>
        )
        : <Link className="myButton" to="/login">Login</Link>
        
    }
  </nav>)

}

export default NavBar