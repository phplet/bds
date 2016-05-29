import keyMirror from 'key-mirror';

export default keyMirror({
  ON_MAP_CHANGE: null,
  ON_SEARCH_FIELD_CHANGE : null,
  SEARCH_STATE_INPUT: null,
  SEARCH_STATE_LOADING: null,
  SEARCH_STATE_SUCCESS: null,
  SEARCH_STATE_FAILURE: null,
  CHANGE_LOADING_SEARCH_RESULT:null,

  FETCH_DETAIL_FAIL: null,
  FETCH_DETAIL_SUCCESS: null,
  SET_LOADING_DETAIL: null,

  SET_SEARCH_LOAI_TIN : null,


  SET_PLATFORM: null,
  SET_VERSION: null,


  ON_LOGIN_STATE_CHANGE: null,
  LOGIN_STATE_LOGOUT: null,
  LOGIN_STATE_REGISTER: null,
  LOGIN_STATE_LOGIN: null,
  LOGIN_STATE_FORGOT_PASSWORD: null,

  SIGNUP_REQUEST: null,
  SIGNUP_SUCCESS: null,
  SIGNUP_FAILURE: null,

  LOGIN_REQUEST: null,
  LOGIN_SUCCESS: null,
  LOGIN_FAILURE: null,

  LOGOUT_REQUEST: null,
  LOGOUT_SUCCESS: null,
  LOGOUT_FAILURE: null,


  //global
  SET_STATE: null,
  GET_STATE: null,
  SET_STORE: null,

  //search-search result
  SET_LISTRESULT_DATASOURCE:null,
  CHANGE_LISTRESULT_TO_LOADING:null,
  FETCH_SEARCH_RESULT_FAIL: null,
  FETCH_SEARCH_RESULT_SUCCESS : null,
  
  //search - map


  ON_AUTH_FIELD_CHANGE: null,

  LAUNCH_APP:null, //enter application
  ROUTER_FOCUS:null,

  //register
  ON_REGISTER_FIELD_CHANGE:null,
  REGISTER_SUCCESS : null,
});
