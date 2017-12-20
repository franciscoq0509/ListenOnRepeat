import * as types from 'constants/ActionTypes';

const _defaultState = { key: '', initialKey: ''};

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.SET_ORIENTATION:
			return { ...state, key: action.key };
		case types.INITIAL_ORIENTATION:
			return { ...state, initialKey: action.initialKey, key: action.initialKey };
		default:
			return state;
	}
}