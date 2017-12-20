import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Stylesheet, Animated, Easing, StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'

import { width, height } from 'constants/config'

import * as ApiUtils from 'actions/utils'

class TutorialItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animateValue: new Animated.Value(0)
    }
  }

  componentDidMount() {
    this.startAnimation()
  }

  startAnimation = () => {
    setTimeout(() => {
      Animated.timing(this.state.animateValue, {
        toValue: 1,
        duration: 600,
        easing: Easing.linear,
      }).start()
      setTimeout(() => {
        Animated.timing(this.state.animateValue, {
          toValue: 0,
          duration: 10,
          easing: Easing.linear,
        }).start()
        this.startAnimation()
      }, 300)
    }, 100)
  }

  getStyleFromAction = (icon) => {
    const { animateValue } = this.state
    switch (icon.action) {
      case 'left|right':
        return {
          left: animateValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, width(20)]
          }),
          height: width(icon.height),
          width: width(icon.width)
        }
      case 'bottom|top':
        return {
          top: animateValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, width(30)]
          }),
          height: width(icon.height),
          width: width(icon.width)
        }
    }
  }
  
  
  render() {
    const { item, handleBtnPress } = this.props
    const animateStyle = this.getStyleFromAction(item.icon)
    return (
      <View style={styles.itemWrapper}>
        <View style={styles.animationWrapper}>
          <Animated.View style={[styles.animatedIcon, animateStyle]}>
            <Image source={item.icon.image} style={styles.animatedIconImage} />
          </Animated.View>  
        </View>  
        <View style={styles.textWrapper}>
          <Text style={styles.text}>
            {item.text}  
          </Text>
        </View>
        <View style={styles.btnWrapper}>
          <TouchableOpacity onPress={() => handleBtnPress(item.btns[0].action)}>
            <View style={styles.btnInner}>
              <Text style={styles.btnText}>
                {item.btns[0].text}  
              </Text>  
            </View>  
          </TouchableOpacity> 
        </View>
      </View>
    );
  }
}

@connect(state => ({
  orientation: state.orientation,
  helpers: state.helpers
}),
  dispatch => ({
    triggerHelperShow: (helperKey) => {
      dispatch(ApiUtils.triggerHelperShow(helperKey))
    },
  })  
)
export default class Tutoial extends Component {
  constructor(props) {
    super(props);
    const { helpers, helperKey } = props
    this.state = {
      leftOffsetValue: new Animated.Value(0),
      fullHide: helpers && helpers[helperKey] && helpers[helperKey].show
        ? false
        : true,
      activeTutorialItem: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.helpers && nextProps.helpers[nextProps.helperKey] != this.props[nextProps.helperKey]) {
      if (nextProps.helpers[nextProps.helperKey].show != this.props.helpers[nextProps.helperKey].show) {
        setTimeout(() => {
          this.setState({fullHide: true})
        }, 160)
      }
    }
  }
  
  
  handleBtnPress = (action) => {
    const { helperKey, triggerHelperShow } = this.props
    switch (action) {
      case 'next':
        this.scrollToNextItem()
        break  
      case 'hide':
        triggerHelperShow(helperKey)
        break  
    }
  }

  scrollToNextItem = () => {
    this.setState({ activeTutorialItem: this.state.activeTutorialItem + 1 }, () => {
      Animated.timing(this.state.leftOffsetValue, {
        toValue: this.state.activeTutorialItem,
        duration: 300,
        easing: Easing.linear,
      }).start()
    })
  }

  generateTutorial = (items) => {
    return items.map(item => <TutorialItem
      handleBtnPress={this.handleBtnPress}
      key={item.key}
      item={item} />)
  }

  render() {
    const { orientation, helpers, helperKey } = this.props
    const { leftOffsetValue, fullHide } = this.state
    const helperObj = helpers && helpers[helperKey]
    if (helperObj && helperObj.items.length && !fullHide) {
      const leftOffset = leftOffsetValue.interpolate({
        inputRange: [0, 1, 2, 3, 4],
        outputRange: [0, width(-100), width(-200), width(-300), width(-400)]
      })
      return (
        <View style={styles.wrapper}>
          <Animated.View style={[styles.contentWrapper, {width: width(100) * helperObj.items.length}, {left: leftOffset}]}>
             {this.generateTutorial(helperObj.items)}
          </Animated.View>
        </View>
      );
    }
    return null
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    height: height(100),
    width: width(100),
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  contentWrapper: {
    marginTop: width(30),
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  itemWrapper: {
    width: width(100),
    paddingHorizontal: width(8),
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  animationWrapper: {
    height: width(60),
    width: '100%',
  },
  animatedIcon: {
    position: 'absolute',
    top: width(30),
    left: 0,
  },
  animatedIconImage: {
    width: '100%',
    height: '100%'
  },
  textWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 1
  },
  text: {
    textAlign: 'right',
    color: 'white',
    fontSize: width(5.4)
  },
  btnWrapper: {
    marginTop: width(4)
  },
  btnInner: {
    backgroundColor: '#C70D58',
    justifyContent: 'center',
    alignItems: 'center',
    width: width(40),
    height: width(10),
    borderRadius: 4
  },
  btnText: {
    color: 'white',
    fontSize: width(5)
  },
})