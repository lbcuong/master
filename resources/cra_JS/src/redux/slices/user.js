import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';

// ----------------------------------------------------------------------

const initialState = {
  error: null,
  isLoading: false,
  users: [],
  user: [],
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET USER
    getUsers(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // GET USER SUCCESS
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.users = action.payload;
    },

    // UPDATE COLUMN
    updateUserSuccess(state, action) {
        state.isLoading = false;
      },

    // CREATE NEW COLUMN
    addUserSuccess(state, action) {
      const newColumn = action.payload;
      state.isLoading = false;
      state.user.columns = {
        ...state.user.columns,
        [newColumn.id]: newColumn,
      };
      state.board.columnOrder.push(newColumn.id);
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getUsers() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('users');
      dispatch(slice.actions.getUserSuccess(response.data.users));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addUser(newColumn) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('users', newColumn);
      dispatch(slice.actions.addUserSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateUser(columnId, updateColumn) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.put(`users/${columnId}`, updateColumn);
      console.log(response.data);
      dispatch(slice.actions.updateUserSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
