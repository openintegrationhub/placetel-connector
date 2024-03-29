/* eslint no-param-reassign: "off" */
/* eslint consistent-return: "off" */


const { transform } = require('@openintegrationhub/ferryman');
const { upsertContact, deleteContact } = require('./../utils/helpers');
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

    if (msg.data.deleteRequested) {
      if (cfg.deletes) {
        const res = await deleteContact(msg, cfg);

        if (!res) return false;

        const response = {
          metadata: msg.metadata,
          data: {
            delete: res.status,
            timestamp: res.timestamp,
          },
        };

        return this.emit('data', response);
      }
      return console.warn('Delete requested but component is not configured to allow deletes');
    }


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
