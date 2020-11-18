/* eslint prefer-destructuring: "off" */


function personToOih(contact) {
  const person = {
    firstName: contact.first_name,
    lastName: contact.last_name,
    // addresses: [],
  };

  const metadata = {
    recordUid: String(contact.id),
  };

  person.contactData = [
    {
      type: 'email',
      value: contact.email,
    },
    {
      type: 'email',
      value: contact.email_work,
      description: 'work',
    },
    {
      type: 'phone',
      value: contact.phone,
    },
    {
      type: 'phone',
      value: contact.phone_work,
      description: 'work',
    },
    {
      type: 'mobile',
      value: contact.mobile,
    },
    {
      type: 'mobile',
      value: contact.mobile_work,
      description: 'work',
    },
    {
      type: 'fax',
      value: contact.fax,
    },
    {
      type: 'fax',
      value: contact.fax_work,
      description: 'work',
    },
    {
      type: 'facebook',
      value: contact.facebook_url,
    },
    {
      type: 'xing',
      value: contact.xing_url,
    },
    {
      type: 'linkedin',
      value: contact.linkedin_url,
    },
    {
      type: 'twitter',
      value: contact.twitter_account,
    },
  ];

  // Remove empty values
  person.contactData = person.contactData.filter(cd => cd.value);

  // const privateAddress = parseAddress(contact.address);
  // const workAddress = parseAddress(contact.address_work);
  //
  // if (privateAddress) person.addresses.push(privateAddress);
  // if (workAddress) {
  //   workAddress.description = 'work';
  //   person.addresses.push(workAddress);
  // }

  if (contact.company) {
    person.relations = [
      {
        type: 'PersonToOrganization',
        label: 'Employee',
        partner: {
          name: contact.company,
        },
      },
    ];
  }

  return { data: person, metadata };
}

module.exports = {
  personToOih,
};
