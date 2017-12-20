import * as types from 'constants/ActionTypes';
import query from 'model/Database'

export const setNavBarProps = (props) => {
  return {
    type: types.SET_NAVBARPROPS,
    props,
  }
};

export const triggerDrawer = () => {
  return { type: types.DRAWER_TRIGGER };
};

export const triggerSearch = () => {
  return { type: types.SEARCH_TRIGGER };
};

export const setSearchText = (text) => {
  return {
    type: types.SET_SEARCHTEXT,
    text,
  }
}

export const setVideoShow = (video) => {
  return {
    type: types.SET_VIDEO_SHOW,
    video,
  }
}

export const setVideoState = (videoState) => {
  return {
    type: types.SET_VIDEO_STATE,
    videoState,
  }
}

export const setVideoShowAndState = (video, videoState) => {
  return {
    type: types.SET_VIDEO_SHOW_AND_STATE,
    video,
    videoState,
  }
}

export const setOrientation = (key) => {
  return {
    type: types.SET_ORIENTATION,
    key,
  }
}
export const initialOrientation = (initialKey) => {
  return {
    type: types.INITIAL_ORIENTATION,
    initialKey,
  }
}

export const triggerHelperShow = (helperKey) => {
  return {
    type: types.TRIGGER_HELPER,
    helperKey,
  }
}
export const checkHelpers = () => {
  return {
    type: types.CHECK_HELPERS,
  }
}