import * as types from 'constants/ActionTypes';

const _defaultState = { appIsReady: false};

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.PERSIST_READY:
			return { ...state, appIsReady: true };
		default:
			return state;
	}
}