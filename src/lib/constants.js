import keyMirror from 'key-mirror';

export default keyMirror({
  SET_PLATFORM: null,
  SET_VERSION: null,

  SESSION_TOKEN_REQUEST: null,
  SESSION_TOKEN_SUCCESS: null,
  SESSION_TOKEN_FAILURE: null,
  
  ON_LOGIN_STATE_CHANGE: null,
  LOGIN_STATE_LOGOUT: null,
  LOGIN_STATE_REGISTER: null,
  LOGIN_STATE_LOGIN: null,
  LOGIN_STATE_FORGOT_PASSWORD: null,
  
  ON_AUTH_FORM_FIELD_CHANGE: null,
  SIGNUP_REQUEST: null,
  SIGNUP_SUCCESS: null,
  SIGNUP_FAILURE: null,

  LOGIN_REQUEST: null,
  LOGIN_SUCCESS: null,
  LOGIN_FAILURE: null,

  LOGOUT_REQUEST: null,
  LOGOUT_SUCCESS: null,
  LOGOUT_FAILURE: null,

  LOGGED_IN: null,
  LOGGED_OUT: null,

  SET_SESSION_TOKEN: null,

  RESET_PASSWORD_REQUEST: null,
  RESET_PASSWORD_SUCCESS: null,
  RESET_PASSWORD_FAILURE: null,

  GET_PROFILE_REQUEST: null,
  GET_PROFILE_SUCCESS: null,
  GET_PROFILE_FAILURE: null,

  ON_PROFILE_FORM_FIELD_CHANGE: null,
  
  PROFILE_UPDATE_REQUEST: null,
  PROFILE_UPDATE_SUCCESS: null,
  PROFILE_UPDATE_FAILURE: null,

  //global
  SET_STATE: null,
  GET_STATE: null,
  SET_STORE: null
});
