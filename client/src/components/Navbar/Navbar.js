import React, { useEffect, useState } from 'react';
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core';
import {Link, useNavigate, useLocation } from 'react-router-dom'
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux';

import memories from '../../images/memories.png';
import useStyles from './styles';

const Navbar = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('profile') !== null) {
      // for google signin
      setUser(jwtDecode(JSON.parse(localStorage.getItem('profile')).result));

      const decodedToken = jwtDecode(JSON.parse(localStorage.getItem('profile')).result);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logout();
      }
    } else if (localStorage.getItem('localprofile') !== null) {
      // for jwt custom signin
      setUser(JSON.parse(localStorage.getItem('localprofile')).result);

      const token = JSON.parse(localStorage.getItem('localprofile')).token;
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        logout();
      }
    }
    else {
      setUser(null);
    }
  }, [location]);
  
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.brandContainer}>
        <Typography component={Link} to='/' className={classes.heading} variant="h2" align="center">Memories</Typography>
        <img className={classes.image} src={memories} alt="memories" height="60" />
      </div>
      <Toolbar className={classes.toolbar}>
        {user ? (
          <div className={classes.profile}>
            <Avatar className={classes.purple} alt={user?.name} src={user?.picture} >
              {user?.name.charAt(0)}
            </Avatar>
            <Typography className={classes.userName} variant='h6'>
              {user.name}
            </Typography>
            <Button variant="contained" className={classes.logout} color='secondary' onClick={logout} >
              Logout
            </Button>
          </div>
         ) : (
          <Button component={Link} to='/auth' variant='contained' color='primary'>
            Sign In
          </Button>
         )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

