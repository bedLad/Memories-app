import * as api from '../api'
import { CUSTOM_AUTH } from '../constants/actionTypes';

export const signin = (formData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.signIn(formData);
    dispatch({ type: CUSTOM_AUTH, payload: data });
    navigate('/');
  } catch (err) {
    console.log(err);
  }
};

export const signup = (formData, navigate) => async (dispatch) => {
  try {
    const response = await api.signUp(formData);
    dispatch({ type: CUSTOM_AUTH, payload: response.data });
    navigate('/');
  } catch (err) {
    console.log(err.response.data);
  }
};