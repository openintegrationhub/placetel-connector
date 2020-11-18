/* eslint no-await-in-loop: "off" */
/* eslint consistent-return: "off" */

const request = require('request-promise').defaults({ simple: false, resolveWithFullResponse: true });

async function lookupContact(msg, cfg) {
  try {
    const options = {
      method: 'GET',
      uri: `https://api.placetel.de/v2/contacts/${msg.metadata.recordUid}`,
      json: true,
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
      },
    };

    const response = await request(options);

    if (response.statusCode === 200) {
      return String(response.body.id);
    }

    return false;
  } catch (e) {
    console.error(e);
  }
}

async function upsertContact(msg, cfg) {
  try {
    let id = false;
    if (msg.metadata && msg.metadata.recordUid) {
      id = await lookupContact(msg, cfg);
    }

    const options = {
      method: id ? 'PUT' : 'POST',
      uri: id ? `https://api.placetel.de/v2/contacts/${id}` : 'https://api.placetel.de/v2/contacts',
      json: true,
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
      },
      body: msg.data,
    };

    const response = await request(options);

    // Upon success, return the new ID
    if (response.statusCode === 200 || response.statusCode === 201) {
      const newMeta = msg.metadata;
      newMeta.recordUid = String(response.body.id);
      return { metadata: newMeta };
    }
    return false;
  } catch (e) {
    console.error(e);
  }
}

async function getContacts(cfg, snapshot) {
  try {
    const options = {
      method: 'GET',
      uri: 'https://api.placetel.de/v2/contacts/',
      json: true,
      qs: {
        per_page: 1000,
      },
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
      },
    };

    const response = await request(options);

    if (response.statusCode === 200) {
      let contacts = response.body;
      contacts = contacts.filter(contact => new Date(contact.updated_at).getTime() > snapshot.lastUpdated);
      return contacts;
    }
    return [];
  } catch (e) {
    console.error(e);
  }
}


module.exports = {
  upsertContact, getContacts,
};
