import React, { Component } from 'react'
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Easing, Animated, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import { addNavigationHelpers, StackNavigator, DrawerNavigator, DrawerItems } from 'react-navigation'
import { PersistGate } from 'redux-persist/lib/integration/react'
import Orientation from 'react-native-orientation'

import CustomDrawerContentComponent from 'components/CustomDrawerContentComponent'

import { width, height, createTableQuery } from 'constants/config'
import store, { persistor } from './ReduxStore'

import * as ApiUtils from 'actions/utils'
import * as ApiVideosFromDb from 'actions/videosFromDb'
import * as ApiExecQueryDb from 'actions/execQueryDb'
import * as ApiSearchVideos from 'actions/searchVideos'

import NavBar from 'components/NavBar'
import SearchAutoComplete from 'components/SearchAutoComplete'
import VideoShow from 'components/VideoShow'
import Tutorial from 'components/Tutorial'

// Imports for routes
import Main from 'layouts/Main'
import SearchList from 'layouts/SearchList'

const DrawerNavigatorConfig = {
  drawerWidth: width(60),
  drawerPosition: 'left',
  drawerBackgroundColor: 'transparent',
  contentComponent: props => <CustomDrawerContentComponent {...props} />,
}

export const AppNavigator = DrawerNavigator({
    Main: {
      screen: Main,
    },
    SearchList: {
      screen: SearchList,
    },
  }, DrawerNavigatorConfig
)

@connect(state => ({
  routes: state.routes,
  search: state.search,
  searchText: state.searchText,
  videosFromDb: state.videosFromDb,
  videoShow: state.videoShow,
}),
  dispatch => ({
    dispatch,
    triggerDrawer: () => {
      dispatch(ApiUtils.triggerDrawer())
    },
    triggerSearch: () => {
      dispatch(ApiUtils.triggerSearch())
    },
    setSearchText: (text) => {
      dispatch(ApiUtils.setSearchText(text))
    },
    checkHelpers: () => {
      dispatch(ApiUtils.checkHelpers())
    },
    setOrientation: (orientation) => {
      dispatch(ApiUtils.setOrientation(orientation))
    },
    initialOrientation: (orientation) => {
      dispatch(ApiUtils.initialOrientation(orientation))
    },
    fetchVideosFromDb: () => {
      dispatch(ApiVideosFromDb.fetchVideosFromDb())
    },
    fetchSearchVideos: (text) => {
      dispatch(ApiSearchVideos.fetchSearchVideos(text))
    },
    execQueryDb: (queryString) => {
      dispatch(ApiExecQueryDb.execQueryDb(queryString))
    },
  })  
)
export default class AppWithNavigationState extends Component {
  constructor(props) {
    super(props)
    this.state = {
      closeViewTrigger: false
    }
  }
  componentWillMount() {
    const { checkHelpers, initialOrientation, fetchVideosFromDb, execQueryDb } = this.props
    execQueryDb(createTableQuery)
    checkHelpers()
    fetchVideosFromDb()
    const initial = Orientation.getInitialOrientation();
    initialOrientation(initial)
  }
  componentWillReceiveProps(nextProps) {
    const { routes, search, triggerDrawer } = nextProps
    if (routes.routes[routes.index].key != this.props.routes.routes[this.props.routes.index].key) {
      triggerDrawer()
    }
    if (search && this.props.search.searchState != search.searchState) {
      if (!search.searchState) {
        this.closeSearch()
      }
    }
  }

  componentDidMount() {
    Orientation.addOrientationListener(this._orientationDidChange)
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange)
  }

  _orientationDidChange = (orientation) => {
    this.props.setOrientation(orientation)
  }

  closeSearch = () => {
    const { setSearchText } = this.props
    Keyboard.dismiss()
    setSearchText('')
  }

  handleSearch = (searchString) => {
    const { routes, dispatch, fetchSearchVideos, setSearchText } = this.props
    const navigationProps = addNavigationHelpers({
      dispatch,
      state: routes
    })
    setSearchText(searchString) 
    this.setState({closeViewTrigger: !this.state.closeViewTrigger})
    Keyboard.dismiss()
    if (routes.routes[routes.index].routes[routes.routes[routes.index].index].routeName != 'SearchList') {
      navigationProps.navigate('SearchList')
    } else {
      fetchSearchVideos(searchString)
    }
  }
  
  render() {
    const { dispatch, routes, searchText, videosFromDb, videoShow } = this.props
    const navigationProps = addNavigationHelpers({
      dispatch,
      state: routes
    })
    return (
      <View style={{flex: 1}}>
        <NavBar 
          handleSearch={this.handleSearch}
          searchText={searchText.text} 
          navigation={navigationProps} />
        <AppNavigator
          navigation={navigationProps}/>
        <SearchAutoComplete 
          handleSearch={this.handleSearch}
          closeViewTrigger={this.state.closeViewTrigger}
          navigation={navigationProps}
          searchText={searchText.text} />
        <VideoShow />
        {
          videosFromDb && videosFromDb.response && videosFromDb.response.length && (!videoShow.videoState || videoShow.videoState == 'modalShort') && routes.routes[routes.index].routes && routes.routes[routes.index].routes[routes.routes[routes.index].index].key == 'Main'
            ? <Tutorial helperKey="tutorial" />
            : null
        }
      </View>  
    )
  }
}

