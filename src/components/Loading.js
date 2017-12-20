import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native'

export default class Loading extends Component {
  render() {
    return (
      <View style={styles.container}>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinner: {
    alignSelf: 'center'
  }
})