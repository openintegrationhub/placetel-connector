/* eslint no-unused-expressions: "off" */

const { expect } = require('chai');
const nock = require('nock');
const { upsertContact } = require('../lib/utils/helpers');

describe('Upsert Contact', () => {
  it('should insert a contact if none is found', async () => {
    nock('https://api.placetel.de/v2/contacts/', {
      reqheaders: {
        authorization: 'Bearer aTestKey',
      },
    })
      .get('/nonexistentuid')
      .reply(404, {});

    nock('https://api.placetel.de/v2/contacts/', {
      reqheaders: {
        authorization: 'Bearer aTestKey',
      },
    })
      .post('', {
        first_name: 'John',
        last_name: 'Doe',
        email: 'jdoe@mail.com',
        phone: '13579',
        mobile: '08642',
      })
      .reply(201, {
        id: 12345,
        first_name: 'John',
        last_name: 'Doe',
        email: 'jdoe@mail.com',
        phone: '13579',
        mobile: '08642',
      });


    const msg = {
      data: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'jdoe@mail.com',
        phone: '13579',
        mobile: '08642',
      },
      meta: {
        recordUid: undefined,
        oihUid: 'TestOihUid',
      },
    };

    const cfg = {
      apiKey: 'aTestKey',
    };

    const response = await upsertContact(msg, cfg);

    expect(response.meta.recordUid).to.equal('12345');
    expect(response.meta.oihUid).to.equal('TestOihUid');
  });

  it('should update a contact if one is found', async () => {
    nock('https://api.placetel.de/v2/contacts', {
      reqheaders: {
        authorization: 'Bearer aTestKey',
      },
    })
      .get('/54321')
      .reply(200, {
        id: 54321,
        first_name: 'John',
        phone: '13579',
      });

    nock('https://api.placetel.de/v2/contacts', {
      reqheaders: {
        authorization: 'Bearer aTestKey',
      },
    })
      .put('/54321', {
        first_name: 'John',
        last_name: 'Doe',
        email: 'jdoe@mail.com',
        phone: '13579',
        mobile: '08642',
      })
      .reply(200, {
        id: 54321,
        first_name: 'John',
        last_name: 'Doe',
        email: 'jdoe@mail.com',
        phone: '13579',
        mobile: '08642',
      });


    const msg = {
      data: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'jdoe@mail.com',
        phone: '13579',
        mobile: '08642',
      },
      meta: {
        recordUid: '54321',
        oihUid: 'AnotherTestOihUid',
      },
    };

    const cfg = {
      apiKey: 'aTestKey',
    };

    const response = await upsertContact(msg, cfg);

    expect(response.meta.recordUid).to.equal('54321');
    expect(response.meta.oihUid).to.equal('AnotherTestOihUid');
  });
});
