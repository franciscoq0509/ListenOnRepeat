import React, { Component } from 'react';
import { View, Modal, TouchableWithoutFeedback, TouchableHighlight, Text, TouchableOpacity, TextInput } from 'react-native'

import { mainColor, FBApp } from 'constants/config'
import styles from 'constants/stylesheets/main'

export default class AuthModal extends Component {
  constructor(props) {
    super(props);
    const authFields = {
      password: '',
      email: ''
    }
    this.state = {
      showModal: false,
      authFields: authFields,
      agreeIsActive: false
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.tiggerModal != nextProps.tiggerModal) {
      this.setState({showModal: !this.state.showModal})
    }
  }

  doAuth = (withoutAgree) => {
    const { authFields, agreeIsActive } = this.state
    const { navigation } = this.props
    if (agreeIsActive) {
      if (authFields.password) {
        this.setState({showModal: !this.state.showModal})
        navigation.navigate('Login', authFields)
      }
    }
  }

  onAuthFieldChange = (text, filedName) => {
    const newState = this.state.authFields
    if (filedName == 'password') {
      if (text.length <= 6) newState[filedName] = text
    } else {
      newState[filedName] = text
    }
    this.setState({authFields: newState})
  }

  onAgreePress = () => {
    this.setState({agreeIsActive: !this.state.agreeIsActive})
  }

  render() {
    const { agreeIsActive, authFields } = this.state
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.showModal}
        onRequestClose={() => {console.log("Modal has been closed.")}}>
        <TouchableWithoutFeedback style={styles.modalWrapper}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modalInner}>
                <Text style={styles.modalTitle}>Wellcome to FreeBees</Text>
                <Text style={styles.modalDesc}>One persons junk is another treasure. Here you can find what others are giving away for free.</Text>
                <View style={styles.agreeWrapper}>
                  <TouchableOpacity onPress={this.onAgreePress} style={[styles.agreeButton, {backgroundColor: agreeIsActive ? mainColor : '#9b9b9b'}]} />
                  <Text style={styles.agreeText}>I AGREE TO BE GOOD, AND THE TERMS OF USE I JUST READ</Text>
                </View>
                <View style={styles.fieldsWrapper}>
                  <View>
                    <TextInput 
                      underlineColorAndroid="transparent"  
                      placeholder="Your email"  
                      value={authFields.email} 
                      style={styles.textInput}
                      onChangeText={(text) => this.onAuthFieldChange(text, 'email')} />  
                    <Text style={styles.hintMsg}>Remember it.</Text>
                    <TextInput 
                      underlineColorAndroid="transparent"  
                      placeholder="Your password"  
                      value={authFields.password} 
                      style={styles.textInput}
                      onChangeText={(text) => this.onAuthFieldChange(text, 'password')} />
                  </View>
                </View>
                <TouchableHighlight underlayColor={mainColor} style={styles.authBtn} onPress={this.doAuth}>
                  <Text style={styles.textInBtn}>Go Time!</Text>
                </TouchableHighlight>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}
