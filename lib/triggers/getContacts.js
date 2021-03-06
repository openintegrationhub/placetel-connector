/* eslint no-param-reassign: "off" */


const { transform } = require('@openintegrationhub/ferryman');
const { getContacts } = require('./../utils/helpers');
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

    const oihUid = (msg.metadata !== undefined && msg.metadata.oihUid !== undefined)
      ? msg.metadata.oihUid : undefined;
    const applicationUid = (msg.metadata !== undefined && msg.metadata.applicationUid !== undefined)
      ? msg.metadata.applicationUid : undefined;

    snapshot.lastUpdated = new Date(snapshot.lastUpdated).getTime() || new Date(0).getTime();

    const contacts = await getContacts(cfg, snapshot);

    for (let i = 0; i < contacts.length; i += 1) {
      const updatedAt = new Date(contacts[i].updated_at).getTime();
      if (updatedAt > snapshot.lastUpdated) snapshot.lastUpdated = updatedAt;
      const transformedMessage = transform(contacts[i], cfg, personToOih);
      transformedMessage.applicationUid = applicationUid;
      transformedMessage.oihUid = oihUid;

      this.emit('data', transformedMessage);
    }

    this.emit('snapshot', snapshot);
  } catch (e) {
    console.error('ERROR: ', e);
    this.emit('error', e);
  }
}

module.exports = {
  process: processAction,
};
