import * as types from 'constants/ActionTypes';
import query from 'model/Database'

const fetchExecQueryDbFetching = () => {
  return {
    type: types.FETCH_EXECQUERYDB_FETCHING,
  };
};
const fetchExecQueryDbError = (error = 'Unknown error') => {
  return {
    type: types.FETCH_EXECQUERYDB_ERROR,
    error
  };
};
const fetchExecQueryDbSuccess = (response) => {
  return {
    type: types.FETCH_EXECQUERYDB_SUCCESS,
    response,
  };
};

export const execQueryDb = (queryString) => {
  return dispatch => {
    dispatch(fetchExecQueryDbFetching())
    return query(queryString)
    .then(result => {
      dispatch(fetchExecQueryDbSuccess(result))
      })
    .catch(error => {
      console.log('error execQueryDb')
      console.log(error)  
      dispatch(fetchExecQueryDbError(error))
    })
  };
};

