import * as types from 'constants/ActionTypes';

const _defaultState = { props: {}};

export default function (state = _defaultState, action) {
	switch (action.type) {
    case types.SET_NAVBARPROPS:
			return { ...state, props: action.props };
		default:
			return state;
	}
}