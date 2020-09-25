/* eslint no-unused-expressions: "off" */

const { expect } = require('chai');
const { transform } = require('@openintegrationhub/ferryman');
const { personFromOih } = require('../lib/transformations/personFromOih');

describe('Transformations', () => {
  it('should transform a full message into placetel format', async () => {
    const msg = {
      body: {
        data: {
          firstName: 'Jane',
          lastName: 'Doe',
          contactData: [
            {
              type: 'phone',
              description: 'work',
              value: '13579',
            },
            {
              type: 'email',
              value: 'jdoe@mail.com',
            },
            {
              type: 'xing',
              value: 'xing.com/JaneDoe',
            },
            {
              type: 'phone',
              value: '24680',
            },
            {
              type: 'mobile',
              value: '08642',
            },
            {
              type: 'email',
              description: 'work',
              value: 'jdoe@workplace.com',
            },
            {
              type: 'twitter',
              value: '@jdoe',
            },
            {
              type: 'linkedin',
              value: 'linkedin.com/jane',
            },
            {
              type: 'facebook',
              value: 'facebook.com/janemacydoe',
            },
            {
              type: 'mobile',
              description: 'work',
              value: '97531',
            },
            {
              type: 'fax',
              description: 'work',
              value: '15038',
            },
            {
              type: 'fax',
              value: '01735',
            },
          ],
          addresses: [
            {
              city: 'Homecity',
              street: 'Homestreet',
              streetNumber: '21',
            },
            {
              city: 'Workcity',
              zipCode: '12345',
              street: 'Workstreet',
              streetNumber: '42',
              region: 'Workregion',
              country: 'Workcountry',
              description: 'work',
            },
          ],
        },
        meta: {
          recordUid: '12345',
          oihUid: '54321',
        },
      },
    };


    const expectedResponse = {
      data: {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jdoe@mail.com',
        email_work: 'jdoe@workplace.com',
        address: 'Homestreet 21, Homecity',
        address_work: 'Workstreet 42, 12345 Workcity, Workregion, Workcountry',
        phone_work: '13579',
        mobile_work: '97531',
        phone: '24680',
        mobile: '08642',
        fax: '01735',
        fax_work: '15038',
        facebook_url: 'facebook.com/janemacydoe',
        linkedin_url: 'linkedin.com/jane',
        xing_url: 'xing.com/JaneDoe',
        twitter_account: '@jdoe',
      },
      meta: {
        recordUid: '12345',
        oihUid: '54321',
      },
    };

    const response = transform(msg, {}, personFromOih);

    expect(response).to.deep.equal(expectedResponse);
  });
});
