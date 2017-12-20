import * as types from 'constants/ActionTypes';

const _defaultState = { text: '' };

export default function (state = _defaultState, action) {
	switch (action.type) {
    case types.SET_SEARCHTEXT:
			return { ...state, text: action.text };
		default:
			return state;
	}
}