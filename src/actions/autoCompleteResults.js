import * as types from 'constants/ActionTypes';
import axios from 'axios'
import qs from 'qs'

import { autoComleteUrl } from "constants/config.js"

const resRegex = /^window\.google\.ac\.h\((.*)\)$/;

const fetchAutoCompleteResultsFetching = () => {
  return {
    type: types.FETCH_AUTOCOMPLETERESULTS_FETCHING,
  };
};
const fetchAutoCompleteResultsError = (error = 'Unknown error') => {
  return {
    type: types.FETCH_AUTOCOMPLETERESULTS_ERROR,
    error
  };
};
const fetchAutoCompleteResultsSuccess = (response) => {
  return {
    type: types.FETCH_AUTOCOMPLETERESULTS_SUCCESS,
    response,
  };
};
export const fetchAutoCompleteResults = (text) => {
  return dispatch => {
    dispatch(fetchAutoCompleteResultsFetching())
    const fullUrl = autoComleteUrl
    const query = {
      hl: 'en',
      q: text,
      client: 'youtube',
      ds: 'yt',
    }
    axios.get(fullUrl + qs.stringify(query))
      .then((response) => {
        if (response && response.data) {
          let json = []
          try {
            const data = resRegex.exec(response.data);
            json = data
              ? JSON.parse(data[1])
              : []
          } catch (error) {
            console.log('error fetchAutoCompleteResults')
            console.log(error)
            dispatch(fetchAutoCompleteResultsError({status: 'failed', desc: 'failed to pars response'}))
          }
          dispatch(fetchAutoCompleteResultsSuccess(json[1].map(item => item[0])))
        } else {
          console.log('error fetchAutoCompleteResults')
          dispatch(fetchAutoCompleteResultsError())
        }
      }).catch((error) => {
        console.log(error);
        dispatch(fetchAutoCompleteResultsError(error))
      });
  };
};

