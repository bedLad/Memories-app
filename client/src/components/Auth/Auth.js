import React, {useState} from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { signin, signup } from '../../actions/auth.js';
import Input from './Input.js';
import useStyles from './styles.js';

const Auth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

  const [formData, setFormData] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [signUp, setSignUp] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (signUp) {
      dispatch(signup(formData, navigate));
    } else {
      dispatch(signin(formData, navigate));
    } 
    console.log(formData);
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
   };

  const googleSuccess = async (res) => {
    console.log(res);
    const result = await res?.credential;   // this has all the data like email, name, pic
    const token = await res?.clientId;      // this is just the token

    try {
      dispatch({ type: 'AUTH', payload: { result, token } });
      navigate('/');
    } catch (err) {
      console.log(err);
    }
  };
  const googleError = (err) => {
    console.log(err);
    console.log("Google SignIn unsuccessful. Try again later !!");
  };
  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5'>{signUp ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {
              signUp && (
                <>
                  <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                  <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                </>
              )
            }
            <Input name='email' label='Email Address' handleChange={handleChange}  type='email' />
            <Input name='password' label='Password' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            {signUp && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password' />}
          </Grid>
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>
            { signUp ? 'SignUp': 'SignIn' }
          </Button>
          <GoogleOAuthProvider clientId="557332597082-ulf93l28vl7lsbqdjlq366j37jefvv6f.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={ googleSuccess }
              onError={ googleError }
            />
          </GoogleOAuthProvider>
          <Grid container alignItems='center' >
            <Grid item>
              <Button onClick={() => setSignUp((prevSignUp) => !prevSignUp)}>
                {signUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

    </Container>
  );
}

export default Auth;