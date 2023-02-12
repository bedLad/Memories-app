import { CREATE, DELETE, FETCH_ALL, START_LOADING, END_LOADING, FETCH_BY_SEARCH, LIKE, UPDATE, FETCH_POST } from '../constants/actionTypes';

const reducer = (state = { isLoading: true, posts: []  }, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case LIKE:
      return { ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post)
  };
    case DELETE:
      return {...state, posts: state.posts.filter((post) => post._id !== action.payload._id) };
    case UPDATE:
      return { ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post) };
    case FETCH_POST:
      return { ...state, post: action.payload };
    case FETCH_ALL:
      return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.numberOfPages
      };
    case FETCH_BY_SEARCH:
      return {
        ...state,
        posts: action.payload,
      };
    case CREATE:
      return {...state, posts: [...state.posts, action.payload] };
    default:
      return state;
  }
};

export default reducer