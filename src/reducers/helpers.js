import * as types from 'constants/ActionTypes';

import { helpers } from 'constants/config'

const _defaultState = helpers

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.CHECK_HELPERS:
			const newState = Object.keys(helpers).reduce((obj, currentHelperKey) => {
				obj[currentHelperKey] = { ...helpers[currentHelperKey], show: state[currentHelperKey].show }
				return obj
			}, {});
			return { ...newState }	 // newState
		case types.TRIGGER_HELPER:
			return { ...state, [action.helperKey]: { ...state[action.helperKey], show: !state[action.helperKey].show } };
		default:
			return state;
	}
}