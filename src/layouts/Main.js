import React, { Component, PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableHighlight, Text, Image, ImageBackground, Animated, PanResponder, Easing } from 'react-native'
import { connect } from 'react-redux'
import SortableListView from 'react-native-sortable-listview'

import { heightForOr, widthForOr, iconImages } from 'constants/config'
import { checkNextProps, getDuration, secondsToTime } from 'utils'

import * as ApiVideosFromDb from 'actions/videosFromDb'
import * as ApiUtils from 'actions/utils'
import * as ApiExecQueryDb from 'actions/execQueryDb'

import StandartBtn from 'components/StandartBtn'
import Notify from 'components/Notify'

Array.prototype.shuffle = function() {
  var input = this;
   
  for (var i = input.length-1; i >=0; i--) {
   
      var randomIndex = Math.floor(Math.random()*(i+1)); 
      var itemAtIndex = input[randomIndex]; 
       
      input[randomIndex] = input[i]; 
      input[i] = itemAtIndex;
  }
  return input;
}

@connect(
  state => ({
    orientation: state.orientation,
  })
)
class RowComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY({
        x: 20,
        y: 0
      }),
    }
  }
  getPanHandlers = (id) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (e, gesture) => { 
        const { dx } = gesture;
		    return Math.abs(dx) > 30;
      },
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: (e, gesture) => this.handlePanResponderEnd(e, gesture, id),
      onPanResponderTerminate: (e, gesture) => this.handlePanResponderEnd(e, gesture, id),
      onShouldBlockNativeResponder: _ => false
    });
  }

  handlePanResponderMove = (e, gesture) => {
    const { dx, dy } = gesture;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    if (absDx > 10 || absDy > 10) {
      if (absDx > absDy) {
        return Animated.event([null,{
          dx: this.state.pan.x,
        }])(e, gesture)
      }
    }
  }

  handlePanResponderEnd = (e, gesture, id) => {
    const { dx, dy } = gesture;
		const absDx = Math.abs(dx);
		const absDy = Math.abs(dy);
    if (absDx < 5 && absDy < 5) {
      const { data } = this.props 
      const { ID, IDYOUTUBE, REPEATES, TITLE } = data
      this.props.handleRowPress(ID, IDYOUTUBE, TITLE, REPEATES)
    } else {
      if (absDx > 180) {
        this.props.handleRowRemove(id)
      } else {
        Animated.spring(
          this.state.pan,
          {
            toValue: {
              x: 20,
              y: 0
            },
          }
        ).start();
      }
    }
  }

  
  render() {
    const { data, orientation } = this.props 
    if (data) {
      const { ID, IDYOUTUBE, THUMBNAILURL, REPEATES, POSITION, DURATION, TITLE, AUTHOR } = data
      const styles = stylesOrientation(orientation.initialKey,orientation.key)
      return (
        <View style={styles.itemWrapper}>
          <Animated.View style={[styles.slideItemWrapper, this.state.pan.getLayout()]}>
            <TouchableOpacity underlayColor={'transparent'} onPress={() => this.props.handleRowPress(ID, IDYOUTUBE, TITLE, REPEATES)}>
              <View style={styles.itemInner} {...this.getPanHandlers(ID).panHandlers}>
                <View style={styles.itemImgWrapper}>
                  <Image style={[styles.itemImg, THUMBNAILURL.indexOf('https://i.ytimg.com') != -1 && styles.itemImgForOld]} source={{uri: THUMBNAILURL}}/>
                  <Text style={styles.time}>{DURATION && secondsToTime(DURATION)}</Text>
                </View>  
                <View style={styles.info}>
                  <Text style={styles.titleText} > 
                    {TITLE}
                  </Text>
                  <Text style={styles.authorText}>
                    {AUTHOR}
                  </Text>  
                </View>  
              </View>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.btnWrapper}>
            <TouchableHighlight underlayColor={'transparent'} {...this.props.sortHandlers}>
              <View style={styles.btnInner}>    
                <ImageBackground source={require('images/reload.png')} style={styles.repeatIconImg}>
                  <View style={styles.counterWrapper}>
                    <Text style={styles.counterText}>
                      {REPEATES}
                    </Text>  
                  </View>  
                </ImageBackground>  
              </View>  
            </TouchableHighlight>  
          </View>  
        </View>
      );
    }
    return null
  }
}

@connect(
  state => ({
    orientation: state.orientation,
    videosFromDb: state.videosFromDb,
    videoShow: state.videoShow,
  }),
  dispatch => ({
    fetchVideosFromDb: () => {
      dispatch(ApiVideosFromDb.fetchVideosFromDb())
    },
    setVideoShowAndState: (video, videoState) => {
      dispatch(ApiUtils.setVideoShowAndState(video, videoState))
    },
    execQueryDb: (queryString) => {
      dispatch(ApiExecQueryDb.execQueryDb(queryString))
    },
    triggerSearch: () => {
      dispatch(ApiUtils.triggerSearch())
    },
  })
)
export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videosFromDb: [],
      undoLayout: false,
      undoVideo: {
        itemIndex: null,
        item: null
      },
      undoTimeout: null,
      mode: ''
    }
    this.pan = PanResponder.create({
    });
  }

  loadVideosFromDb = () => {
    const { fetchVideosFromDb } = this.props
    fetchVideosFromDb()
  }
  
  componentWillMount() {
    this.loadVideosFromDb()
  }
  
  handleRowRemove = (id) => {
    const { videosFromDb, videosOrder } = this.state
    let newStateVideosFromDb = videosFromDb
    const itemIndex = videosOrder.indexOf(id)
    this.setState({
      undoVideo: {
        itemIndex,
        item: newStateVideosFromDb[id]
      }
    }, () => {
      delete newStateVideosFromDb[id]
      let newStateVideosOrder = videosOrder
      newStateVideosOrder.splice(itemIndex, 1)
      const undoTimeout = setTimeout(() => {
        this.setState({
          undoVideo: {
            itemIndex: null,
            item: null
          },
          undoTimeout: null,
          undoLayout: false
        })
        this.props.execQueryDb('DELETE FROM VIDEO_DATA WHERE ID = ' + id + ';')    
      }, 3000)
      this.setState({
        videosFromDb: newStateVideosFromDb,
        videosOrder: newStateVideosOrder,
        undoLayout: true,
        undoTimeout: undoTimeout
      });
    })
  }

  undo = () => {
    const { undoVideo, undoTimeout, videosFromDb, videosOrder } = this.state
    if (undoVideo && undoVideo.itemIndex != null && undoVideo.item) {
      clearTimeout(undoTimeout)
      const newStateVideosFromDb = videosFromDb
      newStateVideosFromDb[Number(undoVideo.item.ID)] = undoVideo.item
      let newStateVideosOrder = videosOrder
      newStateVideosOrder.splice(undoVideo.itemIndex, 0, undoVideo.item.ID);
      this.setState({
        videosFromDb: newStateVideosFromDb,
        videosOrder: newStateVideosOrder,
        undoLayout: false,
        undoTimeout: null,
        undoVideo: {
          itemIndex: null,
          item: null
        }
      })
    }
  }

  handleRowPress = (id, youtubeId, title, repeatsCount) => {
    const { mode } = this.state
    let videoObj = {
      id,
      youtubeId,
      title,
      repeatsCount,
      fromDb: true,
      mode,
    }
    if (mode) {
      const { videosOrder, videosFromDb } = this.state
      if (mode == 'goNext') {
        videoObj.nextOrder = videosOrder.map(item => videosFromDb[item])
      } else if (mode == 'shuffle') {
        videoObj.nextOrder = videosOrder.map(item => videosFromDb[item]).shuffle()
      }
    }
    this.props.setVideoShowAndState(videoObj, true)
  }

  componentWillReceiveProps(nextProps) {
    const propsCheckerItemsFromDb = checkNextProps(nextProps, this.props, 'videosFromDb')
    if (propsCheckerItemsFromDb && propsCheckerItemsFromDb != 'empty') {
      let videosFromDbObj = {}
      nextProps.videosFromDb.response.forEach(videoFromDb => videosFromDbObj[videoFromDb.ID] = videoFromDb)
      this.setState({
        videosFromDb: videosFromDbObj,
        videosOrder: Object.keys(videosFromDbObj).map(key => Number(key)).sort((a, b) => a < b),
        isLoading: false,
      });
    } else if (propsCheckerItemsFromDb == 'empty') {
      this.setState({
        isLoading: false,
      });
    }
  }
  
  hadleTobBarBtn = (action) => {
    const { mode } = this.state
    switch (action) {
      case 'playAll':
        if (!mode || mode == 'shuffle') {
          this.setState({ mode: 'goNext' })
        } else {
          this.setState({ mode: '' })
        }
        // const { videosOrder, videosFromDb } = this.state
        // const newVideosOrder = videosOrder.slice()
        // const fistElement = newVideosOrder.shift()
        // const video = videosFromDb[fistElement]
        // this.props.setVideoShowAndState({
        //   id: video.ID,
        //   youtubeId: video.IDYOUTUBE,
        //   title: video.TITLE,
        //   repeatsCount: video.REPEATES,
        //   fromDb: true,
        //   goNext: true,
        //   nextOrder: newVideosOrder.map(item => this.state.videosFromDb[item]),
        // }, true)
        break
      case 'shuffle':
        if (!mode || mode == 'goNext') {
          this.setState({ mode: 'shuffle' })
        } else {
          this.setState({ mode: '' })
        }
        break  
    }
  }

  handlBigBtnPress = () => {
    const { triggerSearch } = this.props
    triggerSearch()
  }

  rowHasChanged = (rowData, newData) => {
    return rowData != newData
  }
  
  render() {
    const { navigation, orientation } = this.props
    const { videosFromDb, videosOrder, undoLayout, mode } = this.state
    const styles = stylesOrientation(orientation.initialKey,orientation.key)
    return (
      <View style={styles.container}> 
        {
          videosOrder && videosOrder.length 
            ? <View style={styles.verticalLine} />
            : null
        }
        <View style={styles.mainContentWrapper}>
          <Notify helperKey="popupPlayrIcon" />  
          <View style={styles.topBar}>
            <Text style={styles.topBarText}>
              Your repeats
            </Text>
            <View style={styles.btnsWrapper}>
              <StandartBtn 
                disabled={!(videosOrder && videosOrder.length)}  
                onPress={this.hadleTobBarBtn}
                isActive={mode == 'goNext'}
                text="Play All"
                action="playAll"
                iconImage={iconImages.repeatBlack} />
              <StandartBtn 
                 disabled={!(videosOrder && videosOrder.length)}  
                onPress={this.hadleTobBarBtn}
                isActive={ mode == 'shuffle'}
                text="Shuffle"
                action="shuffle"
                iconImage={iconImages.shuffleBlack} />
            </View>  
          </View>
          <View style={styles.listWrapper}>
            {
              videosOrder && videosOrder.length
                ? <SortableListView
                    style={styles.list}
                    data={videosFromDb}
                    order={videosOrder}
                    sortRowStyle={styles.sortRowStyle}
                    activeOpacity={0.9}
                    rowHasChanged={this.rowHasChanged}
                    moveOnPressIn={true}
                    onRowMoved={e => {
                      let newVideosOrder = this.state.videosOrder
                      newVideosOrder.splice(e.to, 0, newVideosOrder.splice(e.from, 1)[0]);
                      this.setState({videosOrder: newVideosOrder})
                      this.forceUpdate();
                    }}
                    renderRow={row => <RowComponent
                    handleRowPress={this.handleRowPress}
                    handleRowRemove={this.handleRowRemove}
                    data={row} />} />
                : <View style={styles.bigBtnWrapper}>
                    <TouchableOpacity onPress={this.handlBigBtnPress}>
                      <Text style={styles.bigBtnText}>SEARCH FOR A VIDEO</Text>
                    </TouchableOpacity>
                  </View>
            }
          </View>
        </View>
        {
          undoLayout
            && <View style={styles.undoLayuout}>
              <Text style={styles.undeLayoutText}>
                Removed the video
              </Text>
              <TouchableOpacity onPress={this.undo}>
                <Text style={styles.undoBtnText}>
                  UNDO
                </Text>
              </TouchableOpacity>
            </View>  
        }
      </View>  
    );
  }
}

const stylesOrientation = (initialKey, key) => {
  const port = key == 'PORTRAIT'
  const width = widthForOr(initialKey, key)
  const height = heightForOr(initialKey, key)
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#EEEEEE'
    },
    verticalLine: {
      height: '100%',
      width: width(1.2),
      marginLeft: '91%',
      backgroundColor: '#58585A'
    },
    mainContentWrapper: {
      position: 'absolute',
      height: height(88),
      width: '100%',
    },
    listWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    list: {
      flex: 1,
      paddingTop: width(2)
    },
    itemWrapper: {
      backgroundColor: 'transparent',
      width:'100%',
      paddingHorizontal: width(4),
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginVertical: width(1.5),
      height: width(22),
    },
    slideItemWrapper: {
      position: 'absolute',
    },
    itemInner: {
      width: width(80),
      height: width(22),
      backgroundColor: '#FAFAFA',
      elevation: 2,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.9,
      shadowRadius: 10,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: width(2),
    },
    itemImgWrapper: {
      height: width(14),
      width: width(20),
      overflow: 'hidden',
      backgroundColor: '#FAFAFA'
    },
    itemImg: {
      height: '100%',
      width: '100%',
      resizeMode: 'stretch',
    },
    itemImgForOld: {
      width: '120%',
      marginLeft: width(-2),
    },
    info: {
      flexShrink: 1,
      marginLeft: width(2)
    },
    titleText: {
      fontSize: width(3.6),
      textAlign: 'left',
      justifyContent: 'flex-start',
    },
    authorText: {
      fontSize: width(3),
      color: '#BCBCBC'
    },
    btnWrapper: {
      height: width(9),
      width: width(9),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#EEEFEF',
      marginRight: width(0.2),
      borderRadius: width(4),
    },
    btnInner: {
      height: width(9),
      width: width(9),
    },
    repeatIconImg: {
      width: '100%',
      height: '100%',
      transform: [{ rotate: '-40deg' }],
      justifyContent: 'center',
      alignItems: 'center',
      padding: width(2)
    },
    counterWrapper: {
      backgroundColor: '#EB3468',
      height: width(4.5),
      width: width(4.5),
      borderRadius: width(4),
      transform: [{ rotate: '40deg' }],
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: width(-0.2),
      marginTop: width(0.6)
    },
    counterText: {
      color: 'white',
      fontSize: width(2.6)
    },
    sortRowStyle: {
      borderTopColor: '#EB3468',
      borderBottomColor: '#EB3468',
      borderTopWidth: 2,
      borderBottomWidth: 2,
      borderStyle: 'solid'
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
    },
    topBar: {
      borderBottomColor: '#E4E4E4',
      borderBottomWidth: 3,
      borderStyle: 'solid',
      height: width(14),
      width: '100%',
      backgroundColor: '#EEEEEE',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: width(2),
      flexDirection: 'row'
    },
    topBarText: {
      fontSize: width(4),
    },
    btnsWrapper: {
      flexDirection: 'row'
    },
    bigBtnWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      width: width(52),
      height: width(20),
      backgroundColor: '#FA3F8A',
      alignSelf: 'center',
      borderRadius: 4,
      elevation: 10
    },
    bigBtnText: {
      color: 'white',
      fontSize: width(4.5)
    },
    undoLayuout: {
      position:'absolute',
      bottom: 0,
      left: 0,
      width: width(100),
      height: width(12),
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: width(2),
      backgroundColor: 'rgba(0,0,0,0.6)',
      flexDirection: 'row'
    },
    undeLayoutText: {
      color: 'white',
      fontSize: width(4)
    },
    undoBtnText: {
      color: '#AE9040',
      fontSize: width(4)
    }
  })
}