import * as types from 'constants/ActionTypes';

const _defaultState = { drawerState: false};

export default function (state = _defaultState, action) {
	switch (action.type) {
    case types.DRAWER_TRIGGER:
			return { ...state, drawerState: !state.drawerState };
		default:
			return state;
	}
}