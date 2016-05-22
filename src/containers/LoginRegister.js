'use strict';

import React, { View, Text, StyleSheet, Component, TextInput} from 'react-native';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * The actions we need
 */
import * as globalActions from '../reducers/global/globalActions';
import * as authActions from '../reducers/auth/authActions';

import RegisterTab from '../components/login/RegisterTab';
import LoginTab from '../components/login/LoginTab';

/**
 * Immutable Map
 */
import {Map} from 'immutable';

import {Alert} from "react-native";

import ScrollableTabView from 'react-native-scrollable-tab-view';

import gui from "../lib/gui";

import LoginRegisterTabBar from "../components/login/LoginRegisterTabBar"

/**
 * ## Redux boilerplate
 */
const actions = [
    globalActions,
    authActions
];

function mapStateToProps(state) {
    return {
        ...state
    };
}

function mapDispatchToProps(dispatch) {
    const creators = Map()
        .merge(...actions)
        .filter(value => typeof value === 'function')
        .toObject();

    return {
        actions: bindActionCreators(creators, dispatch),
        dispatch
    };
}

export default class LoginRegister extends React.Component {
  onChangeTab(data) {

    //change focus, not now
    if (data.i===0) {
      //this.usernameRegister.focus();
    } else {
      //this.usernameLogin.focus();
    }
  }

  onDidMountLoginTab(usernameInput) {
    this.usernameLogin = usernameInput
  }

  onDidMountRegisterTab(usernameInput) {
    this.usernameRegister = usernameInput
  }

  renderTabBar() {
    return <LoginRegisterTabBar />
  }

  render(){
    return (
      <ScrollableTabView
        renderTabBar={this.renderTabBar}
        style={styles.container}
                         tabBarUnderlineColor={gui.mainColor}
                         tabBarActiveTextColor={gui.mainColor}
                         onChangeTab={this.onChangeTab.bind(this)}
      >
        <RegisterTab tabLabel="ĐĂNG KÝ" ref="registerTab"
                     onDidMount={this.onDidMountRegisterTab.bind(this)}
        />
        <LoginTab tabLabel="ĐĂNG NHẬP" ref="loginTab"
                  onDidMount={this.onDidMountLoginTab.bind(this)}
        />
      </ScrollableTabView>
    )
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginRegister);

var styles = StyleSheet.create({
    container: {
        backgroundColor: "#f2f2f2"
    },

    label: {
        fontSize: 15,
        fontWeight: "bold"
    },

    input: {
        fontSize: 15,
        width: 200,
        height: 30,
        borderWidth: 1,
        alignSelf: 'center',
        padding: 5

    }
});