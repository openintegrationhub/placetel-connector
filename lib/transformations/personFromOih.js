/* eslint prefer-destructuring: "off" */


function stringifyAddress(adr) {
  // Stringify address from individual fields
  let stringAdr = `${adr.street} ${adr.streetNumber}, ${adr.zipCode} ${adr.city}, ${adr.region}, ${adr.country}`;

  // Remove undefined values
  stringAdr = `${stringAdr.replace(/undefined/g, '')}`;

  // Remove extra commas
  stringAdr = `${stringAdr.replace(/,\s+,/g, ', ')}`;
  stringAdr = `${stringAdr.replace(/,\s*$/g, '')}`;

  // Remove extra spaces
  stringAdr = `${stringAdr.replace(/ +(?= )/g, '')}`.trim();

  return stringAdr;
}

function personFromOih(msg) {
  const contact = {
    first_name: msg.body.data.firstName,
    last_name: msg.body.data.lastName,
  };

  // Attempt to map contact Data to fields, first found entry for each type wins
  for (let i = 0; i < msg.body.data.contactData.length; i += 1) {
    const currentCD = msg.body.data.contactData[i];

    switch (currentCD.type) {
      case 'email':
        if (currentCD.description === 'work' && !contact.email_work) {
          contact.email_work = currentCD.value;
        } else if (!contact.email) {
          contact.email = currentCD.value;
        }
        break;
      case 'phone':
        if (currentCD.description === 'work' && !contact.phone_work) {
          contact.phone_work = currentCD.value;
        } else if (!contact.phone) {
          contact.phone = currentCD.value;
        }
        break;
      case 'mobile':
        if (currentCD.description === 'work' && !contact.mobile_work) {
          contact.mobile_work = currentCD.value;
        } else if (!contact.mobile) {
          contact.mobile = currentCD.value;
        }
        break;
      case 'fax':
        if (currentCD.description === 'work' && !contact.fax_work) {
          contact.fax_work = currentCD.value;
        } else if (!contact.fax) {
          contact.fax = currentCD.value;
        }
        break;
      case 'facebook':
        if (!contact.facebook_url) contact.facebook_url = currentCD.value;
        break;
      case 'linkedin':
        if (!contact.linkedin_url) contact.linkedin_url = currentCD.value;
        break;
      case 'xing':
        if (!contact.xing_url) contact.xing_url = currentCD.value;
        break;
      case 'twitter':
        if (!contact.twitter_account) contact.twitter_account = currentCD.value;
        break;
      default:
        break;
    }
  }

  // Attempt to add addresses, first of each kind wins
  for (let i = 0; i < msg.body.data.addresses.length; i += 1) {
    // If both  addresses have been found, skip remaining
    if (contact.address && contact.address_work) break;

    const currentAdr = msg.body.data.addresses[i];

    if (currentAdr.description === 'work' && !contact.address_work) {
      contact.address_work = stringifyAddress(currentAdr);
    } else if (!contact.address) {
      contact.address = stringifyAddress(currentAdr);
    }
  }

  return { data: contact, meta: msg.body.meta };
}

module.exports = {
  personFromOih,
};
