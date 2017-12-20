import * as types from 'constants/ActionTypes';
import query from 'model/Database'

const fetchItemsFromDbFetching = () => {
  return {
    type: types.FETCH_VIDEOSFROMDB_FETCHING,
  };
};
const fetchVideosFromDbError = (error = 'Unknown error') => {
  return {
    type: types.FETCH_VIDEOSFROMDB_ERROR,
    error
  };
};
const fetchVideosFromDbSuccess = (response) => {
  return {
    type: types.FETCH_VIDEOSFROMDB_SUCCESS,
    response,
  };
};

export const fetchVideosFromDb = () => {
  return dispatch => {
    dispatch(fetchItemsFromDbFetching())
    const queryString = 'SELECT * FROM VIDEO_DATA'
    return query(queryString)
    .then(result => {
      dispatch(fetchVideosFromDbSuccess(result))
      })
    .catch(error => {
      console.log('error fetchItems')
      console.log(error)  
      dispatch(fetchVideosFromDbError(error))
    })
  };
};

