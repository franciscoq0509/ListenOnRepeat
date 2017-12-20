import * as types from 'constants/ActionTypes';

const _defaultState = { video: {}, videoState: false };

export default function (state = _defaultState, action) {
	switch (action.type) {
		case types.SET_VIDEO_SHOW:
			return { ...state, video: action.video };
		case types.SET_VIDEO_STATE:
			return { ...state, videoState: action.videoState };
		case types.SET_VIDEO_SHOW_AND_STATE:
			return { ...state, video: action.video, videoState: action.videoState };
		default:
			return state;
	}
}