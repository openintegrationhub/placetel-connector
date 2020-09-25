/* eslint no-await-in-loop: "off" */

const request = require('request-promise').defaults({ simple: false, resolveWithFullResponse: true });
const uuid = require('uuid');


function newMessage(body) {
  const msg = {
    id: uuid.v4(),
    attachments: {},
    body,
    headers: {},
    metadata: {},
  };

  return msg;
}


module.exports = {
  getFriends
};
