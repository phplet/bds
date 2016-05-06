'use strict';

const {
  GET_PROFILE_SUCCESS,
  SIGNUP_SUCCESS,
  LOGIN_SUCCESS,

  GET_STATE,
  SET_STATE,
  SET_STORE,
  INIT_LOCAL_DB
  
} = require('../../lib/constants').default;

import InitialState from './globalInitialState';

var Immutable = require('immutable');

const initialState = new InitialState;
/**
 * ## globalReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function globalReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.merge(state);

  switch (action.type) {
    /**
     * ### Save the payload in the store
     *
     * This payload is the ```currentUser``` object returned by
     * Parse.com.  It contains the ```sessionToken``` and the user's
     * ```objectId``` which will be needed for some calls to Parse
     */
  case GET_PROFILE_SUCCESS:
  case SIGNUP_SUCCESS:
  case LOGIN_SUCCESS:
    //let tmp = Immutable.fromJS({currentUser:action.payload});
    let newState = state.setIn(["currentUser", "phone"], action.payload.phone);

    /*
      let newState1 = state.setIn(['currentUser', 'userID'], action.payload.userID)
          .setIn(['currentUser', 'name'], action.payload.name)
          .setIn(['currentUser', 'isDevice'], action.payload.isDevice);
    */

    return newState;
    /**
     * ### sets the payload into the store
     *
     * *Note* this is for support of Hot Loading - the payload is the
     * ```store``` itself.
     *
     */
  case SET_STORE:
    return state.set('store',action.payload);

    /**
     * ### Get the current state from the store
     *
     * The Redux ```store``` provides the state object.
     * We convert each key to JSON and set it in the state
     *
     * *Note*: the global state removes the ```store```, otherwise,
     * when trying to convert to JSON, it will be recursive and fail
     */    
  case GET_STATE:
    let _state = state.store.getState();

    if (action.payload) {
      let newState = {};
      newState['auth'] = _state.auth.toJS();
      newState['device'] = _state.device.toJS();
      newState['profile'] = _state.profile.toJS();    
      newState['global'] = _state.global.set('store',null).toJS();

      return state.set('showState',action.payload)
        .set('currentState',newState);
    } else {
      return state.set('showState',action.payload);
    }

    /**
     * ### Set the state
     *
     * This is in support of Hot Loading
     *
     */    
  case SET_STATE:
    var global = JSON.parse(action.payload).global;
    var next = state.set('currentUser', global.currentUser)
          .set('showState', false)
          .set('currentState', null);
    return next;

  case INIT_LOCAL_DB:
      var global = JSON.parse(action.payload).global;
    var next = state.set('currentUser', global.currentUser)
        .set('showState', false)
        .set('currentState', null);
    return next;

  }
  
  return state;
}
