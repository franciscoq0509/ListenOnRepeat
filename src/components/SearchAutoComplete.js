import React, { Component } from 'react';
import { View, StyleSheet, Animated, ScrollView, FlatList, Easing, TouchableOpacity, Text, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'

import { height, width, } from 'constants/config'
import { checkNextProps } from 'utils'

import * as ApiAutoCompleteResults from 'actions/autoCompleteResults'
import * as ApiSearchVideos from 'actions/searchVideos'
import * as ApiUtils from 'actions/utils'

@connect(state => ({
  autoCompleteResults: state.autoCompleteResults,
  searchText: state.searchText,
  search: state.search
}),
  dispatch => ({
    dispatch,
    fetchAutoCompleteResults: (text) => {
      dispatch(ApiAutoCompleteResults.fetchAutoCompleteResults(text))
    },
    fetchSearchVideos: (text) => {
      dispatch(ApiSearchVideos.fetchSearchVideos(text))
    },
    triggerSearch: () => {
      dispatch(ApiUtils.triggerSearch())
    },
    setSearchText: (text) => {
      dispatch(ApiUtils.setSearchText(text))
    }
  })  
)
export default class SearchAutoComplete extends Component {
  constructor(props) {
    super(props);
    Keyboard.addListener('keyboardDidShow', this.triggerKeyboardListener);
    Keyboard.addListener('keyboardDidHide', this.triggerKeyboardListener);
    this.state = {
      containerHeighValue: new Animated.Value(0),
      autoCompleteResults: [],
      keyboardDidHideListener: false,
      lastSearchedText: ''
    }
  }

  triggerKeyboardListener = () => {
    this.setState({keyboardDidHideListener: !this.state.keyboardDidHideListener})
  }

  componentWillReceiveProps(nextProps) {
    const { fetchAutoCompleteResults } = this.props
    const { lastSearchedText } = this.state
    if (this.props.searchText.text != nextProps.searchText.text) {
      if (nextProps.searchText.text) {
        if (lastSearchedText != nextProps.searchText.text) {
          if (lastSearchedText) this.setState({ lastSearchedText: '' })
          fetchAutoCompleteResults(nextProps.searchText.text)
        }
      } else {
        this.setState({ autoCompleteResults: [] }, () => {
          Animated.timing(this.state.containerHeighValue, {
            toValue: 0,
            duration: 200,
            easing: Easing.linear,
          }
          ).start()
        })
      }
    }
    if (lastSearchedText != nextProps.searchText.text) {
      const propsCheckerAutoCompleteResults = checkNextProps(nextProps, this.props, 'autoCompleteResults')
      if (propsCheckerAutoCompleteResults && propsCheckerAutoCompleteResults != 'empty') {
        this.setState({
          autoCompleteResults: nextProps.autoCompleteResults.response,
        }, () => {
          const { autoCompleteResults } = this.state
          if (autoCompleteResults && autoCompleteResults.length) {
            Animated.timing(this.state.containerHeighValue, {
              toValue: 300,
              duration: 200,
              easing: Easing.linear,
            }
            ).start()
          }
        });
      }
    }
    if (this.props.closeViewTrigger != nextProps.closeViewTrigger) {
      Animated.timing(this.state.containerHeighValue, {
          toValue: 0,
          duration: 100,
          easing: Easing.linear,
        }
      ).start()
    }
  }

  handleItemPress = (item) => {
    this.setState({lastSearchedText: item})
    this.props.handleSearch(item)
  }
  
  renderItem = ({ item }) => {
    const { searchText } = this.props
    const otherText = item.replace(searchText.text, '')
    return (
      <TouchableOpacity onPress={() => this.handleItemPress(item)}>
        <View style={styles.itemWrapper}>
          <Text style={styles.leftPart}>
            {searchText.text}
          </Text>
          <Text style={styles.rightPart}>
            {otherText}
          </Text>  
        </View>
      </TouchableOpacity>
    )
  }

  _keyExtractor = (item, index) => index;

  handleWrapperPress = () => {
    const { setSearchText } = this.props
    setSearchText('')
  }

  outerPress = () => {
    Keyboard.dismiss()
    Animated.timing(this.state.containerHeighValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.linear,
      }
    ).start()
  }
  
  render() {
    const { autoCompleteResults, containerHeighValue } = this.state
    const { searchText } = this.props
    const containerHeight = containerHeighValue.interpolate({
      inputRange: [0, 300],
      outputRange: [0, height(45)]
    })
    const underlayHeight = containerHeighValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, height(86)]
    })
    return (
      <TouchableWithoutFeedback onPress={this.outerPress}>
        <Animated.View style={[styles.wrapperPress, {height: underlayHeight}]}>
          <Animated.View style={[styles.container, {height: containerHeight}]}>
            <FlatList
              data={autoCompleteResults}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
              style={styles.flatList}
              keyboardShouldPersistTaps="always"/>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  wrapperPress: {
    width: width(100),
    position: 'absolute',
    top: width(12),
    left: 0,
  },
  container: {
    backgroundColor: '#444444',
    width: width(82),
    position: 'absolute',
    top: 0,
    left: width(14.5),
    paddingHorizontal: width(3)
  },
  flatList: {
    paddingBottom: width(2)
  },
  itemWrapper: {
    width: '100%',
    height: width(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: width(4)
  },
  leftPart: {
    color: 'white',
    fontSize: width(4.6)
  },
  rightPart: {
    color: '#C62C59',
    fontSize: width(5.2),
  }
})