/* eslint no-param-reassign: "off" */


const { transform } = require('@openintegrationhub/ferryman');
const {
  getContacts, newMessage,
} = require('./../utils/helpers');
const { personToOih } = require('../transformations/personToOih');

/**
 * This method will be called from OIH platform providing following data
 *
 * @param {Object} msg - incoming message object that contains ``body`` with payload
 * @param {Object} cfg - configuration that is account information and configuration field values
 */
async function processAction(msg, cfg, snapshot = {}) {
  try {
    if (!cfg || !cfg.apiKey) {
      throw new Error('No API key!');
    }

    snapshot.lastUpdated = new Date(snapshot.lastUpdated).getTime() || new Date(0).getTime();

    const contacts = await getContacts(cfg, snapshot);

    for (let i = 0; i < contacts.length; i += 1) {
      const transformedMessage = transform(contacts[i], cfg, personToOih);

      this.emit('data', newMessage(transformedMessage));
    }
  } catch (e) {
    console.error('ERROR: ', e);
    this.emit('error', e);
  }
}

module.exports = {
  process: processAction,
};
