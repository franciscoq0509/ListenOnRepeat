import {createStore, applyMiddleware} from 'redux'
import {connect} from 'react-redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import { addNavigationHelpers, StackNavigator } from 'react-navigation'

import rootReducer from 'reducers/index'
import * as types from 'constants/ActionTypes'

const middleware = [thunk]

export default store = composeWithDevTools(
    applyMiddleware(...middleware),
)(createStore)(rootReducer)

export const persistor = persistStore(store)