'use strict';
const InitialState = require('./chatInitialState').default;

import log from '../../lib/logUtil';

const {
  ON_CHAT_FIELD_CHANGE,
  REQUEST_START_CHAT,
  ON_DB_CHANGE,
  INSERT_MY_CHAT,
  LOGOUT_SUCCESS
} = require('../../lib/constants').default;

const initialState = new InitialState;

export default function chatReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
  switch (action.type) {
    case REQUEST_START_CHAT:
    {
      let {allMsg, ads, partner} = action.payload;
      log.info("call REQUEST_START_CHAT:", partner);

      let messages = convertToGiftMsg(allMsg, partner.userID);

      messages.sort((a,b) => {
        let d1 = a.timeStamp;
        let d2 = b.timeStamp;
        return d1 - d2
      });

      let nextState = state.set("partner", partner)
        .set('ads', ads)
        .set('messages', messages);

      return nextState;
    }

    case ON_CHAT_FIELD_CHANGE:
    {
      const {field, value} = action.payload;
      let nextState = state.set(field, value);
      return nextState;
    }

    case ON_DB_CHANGE:
    {

      const {doc} = action.payload;
      const partnerID = state.partner.userID;

      log.info("Calling chatReducer.ON_DB_CHANGE...", partnerID);

      var nextState = state;
      var {messages} = state;

      if (doc.type == 'Chat'
        && (doc.fromUserID == partnerID || doc.toUserID == partnerID)
        && (doc.relatedToAds.adsID == state.ads.adsID)) {
        convertOne(doc, partnerID);
        let found = messages.find(e => e._id === doc._id); //_id is key
        if (!found) {
          messages = [...messages,doc];
          nextState = state.set('messages',messages);
        }
      }

      return nextState;
    }
    case INSERT_MY_CHAT : {
      const partnerID = state.partner.userID;
      let doc = {}; Object.assign(doc,action.payload);

      log.info("Calling chatReducer.INSERT_MY_CHAT...", partnerID);

      let giftMsg = convertOne(doc, partnerID);
      var {messages} = state;

      let found = messages.find(e => e._id === giftMsg._id);
      if (!found) {
        messages = [...messages,giftMsg];
      }

      let nextState = state.set('messages',messages);
      return nextState;
    }
    case LOGOUT_SUCCESS: {
      let newState = state
        .set("partner", {})
        .set("messages", [])
        .set("ads", {});

      return newState;
    }

  }

  return state;
}

function convertOne(e, partnerID) {
  e.uniqueId = e._id;
  e.position = e.fromUserID == partnerID ? 'left' : 'right';
  e.text = e.content;
  e.name = e.fromFullName;
  e.image = e.avatar ? {uri: e.avatar} : require('../../assets/image/register_avatar_icon.png');

  return e;
}

function convertToGiftMsg(allMsg, partnerID) {
  let messages = allMsg.map((e) => {
    convertOne(e, partnerID);
    return e;
  });

  return messages;
}