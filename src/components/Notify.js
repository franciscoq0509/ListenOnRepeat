import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native'
import { connect } from 'react-redux'

import { height, width } from 'constants/config'

import * as ApiUtils from 'actions/utils'

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
export default class Notify extends Component {
  constructor(props) {
    super(props);
    const { helpers, helperKey } = props
    this.state = {
      showNotify: helpers && helpers[helperKey] && helpers[helperKey].show
        ? new Animated.Value(1)
        : new Animated.Value(0),
      fullHide: helpers && helpers[helperKey] && helpers[helperKey].show
        ? false
        : true
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.helpers && nextProps.helpers[nextProps.helperKey] != this.props[nextProps.helperKey]) {
      if (nextProps.helpers[nextProps.helperKey].show != this.props.helpers[nextProps.helperKey].show) {
        Animated.timing(this.state.showNotify, {
          toValue: nextProps.helpers[nextProps.helperKey].show
            ? 1
            : 0,
          duration: 150,
          easing: Easing.linear,
        }).start()
        setTimeout(() => {
          this.setState({fullHide: true})
        }, 160)
      }
    }
  }
  
  handleBtnPress = (helperKey, action) => {
    const { triggerHelperShow } = this.props
    switch (action) {
      case 'hide':
        triggerHelperShow(helperKey)  
        break  
    }
  }
  
  render() {
    const { orientation, helpers, helperKey } = this.props
    const { showNotify, fullHide } = this.state
    const helperObj = helpers && helpers[helperKey]
    const notifyHeight = showNotify.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width(14)]
    })
    const styles = stylesOrientation(orientation.key)
    if (helperObj && !fullHide) {
      return (
        <Animated.View style={[styles.wrapper, { height: notifyHeight }, showNotify._value == 1 && {paddingVertical: 0}]}>
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              {helperObj.text}
            </Text>
          </View>  
          <TouchableOpacity onPress={() => this.handleBtnPress(helperKey, helperObj.btns[0].action)}>
            <View style={styles.textBtnWrapper}>
              <Text style={styles.btnText}>
                {helperObj.btns[0].text}
              </Text>
            </View>  
          </TouchableOpacity>  
        </Animated.View>
      );
    }
    return null
  }
}

const stylesOrientation = (orientation) => {
  const port = orientation == 'PORTRAIT'
  return StyleSheet.create({
    wrapper: {
      height: width(14),
      width: width(100),
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#FE0166',
      paddingVertical: width(1),
      paddingHorizontal: width(3),
      overflow: 'hidden'
    },
    textWrapper: {
      width: width(80),
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: width(3.6),
      color: '#FFCCF0',
      textAlign: 'center',
    },
    textBtnWrapper: {
      flex: 1,
      width: width(18),
      justifyContent: 'center',
      alignItems: 'center',
      borderLeftWidth: 1,
      borderLeftColor: '#FF2F84',
      borderStyle: 'solid'
    },
    btnText: {
      fontSize: width(3.6),
      color: '#FFF7FF'
    }
  })
}