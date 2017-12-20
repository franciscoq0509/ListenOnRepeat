import React, { Component, PureComponent } from 'react';
import { connect } from 'react-redux'
import { View, Image, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'

import { width, heigh, menuItems } from 'constants/config'

import * as ApiUtils from 'actions/utils'

class MenuItem extends PureComponent {
  renderIconOrImage = (image, icon) => {
    if (image) {
      return (
        <Image source={image} style={{width: '100%', height: '100%'}} />
      )
    }
  }

  render() {
    const { handleMenuItemAction, text, icon, image, action, active } = this.props
    return (
      <TouchableOpacity disabled={action == 'no'} onPress={() => handleMenuItemAction(action)}>
        <View style={[styles.menuItemWrapper, action == 'no' && {opacity: 0.4}]}>
          <View style={[styles.menuItemIconWrapper, {borderWidth: active 
            ? 2
            : 0
          }]}>
            {this.renderIconOrImage(image, icon)}
          </View>
          <View style={styles.menuItemTextWrapper}>
            <Text style={styles.menuItemText}>{text}</Text>
          </View>  
        </View>
      </TouchableOpacity>
    );
  }
}

@connect(
  state => ({
    drawer: state.drawer,
  }),
  dispatch => ({
    triggerDrawer: () => {
      dispatch(ApiUtils.triggerDrawer())
    },
  })
)
export default class CustomDrawerContentComponent extends Component {
  componentWillReceiveProps(nextProps) {
    const { navigation, drawer } = this.props
    if (nextProps.drawer && drawer != nextProps.drawer) {
      nextProps.drawer.drawerState
        ? navigation.navigate('DrawerOpen')
        : navigation.navigate('DrawerClose')
    }
  }
  
  handleMenuItemAction = (action) => {
    const { navigation } = this.props
    action != 'Explore' && navigation.navigate(action)
  }

  render() {
    const { navigation } = this.props
    return (
      <View style={styles.container}>
        {
          menuItems && menuItems.map((menuItem, idx) => {
            const active = navigation.state.routes[navigation.state.index].routeName == menuItem.action
            return (
              <MenuItem
                key={menuItem.action + '_' + idx}
                active={active}
                handleMenuItemAction={this.handleMenuItemAction}
                {...menuItem} />
            )
          })
        }  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  menuItemWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: width(5),
    paddingVertical: width(2)
  },
  menuItemIconWrapper: {
    width: width(8),
    height: width(8),
    padding: width(1.1),
    borderRadius: width(0.2),
    borderColor: '#bd2c59',
    borderWidth: 2,
    borderStyle: 'solid'
  },
  menuItemTextWrapper: {
    marginLeft: width(6),
  },
  menuItemText: {
    color: 'white',
    fontSize: width(4)
  }
})