import * as types from 'constants/ActionTypes';

const _defaultState = { response: '', isFetching: false };

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.FETCH_SEARCHVIDEOS_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_SEARCHVIDEOS_ERROR:
			return { ...state, isFetching: false, response: '' };
		case types.FETCH_SEARCHVIDEOS_SUCCESS:
			return { ...state, response: action.response, isFetching: false };
		default:
			return state;
	}
}