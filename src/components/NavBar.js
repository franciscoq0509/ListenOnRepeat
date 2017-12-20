import React, { Component } from 'react';
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, Animated, Easing, TextInput, Keyboard, Image} from 'react-native'
import FAIcon from 'react-native-vector-icons/dist/FontAwesome';

import { width, height, menuItems } from 'constants/config'

import * as ApiUtils from 'actions/utils'

@connect(
  state => ({
    drawer: state.drawer,
    navBarProps: state.navBarProps,
    searchText: state.searchText,
    search: state.search
  }),
  dispatch => ({
    triggerDrawer: () => {
      dispatch(ApiUtils.triggerDrawer())
    },
    triggerSearch: () => {
      dispatch(ApiUtils.triggerSearch())
    },
    setSearchText: (text) => {
      dispatch(ApiUtils.setSearchText(text))
    }
  })
)
export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinIconValue: new Animated.Value(0),
      slideSearchValue: new Animated.Value(0),
      logoWidthValue: new Animated.Value(0),
      lineWidthValue: new Animated.Value(0),
      visibleIconName: 'bars',
      searchMode: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.drawer && this.props.drawer != nextProps.drawer) {
      this.setState({
        visibleIconName: nextProps.drawer.drawerState
          ? 'arrow-left'
          : 'bars'
      })
      this.handleLeftBtn()
    }
    if (nextProps.search && this.props.search.searchState != nextProps.search.searchState) {
      this.triggerSearchMode()
    }
  }
  
  
  handleLeftBtn = () => {
    const { navigation, triggerDrawer, drawer, navBarProps } = this.props
    if (navBarProps && navBarProps.props && navBarProps.props.leftBtn && navBarProps.props.leftBtn.action) {
      return navBarProps.props.leftBtn.action()
    }
    Animated.parallel([
      Animated.timing(this.state.spinIconValue, {
          toValue: drawer.drawerState
            ? 0
            : 360,
          duration: 300,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ),
      Animated.timing(this.state.lineWidthValue, {
          toValue: drawer.drawerState
            ? 0
            : 1,
          duration: 300,
          easing: Easing.linear,
        }
      ),
    ]).start()
    drawer.drawerState
      ? navigation.navigate('DrawerClose')
      : navigation.navigate('DrawerOpen')
  }

  triggerSearchMode = () => {
    const { searchMode } = this.state
    Animated.parallel([
      Animated.timing(this.state.slideSearchValue, {
          toValue: searchMode
            ? 0
            : 1,
          duration: 250,
          easing: Easing.linear,
          useNativeDriver: true
        }
      ),
      Animated.timing(this.state.logoWidthValue, {
          toValue: searchMode
            ? 0
            : 1,
          duration: 50,
        easing: Easing.linear,
        }
      )
    ]).start()
    this.setState({searchMode: !searchMode}, () => {
      if (this.state.searchMode) {
        this.textInput.focus()
      }
    })
  }

  renderIcon = (visibleIconName) => {
    const { navBarProps } = this.props
    if (navBarProps && navBarProps.props && navBarProps.props.leftBtn && navBarProps.props.leftBtn.icon) {
      return <FAIcon name={navBarProps.props.leftBtn.icon} size={22} color="#ffffff" />
    }
    return <FAIcon name={visibleIconName} size={22} color="#ffffff" />
  }

  setSearchText = (text) => {
    const { setSearchText } = this.props
    console.log(text)
    setSearchText(text)
  }

  onSubmitEditing = () => {
    const { searchText } = this.props
    this.props.handleSearch(searchText.text)
  }

  render() {
    const { navigation, searchText, triggerSearch } = this.props
    const { spinIconValue, visibleIconName, slideSearchValue, logoWidthValue, lineWidthValue } = this.state
    const spin = spinIconValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg']
    })
    const lineWidth = lineWidthValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width(100)]
    })
    const slide = slideSearchValue.interpolate({
      inputRange: [0, 1],
      outputRange: [800, 60]
    })
    const logoWidth = logoWidthValue.interpolate({
      inputRange: [0, 1],
      outputRange: [width(44), 0]
    })
    const logoHight = logoWidthValue.interpolate({
      inputRange: [0, 1],
      outputRange: [width(4.6), 0]
    })
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="black" />  
        <View style={styles.contentWrapper}>
          <View style={styles.leftPart}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>  
              <TouchableOpacity onPress={this.handleLeftBtn}>
                {this.renderIcon(visibleIconName)}
              </TouchableOpacity>
            </Animated.View>  
            <Animated.View style={[styles.logoWrapper, {width: logoWidth, height: logoHight}]} >
              <Image source={require('images/logo.png')} style={styles.logo} />
            </Animated.View>  
          </View>    
          <View style={styles.rightPart}>
            <TouchableOpacity onPress={triggerSearch}>  
              <FAIcon name="search" size={22} color="#ffffff" />
            </TouchableOpacity>  
          </View>
          </View>
          <Animated.View style={[styles.bottomLine, {width: lineWidth}]} />
          <Animated.View style={[styles.searchWrapper, {transform: [{translateX: slide}]}]}>
            <TextInput 
              onSubmitEditing={this.onSubmitEditing}
              ref={comp => this.textInput = comp}
              underlineColorAndroid="transparent" 
              style={styles.searchInput}
              autoCapitalize='none' 
              value={searchText.text} 
              onChangeText={text => this.setSearchText(text)}/>
            <TouchableOpacity onPress={triggerSearch}> 
              <View style={styles.crossIconWrapper}> 
                <FAIcon name="close" size={22} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </Animated.View>  
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: height(8),
    width: '100%',
    backgroundColor: '#303030',
    justifyContent: 'space-between',
  },
  contentWrapper: {
    height: '96%',
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width(5),
  },
  leftPart: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  rightPart: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottomLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#bd2c59'
  },
  logoWrapper: {
    marginLeft: width(4),
    overflow: 'hidden'
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch'
  },
  searchWrapper: {
    position: 'absolute',
    left: 0,
    top: width(2.5),
    width: width(82),
    backgroundColor: '#444444',
    height: width(8.4),
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchInput: {
    width: '80%',
    height: width(9),
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: width(3.6),
    alignSelf: 'flex-end',
    marginBottom: width(-1)
  },
  crossIconWrapper: {
    marginHorizontal: width(2)
  },
})