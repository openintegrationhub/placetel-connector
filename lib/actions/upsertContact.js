/* eslint no-param-reassign: "off" */


const { transform } = require('@openintegrationhub/ferryman');
const {
  upsertContact, newMessage,
} = require('./../utils/helpers');
const { personFromOih } = require('../transformations/personFromOih');

/**
 * This method will be called from OIH platform providing following data
 *
 * @param {Object} msg - incoming message object that contains ``body`` with payload
 * @param {Object} cfg - configuration that is account information and configuration field values
 */
async function processAction(msg, cfg) {
  try {
    if (!cfg || !cfg.apiKey) {
      throw new Error('No API key!');
    }

    const transformedMessage = transform(msg, cfg, personFromOih);

    const response = await upsertContact(transformedMessage, cfg);


    this.emit('data', newMessage(response));
  } catch (e) {
    console.error('ERROR: ', e);
    this.emit('error', e);
  }
}

module.exports = {
  process: processAction,
};
