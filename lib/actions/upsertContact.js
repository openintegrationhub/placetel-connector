/* eslint no-param-reassign: "off" */


const { transform } = require('@openintegrationhub/ferryman');
const { upsertContact } = require('./../utils/helpers');
const { personFromOih } = require('../transformations/personFromOih');

/**
 * This method will be called from OIH platform providing following data
 *
 * @param {Object} msg - incoming message object that contains ``data`` with payload
 * @param {Object} cfg - configuration that is account information and configuration field values
 */
async function processAction(msg, cfg) {
  try {
    if (!cfg || !cfg.apiKey) {
      throw new Error('No API key!');
    }

    const oihUid = (msg.metadata !== undefined && msg.metadata.oihUid !== undefined)
      ? msg.metadata.oihUid : undefined;
    const applicationUid = (msg.metadata !== undefined && msg.metadata.applicationUid !== undefined)
      ? msg.metadata.applicationUid : undefined;

    const transformedMessage = transform(msg, cfg, personFromOih);

    const response = await upsertContact(transformedMessage, cfg);


    // this.emit('data', response);

    const oihMeta = {
      applicationUid,
      oihUid,
    };
    oihMeta.recordUid = response.id;

    this.emit('data', { metadata: oihMeta });
  } catch (e) {
    console.error('ERROR: ', e);
    this.emit('error', e);
  }
}

module.exports = {
  process: processAction,
};
