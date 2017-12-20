import * as types from 'constants/ActionTypes';

const _defaultState = { searchState: false};

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.SEARCH_TRIGGER:
			return { ...state, searchState: !state.searchState };
		default:
			return state;
	}
}