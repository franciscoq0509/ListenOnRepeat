import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, StyleSheet, TouchableOpacity, Text, FlatList, Image, ActivityIndicator } from 'react-native'
import moment from 'moment'

import { width, height, youtubeThumbUrl } from 'constants/config'

import { checkNextProps, secondsToTime, getDuration } from 'utils'

import * as ApiUtils from 'actions/utils'
import * as ApiSearchVideos from 'actions/searchVideos'

@connect(
  state => ({
    searchVideos: state.searchVideos,
    searchText: state.searchText,
    search: state.search,
    videoShow: state.videoShow,
  }),
  dispatch => ({
    setNavBarProps: (props) => {
      dispatch(ApiUtils.setNavBarProps(props))
    },
    fetchSearchVideos: (text, nextPageToken) => {
      dispatch(ApiSearchVideos.fetchSearchVideos(text, nextPageToken))
    },
    triggerSearch: () => {
      dispatch(ApiUtils.triggerSearch())
    },
    setVideoShowAndState: (video, videoState) => {
      dispatch(ApiUtils.setVideoShowAndState(video, videoState))
    },
  })
)
export default class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVideos: [],
      nextPageToken: '',
      loading: true
    }
  }

  componentWillMount() {
    const { setNavBarProps, navigation, fetchSearchVideos, triggerSearch, searchText } = this.props
    const { nextPageToken } = this.state
    const navBarProps = {
      leftBtn: {
        action: () => {
          setNavBarProps({})
          this.props.search && this.props.search.searchState && triggerSearch()
          navigation.navigate('Main')
        },
        icon: 'arrow-left'
      }
    }
    setNavBarProps(navBarProps)
    fetchSearchVideos(searchText.text)
  }

  componentWillReceiveProps(nextProps) {
    const propsSearchVideos = checkNextProps(nextProps, this.props, 'searchVideos')
    console.log(nextProps)
    console.log(propsSearchVideos)
    if (propsSearchVideos && propsSearchVideos != 'empty') {
      const { items, pageInfo, nextPageToken } = nextProps.searchVideos.response
      setTimeout(() => {
        this.setState({
          searchVideos: items || [],
          nextPageToken: nextPageToken,
          loading: false
        });
      }, 100)
    } else if (propsSearchVideos != 'empty') {
      // this.setState({loading: false})
    }
  }

  _keyExtractor = (item, index) => item.id;

  handleItemPress = (id, title, repeatsCount, item) => {
    this.props.setVideoShowAndState({
      youtubeId: id,
      title,
      repeatsCount,
      data: item,
      fromDb: false
    }, true)
  }
  
  renderItem = ({item}) => {
    const publishedAt = moment(item.snippet.publishedAt).format('DD-MM-YY HH:mm')
    const otherInfoText = publishedAt + ' | ' + item.statistics.viewCount + ' views'
    return (
      <TouchableOpacity onPress={() => this.handleItemPress(item.id, item.snippet.title, 0, item)}>
        <View style={styles.itemWrapper}>
          <View style={styles.imageWrapper}>
            <Image style={styles.thumbnail} source={{ uri: item.snippet.thumbnails.default.url }} />
            <Text style={styles.time}>{secondsToTime(getDuration(item.contentDetails.duration))}</Text>            
          </View>
          <View style={styles.info}>
            <Text numberOfLines={2} style={styles.infoText}>{item.snippet.title}</Text>
            <Text style={styles.otherInfoText}>{otherInfoText}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const { navigation } = this.props
    const { searchVideos, loading } = this.state
    return (
      <View style={styles.container}>
        {
          loading
            ? <View style={styles.spinnerWrapper}><ActivityIndicator size={width(22)} color="#C83664" /></View>
            : <FlatList
              data={searchVideos}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
              style={styles.flatList}/>
        }  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  spinnerWrapper: {
    marginTop: width(8)
  },
  flatList: {

  },
  itemWrapper: {
    width: width(100),
    paddingHorizontal: width(4),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: width(2),
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    borderStyle: 'solid'
  },
  imageWrapper: {
    height: width(20),
    width: width(26)
  },
  info: {
    alignItems: 'flex-start',
    marginLeft: width(2),
    justifyContent: 'flex-start',
    flexShrink: 1
  },
  infoText: {
    fontSize: width(3.6),
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  otherInfoText: {
    fontSize: width(3),
    color: '#BCBCBC'
  },
  thumbnail: {
    height: '100%',
    width: '100%'
  },
  time: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: 'white',
    padding: width(0.4),
    position: 'absolute',
    bottom: width(1),
    right: width(1),
    fontSize: width(2.6),
    textAlign: 'center'
  }
})