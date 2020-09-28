/* eslint prefer-destructuring: "off" */

// Attempts to parse an address string into an object, not particularly accurate
// Todo: find a lightweight way to make parsing more accurate
function parseAddress(adr) {
  try {
    if (!adr) return false;
    const address = {};

    // Separate string into sections by comma
    const sections = adr.split(',');

    if (sections && sections.length) {
      // First section ought to be street and number
      if (sections[0]) {
        let streetParts = sections[0].split(' ');

        // Filter any empty entries
        streetParts = streetParts.filter(part => part && part.length);

        // Check if last part is a number
        const hasNumber = /^\d+/.test(streetParts[streetParts.length - 1]);
        if (hasNumber) {
          address.streetNumber = streetParts[streetParts.length - 1];
          streetParts.pop();
          address.street = streetParts.join(' ').trim();
        } else {
          address.street = streetParts.join(' ').trim();
        }
      }

      // Second section ought to be zipcode and city
      if (sections[1]) {
        let cityParts = sections[1].split(' ');

        // Filter any empty entries
        cityParts = cityParts.filter(part => part && part.length);

        // Check if first part is a number
        const hasNumber = /^\s*\d+/.test(cityParts[0]);
        if (hasNumber) {
          address.zipCode = cityParts[0];
          cityParts.shift();
          address.city = cityParts.join(' ').trim();
        } else {
          address.city = cityParts.join(' ').trim();
        }
      }

      // Third section ought to be region
      if (sections[2]) address.region = sections[2].trim();

      // Fourth section ought to be country
      if (sections[3]) address.country = sections[3].trim();

      return address;
    }

    return false;
  } catch (e) {
    console.error('Could not parse address');
    console.error(e);
    return false;
  }
}

function personToOih(contact) {
  const person = {
    firstName: contact.first_name,
    lastName: contact.last_name,
    addresses: [],
  };

  const meta = {
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

  const privateAddress = parseAddress(contact.address);
  const workAddress = parseAddress(contact.address_work);

  if (privateAddress) person.addresses.push(privateAddress);
  if (workAddress) {
    workAddress.description = 'work';
    person.addresses.push(workAddress);
  }

  return { data: person, meta };
}

module.exports = {
  personToOih,
};
