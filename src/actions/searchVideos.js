import * as types from 'constants/ActionTypes';
import axios from 'axios'
import qs from 'qs'

import { searchVideosUrl, searchVideoYoutubeUrl, googleApiKey, getVideosData } from "constants/config.js"

const fetchSearchVideosFetching = () => {
  return {
    type: types.FETCH_SEARCHVIDEOS_FETCHING,
  };
};
const fetchSearchVideosError = (error = 'Unknown error') => {
  return {
    type: types.FETCH_SEARCHVIDEOS_ERROR,
    error
  };
};
const fetchSearchVideosSuccess = (response) => {
  return {
    type: types.FETCH_SEARCHVIDEOS_SUCCESS,
    response,
  };
};
export const fetchSearchVideos = (text, nextPageToken) => {
  return dispatch => {
    dispatch(fetchSearchVideosFetching())
    const fullUrl = searchVideosUrl
    const query = {
      // q: text.split(' ').join('_'),
      part: 'snippet',
      maxResults: 25,
      q: text,
      type: 'video',
      key: googleApiKey
    }
    if (nextPageToken) query.nextPageToken = nextPageToken
    let data = {}
    console.log(searchVideoYoutubeUrl + qs.stringify(query))
    axios.get(searchVideoYoutubeUrl + qs.stringify(query))
      .then((response) => {
        console.log(response)
        if (response && response.data) {
          const videoIds = response.data.items.map(item => item.id.videoId)
          data = response.data
          const queryData = {
            id: videoIds.join(','),
            part: 'snippet,contentDetails,statistics',
            key: googleApiKey
          }
          return axios.get(getVideosData + qs.stringify(queryData))
        } else {
          console.log('error fetchSearchVideos')
          dispatch(fetchSearchVideosError({status: 'failed', desc: 'failed fetch search videos'}))
        }
      })
      .then((response) => {
        console.log(response)
        if (response && response.data) {
          data.items = response.data.items
          dispatch(fetchSearchVideosSuccess(data))
        } else {
          console.log('error fetchSearchVideos')
          dispatch(fetchSearchVideosError({status: 'failed', desc: 'failed fetch search videos'}))
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(fetchSearchVideosError(error))
      });
  };
};

