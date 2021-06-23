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
  let page = 1;
  try {
    const options = {
      method: 'GET',
      uri: 'https://api.placetel.de/v2/contacts/',
      json: true,
      qs: {
        page,
        per_page: 100,
      },
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
      },
    };

    let response = await request(options);

    let contacts = [];
    let nextPage = false;
    if (response.statusCode === 200) {
      contacts = response.body;
      if (contacts.length >= 100) nextPage = true;
      contacts = contacts.filter(contact => new Date(contact.updated_at).getTime() > snapshot.lastUpdated);
      page += 1;

      while (nextPage && page < 20) {
        options.qs.page = page;
        try {
          response = await request(options);
        } catch (e) {
          console.error(e);
        }
        const currentContacts = response.body;

        if (Array.isArray(currentContacts)) {
          contacts = contacts.concat(currentContacts);
          nextPage = (currentContacts >= 100);
        } else {
          nextPage = false;
        }

        page += 1;
      }

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
