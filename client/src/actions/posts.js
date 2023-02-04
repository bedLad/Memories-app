import * as api from '../api'
import { CREATE, DELETE, FETCH_ALL, FETCH_BY_SEARCH, LIKE, UPDATE } from '../constants/actionTypes';

// Action Creators
export const getPosts = (page) => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts(page);
    console.log(data);
    dispatch({ type: FETCH_ALL, payload: data });
  } catch (err) {
    console.log(err);
  }
};

export const getPostsBySearch = (searchQuery) => async (dispatch) => {
  try {
    const response = await api.fetchPostsBySearch(searchQuery);
    dispatch({ type: FETCH_BY_SEARCH, payload: response.data });
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);
    dispatch({ type: CREATE, payload: data });
  } catch (err) {
    console.log(err);
  }
};

export const updatePost = (currentId, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(currentId, post);
    dispatch({ type: UPDATE, payload: data });
  } catch (err) {
    console.log(err);
  }
};

export const deletePost = (currentId) => async (dispatch) => {
  try {
    const response = await api.deletePost(currentId);
    dispatch({ type: DELETE, payload: response.data });
    console.log(response.data);
  } catch (err) {
    console.log(err);
  }
}

export const likePost = (currentId) => async (dispatch) => {
  try {
    const response = await api.likePost(currentId);
    dispatch({ type: LIKE, payload: response.data });
    console.log('Post liked');
  } catch (err) {
    console.log(err);
  }
}