import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PanResponder,
  Image,
  Animated,
  BackHandler
} from 'react-native';
import { connect } from 'react-redux'
import YouTube, { YouTubeStandaloneIOS, YouTubeStandaloneAndroid } from 'react-native-youtube';

import { height, width, googleApiKey } from 'constants/config'
import { getDuration } from 'utils'
import query from 'model/Database'

import * as ApiExecQueryDb from 'actions/execQueryDb'
import * as ApiVideosFromDb from 'actions/videosFromDb'
import * as ApiUtils from 'actions/utils' 

var tmp_move = 0//panResponderMove on previous step

@connect(state => ({
  videoShow: state.videoShow,
  orientation: state.orientation
}),
  dispatch => ({
    setVideoShowAndState: (video, videoState) => {
      dispatch(ApiUtils.setVideoShowAndState(video, videoState))
    },
    setVideoState: (videoState) => {
      dispatch(ApiUtils.setVideoState(videoState))
    },
    setVideoShow: (video) => {
      dispatch(ApiUtils.setVideoShow(video))
    },
    execQueryDb: (queryString) => {
      dispatch(ApiExecQueryDb.execQueryDb(queryString))
    },
    fetchVideosFromDb: () => {
      dispatch(ApiVideosFromDb.fetchVideosFromDb())
    },
  })  
)
export default class Two extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoWidth: new Animated.Value(width(90)) ,
      absoluteLeft: new Animated.Value(0) ,
      opacity:new Animated.Value(1)  ,
      direction: 'none',
      internalRepeatCount: 0,
      fullscreen: false
    }
    this.tmp_move = 0
  }

  orientationDidChange = (orientation) => {
    const { videoShow } = this.props
    if (videoShow && videoShow.videoState && !this.state.fullscreen && videoShow.videoState != 'modalShort') {
      switch (orientation) {
        case 'LANDSCAPE':
            setTimeout(() => {
              this.setState({fullscreen: true})
            }, 200)
            break
        case 'PORTRAIT':
          setTimeout(() => {
            this.setState({ fullscreen: false })
            Platform.OS == 'ios' && this.youtubeRef && this.youtubeRef.reloadIframe()
          }, 200)
          break
      }
    }
  }

  animate = (val) => {//when press and drag
    if(this.state.videoWidth._value - val<width(45) && val>0){
      this.animateDown()
    }
    else if(this.state.videoWidth._value + val<width(91) && val<0){
      this.animateUp()
    }
    else{
    if((this.state.videoWidth._value<width(44) && val<0) || (this.state.videoWidth._value>width(91) && val>0) || (this.state.videoWidth._value<width(91) && this.state.videoWidth._value>width(44))){
    Animated.timing(
      this.state.videoWidth,{
        toValue: this.state.videoWidth._value- 4*val//*10,
      }).start();  
      Animated.timing(
        this.state.absoluteLeft,{
          toValue: this.state.absoluteLeft._value + 4*val,
        }).start(); 
    Animated.timing(
      this.state.opacity,{
        toValue: this.state.opacity._value - val/14
      }).start();
    }
    else{
      if(this.state.videoWidth._value<width(44)){
        this.animateDown()
      }
      else{
        this.animateUp()
      }
    }}
  }

  animateLefter = (val) => {
    Animated.timing(
      this.state.absoluteLeft,{
        toValue: this.state.absoluteLeft._value + 5*val,
      }).start(); 
  }

  animateDown = () => {//down video
    console.log('down')
    Animated.timing(
      this.state.videoWidth, {
        toValue: width(60), 
      }).start();    
      Animated.timing(
        this.state.absoluteLeft,{
          toValue: width(34),
        }).start();   
    Animated.timing(
      this.state.opacity,{
        toValue: 0,
      }).start(()=>this.props.setVideoState('modalShort'));    
  }

  animateUp = () => {
    Animated.timing(
      this.state.videoWidth,{
        toValue: width(90),
      }).start();
      Animated.timing(
        this.state.absoluteLeft,{
          toValue: 0,
        }).start(); 
    Animated.timing(
      this.state.opacity,{
        toValue: 1//5, // Animate to final value of 1
      }).start(()=>this.props.setVideoState(true));    
  }

  animateLeft = () => {
    Animated.timing(
      this.state.absoluteLeft,{
        toValue: -width(100),
      }).start(()=> this.props.setVideoShowAndState()); 
  }

  animateRight = () => {
    Animated.timing(
      this.state.absoluteLeft,{
        toValue: width(120),
      }).start(()=> this.props.setVideoShowAndState());
  }

  componentWillMount() {
    //this.animate(100)
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        const { videoShow } = this.props
        if (videoShow.videoState) {
          if((gestureState.dy && this.state.direction!='horizontal')|| videoShow.videoState != 'modalShort'){
            this.setState({direction:'vertical'})
            this.animate(gestureState.dy-this.tmp_move)
            this.tmp_move = gestureState.dy
          } else if(this.state.direction!='vertical'){
            this.setState({direction:'horizontal'})
            this.animateLefter(gestureState.dx-this.tmp_move)  
            this.tmp_move = gestureState.dx        
          }
        }
  //to remember value on prevoius step      
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        this.tmp_move = 0
        this.setState({ direction: 'none' })
        const { videoShow } = this.props
        if (videoShow.videoState) {
          if (videoShow.videoState == 'modalShort') {
            console.log(gestureState)
            if(Math.abs(gestureState.dy)>200){
              this.animateUp()
            } else if(gestureState.dx<-40 && Math.abs(gestureState.dy) <80){
              this.animateLeft()
            } else if(gestureState.dx>40 && Math.abs(gestureState.dy) <80){
              this.animateRight()
            } else{
              this.animateDown()           
            }
          } else{
            if(gestureState.dy<-40){
              this.animateUp()
            } else if (gestureState.dy > 100) {
              this.props.setVideoState(true)                     
              this.animateDown()
            } else{
              this.animateUp()            
            }
          }
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      },
    });
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { videoShow } = this.props
      if (videoShow && videoShow.videoState) {
        const { fullscreen } = this.state
        if (videoShow.videoState != 'modalShort' && !fullscreen) {
          this.props.setVideoState(true)                      
          this.animateDown()
        }
      }
      return true;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.videoShow && this.props.videoShow.video != nextProps.videoShow.video) {
      if (nextProps.videoShow.video) {
        const propsVideoShow = this.props.videoShow
        query('SELECT * FROM VIDEO_DATA WHERE IDYOUTUBE = \'' + nextProps.videoShow.video.youtubeId + '\'')
        .then(result => { 
          if (result && result.length) {
            this.setState({
              internalRepeatCount: nextProps.videoShow.video.fromDb
                ? 0
                : result[0].REPEATES
            })
          } else {
            const { video } = nextProps.videoShow
            this.props.execQueryDb('INSERT INTO VIDEO_DATA (IDYOUTUBE, THUMBNAILURL, REPEATES, DURATION, TITLE, AUTHOR) VALUES (\'' + video.youtubeId + '\', \'' + video.data.snippet.thumbnails.default.url + '\', ' + 0 + ', ' + getDuration(video.data.contentDetails.duration) + ', \'' + video.title + '\', \'' + video.data.snippet.channelTitle + '\');')              
            this.setState({ internalRepeatCount: 0 })
          }
          if ((!nextProps.videoShow.video.mode && nextProps.videoShow.videoState != 'modalShort') || !this.props.videoShow.video || !nextProps.videoShow.videoState || (nextProps.videoShow.video.mode && nextProps.videoShow.videoState != propsVideoShow.videoState)) {
            this.animateUp()
          }
        })
        .catch(error => {
          console.log('error execQueryDb componentWillReceiveProps')
          console.log(error)  
        })
      }
    }
    if (nextProps.orientation && this.props.orientation.key != nextProps.orientation.key) {
      this.orientationDidChange(nextProps.orientation.key)
    }
  }
  

  onChangeState = (state) => {
    const { videoShow } = this.props
    const { video } = videoShow
    if (video && Object.keys(video)) {
      switch (state) {
        case 'ended':   
          this.setState({ internalRepeatCount: this.state.internalRepeatCount + 1 }, () => {
            console.log('video')
            console.log(video)
            if (video.fromDb) {
              this.props.execQueryDb('UPDATE VIDEO_DATA SET REPEATES = ' + (video.repeatsCount + this.state.internalRepeatCount) + ' WHERE ID = ' + video.id + ';')
              this.props.fetchVideosFromDb()
              console.log(video.mode)
              if (video.mode == "goNext") {
                if (video.nextOrder && video.nextOrder.length) {
                  console.log('done next')
                  let findVideoIndex = video.nextOrder.findIndex(videoInOrder => videoInOrder.ID == video.id) + 1
                  if (findVideoIndex == video.nextOrder.length) findVideoIndex = 0
                  console.log('findVideoIndex')
                  console.log(video.id)
                  console.log(findVideoIndex)
                  console.log(video.nextOrder)
                  const nextVideo = video.nextOrder[findVideoIndex]
                  this.props.setVideoShow({
                    id: nextVideo.ID,
                    youtubeId: nextVideo.IDYOUTUBE,
                    title: nextVideo.TITLE,
                    repeatsCount: nextVideo.REPEATES,
                    fromDb: true,
                    mode: 'goNext',
                    nextOrder: video.nextOrder,
                  })
                } else {
                  this.props.setVideoShowAndState()
                }
              } else if (video.mode == 'shuffle') {
                if (video.nextOrder && video.nextOrder.length) {
                  let findVideoIndex = video.nextOrder.findIndex(videoInOrder => videoInOrder.ID == video.id) + 1
                  if (findVideoIndex == video.nextOrder.length) findVideoIndex = 0
                  const nextVideo = video.nextOrder[findVideoIndex]
                  this.props.setVideoShow({
                    id: nextVideo.ID,
                    youtubeId: nextVideo.IDYOUTUBE,
                    title: nextVideo.TITLE,
                    repeatsCount: nextVideo.REPEATES,
                    fromDb: true,
                    mode: 'shuffle',
                    nextOrder: video.nextOrder,
                  })
                } else {
                  this.props.setVideoShowAndState()
                }
              }
            } else {
              query('SELECT * FROM VIDEO_DATA WHERE IDYOUTUBE = \'' + video.youtubeId + '\'')
              .then(result => {
                if (result && result.length) {
                  this.props.execQueryDb('UPDATE VIDEO_DATA SET REPEATES = ' + (this.state.internalRepeatCount) + ' WHERE ID = ' + result[0].ID + ';')                
                } else {
                  this.props.execQueryDb('INSERT INTO VIDEO_DATA (IDYOUTUBE, THUMBNAILURL, REPEATES, DURATION, TITLE, AUTHOR) VALUES (\'' + video.youtubeId + '\', \'' + video.data.snippet.thumbnails.default.url + '\', ' + (this.state.internalRepeatCount)+ ', ' + getDuration(video.data.contentDetails.duration) + ', \'' + video.title + '\', \'' + video.data.snippet.channelTitle + '\');')  
                }
                this.props.fetchVideosFromDb() 
              })
              .catch(error => {
                console.log('error execQueryDb videoShow')
                console.log(error)  
              })
            }
          })
      }
    }
  }

  render() {
    const { videoShow } = this.props
    const fontSize = this.state.videoWidth.interpolate({
      inputRange:[width(45),width(90)],
      outputRange:[10,20]
    })
    const videoHeight = this.state.videoWidth.interpolate({
      inputRange:[width(50),width(90)],
      outputRange:[height(15.6),height(40)]
    })
    const padBottom = this.state.videoWidth.interpolate({
      inputRange:[width(45),width(90)],
      outputRange:[5,300]
    })
    const absoluteTop = this.state.videoWidth.interpolate({
      inputRange:[width(45),width(90)],
      outputRange:[height(90),0]
    })
    const opacity = this.state.videoWidth.interpolate({
      inputRange:[width(45),width(90)],
      outputRange:[0,1]
    })
    const underlayWidth = this.state.videoWidth.interpolate({
      inputRange:[width(45),width(90)],
      outputRange:[width(51),width(100)]
    })
    const underlayHeight = this.state.videoWidth.interpolate({
      inputRange:[width(45),width(90)],
      outputRange:[height(9),height(100)]
    })
    const videoMargin = this.state.videoWidth.interpolate({
      inputRange:[width(45),width(90)],
      outputRange:[width(-2),0]
    })
    backgroundColor = 'rgba(0,0,0,' + this.state.opacity._value +')'
    if (videoShow && videoShow.videoState) {
      return (
        <Animated.View style={[styles.modalWrapper,{height: underlayHeight, width:underlayWidth, top:absoluteTop,backgroundColor: backgroundColor,left:this.state.absoluteLeft,zIndex:100}]} {...this._panResponder.panHandlers}>
          <Animated.Text style={[styles.title, { fontSize: fontSize, opacity: this.state.opacity._value,zIndex:200 }]}>{videoShow.video.title}</Animated.Text>
          <Animated.View style={[styles.image,{width:this.state.videoWidth,height:videoHeight, marginVertical: videoMargin,zIndex:300}]}>
            <YouTube  
              ref={comp => this.youtubeRef = comp}  
              fullscreen={this.state.fullscreen}  
              apiKey={googleApiKey}
              videoId={videoShow.video.youtubeId}
              play={true}
              hidden={false}
              showinfo={false}
              playsInline={true}
              controls={1} //videoShow.videoState == 'modalShort' ? 0 :
              loop={true} 
              onReady={(e)=>{this.setState({isReady: true})}}
              onChangeState={(e)=>{this.onChangeState(e.state)}}
              onChangeQuality={(e)=>{this.setState({quality: e.quality})}}
              onError={(e)=>{this.setState({error: e.error})}}
              style={styles.youtubePlayer} />
          </Animated.View> 
          {
            videoShow.videoState != 'modalShort'
              ? <View style={styles.repeatsWrapper}>
                  <Text style={styles.repeats}>
                  {
                    videoShow && videoShow.video.repeatsCount
                      ? (parseInt(videoShow.video.repeatsCount) + this.state.internalRepeatCount) + ' Repeats'
                      : this.state.internalRepeatCount + ' Repeats'
                  }
                  </Text>
                  {
                    videoShow.video.mode
                      ? <View style={styles.iconWrapper}>
                          <Image style={styles.iconImage} source={
                            videoShow.video.mode == 'goNext'
                              ? require('images/repeats_next.png')
                              : videoShow.video.mode == 'shuffle'
                                ? require('images/repeats_shuffle.png')
                                : null
                          }/>
                        </View> 
                      : null
                  }
                </View>
              : null
          }
        </Animated.View>
      )
    }
    return null
  }
}    

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1B1B',
    zIndex:50,
  },
  image: {
    //resizeMode:'stretch'
    opacity:1,
    alignSelf:'center',
    zIndex:300
  },
  columnElements: {
    flexDirection:'column',
    justifyContent:'space-around',
    height: '100%',
    zIndex:50
  },
  modalWrapper:{
    position:'absolute',
    height: height(100),
    width: width(100),
    top: 0,
    left: 0
  },
  title: {
    color:'white',
    marginBottom: 15,
    marginLeft: width(4)
  },
  youtubePlayer: {
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    zIndex:500,
    //resizeMode:'stretch',
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%'
  },
  repeatsWrapper: {
    marginTop: width(40),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  repeats: {
    color:'#3d3d3d',
    textAlign:'center',
    fontSize:20,
  },
  iconWrapper: {
    height: width(10),
    width: width(10),
    borderRadius: 4
  },
  iconImage: {
    height: '100%',
    width: '100%'
  }
});
