import React, {useState, useEffect} from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography, ButtonBase } from '@material-ui/core';
import jwtDecode from 'jwt-decode';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { deletePost, likePost } from '../../../actions/posts.js';
import useStyles from './styles';

const Post = ({ post, setCurrentId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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

  const Likes = () => {
    if (post.likes.length > 0) {
      return post.likes.find((like) => like === (user?.aud || user?._id))
        ? (
          <><ThumbUpAltIcon fontSize="small" />&nbsp;{post.likes.length > 2 ? `You and ${post.likes.length - 1} others` : `${post.likes.length} like${post.likes.length > 1 ? 's' : ''}` }</>
        ) : (
          <><ThumbUpAltOutlined fontSize="small" />&nbsp;{post.likes.length} {post.likes.length === 1 ? 'Like' : 'Likes'}</>
        );
    }

    return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Like</>;
  };

  const openPost = () => {
    navigate(`/posts/${post._id}`)
  };
  
  return (
    <Card className={classes.card} raised elevation={6}>
        <CardMedia className={classes.media} image={post.selectedFile} title={post.title} onClick={openPost} />
        <div className={classes.overlay}>
          <Typography variant='h6'>{post.name}</Typography>
          <Typography variant='body2'>{moment(post.createdAt).fromNow()}</Typography>
        </div>
        
        <div className={classes.overlay2}>
          {(user?.aud === post?.creator || user?._id === post?.creator) && (
            <Button style={{ color: 'white' }} size='small' onClick={() => {setCurrentId(post._id)}}>
              <MoreHorizIcon fontSize='medium' />
            </Button>
          )}
        </div>
        <div className={classes.details}>
          <Typography variant="body2" color='textSecondary'>{post.tags.map((tag) => `#${tag} `)}</Typography>
        </div>
        <Typography className={classes.title} variant='h5' gutterBottom>{post.title}</Typography>
        <CardContent>
          <Typography variant='body2' color='textSecondary' component='p' >{post.message}</Typography>
        </CardContent>
      

      <CardActions className={classes.cardActions}>
        <Button size='small' color='primary' disabled={!user} onClick={() => {dispatch(likePost(post._id)) }}>
          <Likes />
        </Button>
        {(user?.aud === post?.creator || user?._id === post?.creator) && (
          <Button size='small' color='primary' onClick={() => { dispatch(deletePost(post._id)) }}>
            <DeleteIcon fontSize='small' />
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

export default Post;