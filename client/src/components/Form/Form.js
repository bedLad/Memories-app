import { Typography, TextField, Paper, Button } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import FileBase from 'react-file-base64';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';

import useStyles from './styles.js';
import { createPost, updatePost } from '../../actions/posts.js';

const Form = ({currentId, setCurrentId}) => {
  const classes = useStyles();  
  // to populate the form with original values when a post is to be edited
  const post = useSelector((state) => currentId ? state.posts.find((p) => p._id===currentId) : null);
  const [postData, setPostData] = useState({
    title: '', message: '', tags: '', selectedFile: ''
  });
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const location = useLocation();
  

  useEffect(() => {
    if (localStorage.getItem('profile') !== null) {
      // for google signin
      setUser(jwtDecode(JSON.parse(localStorage.getItem('profile')).result));
    } else if (localStorage.getItem('localprofile') !== null) {
      // for jwt custom signin
      setUser(JSON.parse(localStorage.getItem('localprofile')).result);
    }
    else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    if (post) {
      setPostData(post);
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentId) {
      dispatch(updatePost(currentId, { ...postData, name: user?.name }));
    } else {
      dispatch(createPost({ ...postData, name: user?.name }));
    }
    clear();
  };
  const clear = () => {
    setCurrentId(null); 
    setPostData({
      title: '', message: '', tags: '', selectedFile: ''
    });
  };

  if (!user?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to create your own and like other's memories.
        </Typography>
      </Paper>
    );
  };

  return (
    <Paper className={classes.paper}>
      <form autoComplete='off' noValidate className={`${classes.form} ${classes.root}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{ currentId ? 'Editing':'Creating'} a memory</Typography>
        
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value})}
        />
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          value={postData.message}
          onChange={(e) => setPostData({ ...postData, message: e.target.value})}
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags"
          fullWidth
          value={postData.tags}
          onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',')})}
        />

        <div className={classes.fileInput}>
          <FileBase
            type='file'
            multiple={false}
            onDone={({base64}) => setPostData({ ...postData, selectedFile:base64 })}
          />
        </div>
          
          <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type='submit' fullWidth>Submit</Button>
          <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>Clear</Button>
        
      </form>
    </Paper>
  );
}

export default Form;