import { persistCombineReducers } from 'redux-persist'
import { AsyncStorage } from 'react-native'

import routes from './routes'
import persist from './persist'
import drawer from './drawer'
import execQueryDb from './execQueryDb.js'
import autoCompleteResults from './autoCompleteResults'
import searchVideos from './searchVideos'
import navBarProps from './navBarProps'
import search from './search'
import searchText from './searchText'
import videoShow from './videoShow'
import videosFromDb from './videosFromDb'
import orientation from './orientation'
import helpers from './helpers'

const persistConfig = {
  key: 'primary',
  storage: AsyncStorage,
  debug: true,
  blacklist: ['execQueryDb', 'autoCompleteResults', 'searchVideos', 'navBarProps', 'search', 'searchText', 'videoShow', 'videosFromDb', 'orientation'],
  whitelist: ['helpers']
}

export default persistCombineReducers(persistConfig, {
  routes,
  persist,
  drawer,
  execQueryDb,
  autoCompleteResults,
  searchVideos,
  navBarProps,
  search,
  searchText,
  videoShow,
  videosFromDb,
  orientation,
  helpers
})