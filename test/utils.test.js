/* eslint no-unused-expressions: "off" */

const { expect } = require('chai');
const nock = require('nock');
const { upsertContact, getContacts } = require('../lib/utils/helpers');

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
      metadata: {
        recordUid: undefined,
        oihUid: 'TestOihUid',
      },
    };

    const cfg = {
      apiKey: 'aTestKey',
    };

    const response = await upsertContact(msg, cfg);

    expect(response.metadata.recordUid).to.equal('12345');
    expect(response.metadata.oihUid).to.equal('TestOihUid');
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
      metadata: {
        recordUid: '54321',
        oihUid: 'AnotherTestOihUid',
      },
    };

    const cfg = {
      apiKey: 'aTestKey',
    };

    const response = await upsertContact(msg, cfg);

    expect(response.metadata.recordUid).to.equal('54321');
    expect(response.metadata.oihUid).to.equal('AnotherTestOihUid');
  });
});

describe('Get Contacts', () => {
  it('should get a filtered list of contacts', async () => {
    nock('https://api.placetel.de/v2/contacts/', {
      reqheaders: {
        authorization: 'Bearer aTestKey',
      },
    })
      .get('/')
      .query({
        page: 1,
        per_page: 100,
      })
      .reply(200, [
        { id: 1, updated_at: '2018-08-16T11:42:47.000+02:00' },
        { id: 2, updated_at: '2018-08-17T11:42:47.000+02:00' },
        { id: 3, updated_at: '2018-08-18T11:42:47.000+02:00' },
      ]);

    const response = await getContacts({ apiKey: 'aTestKey' }, { lastUpdated: new Date('2018-08-16T13:00:00.000+02:00').getTime() });

    expect(response).to.have.lengthOf(2);
    expect(response[0].id).to.equal(2);
    expect(response[1].id).to.equal(3);
  });
});
