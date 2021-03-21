import { handleActions } from 'redux-actions';
import { setToken } from '../actions/authActions';

const initialState = {
	token: null,
};

export const userReducer = handleActions(
	{
		[setToken]: (
			state,
			{ payload }
		) => {
			return { ...state, token: payload};
		}
	},
	initialState
);