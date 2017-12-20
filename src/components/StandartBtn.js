import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native'

import { height, width } from 'constants/config'

export default class StandartBtn extends Component {
  render() {
    const { onPress, text, action, isActive, iconImage, disabled } = this.props
    let btnStyle = [styles.wrapper]
    let textStyle = [styles.text] 
    let iconWrapperStyle = [styles.iconWrapper]
    if (isActive) btnStyle.push(styles.wrapperActive)
    if (isActive) textStyle.push(styles.textActive)
    if (isActive) iconWrapperStyle.push(styles.iconWrapperActive)
    return (
      <TouchableOpacity disabled={disabled} onPress={() => onPress(action)}>
        <View style={btnStyle}>
          <View style={iconWrapperStyle}>
            <Image source={iconImage} style={styles.icon} />
          </View>  
          <Text style={textStyle}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  
  wrapper: {
    backgroundColor: '#EEEEEE',
    height: width(8),
    width: width(22),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: width(2),
    borderRadius: width(0.2),
    borderColor: '#E4E4E4',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
    borderBottomColor: '#C9C9C9',
    borderBottomWidth: 3,
    borderStyle: 'solid',
    opacity: 0.5
  },
  wrapperActive: {
    opacity: 1
  },
  text: {
    backgroundColor: 'transparent',
    color: '#A4A4A4',
    fontSize: width(3.4)
  },
  textActive: {

  },
  iconWrapper: {
    height: width(5),
    width: width(5),
    marginHorizontal: width(1)
  },
  iconWrapperActive: {

  },
  icon: {
    height: '100%',
    width: '100%'
  }, 
})