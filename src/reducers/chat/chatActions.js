'use strict';

const {
  ON_CHAT_FIELD_CHANGE,
  REQUEST_START_CHAT
} = require('../../lib/constants').default;

const _ = require('lodash');

import log from "../../lib/logUtil";
import dbService from "../../lib/localDB";

export function onChatFieldChange(field, value) {
  return {
    type: ON_CHAT_FIELD_CHANGE,
    payload: {field: field, value: value}
  };
}

export function requestStartChat(data) {
  return {
    type: REQUEST_START_CHAT,
    payload: data
  }
}

//payload={doc, partner}, doc is latest CHAT msg
export function startChat(data) {

  return dispatch => {
    dbService.getAllChatMsg(data.partner.userID, data.doc.relatedToAds.adsID)
      .then((allMsg) => {
        dispatch(requestStartChat({allMsg, ...data}))
      });
  };
}


export function sendChatMsg(msg) {

  return dispatch => {
    dbService.sendChat(msg)
      .then( res => console.log("sendChatMsg, result:" + res));
  };
}




