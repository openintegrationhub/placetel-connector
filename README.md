# Placetel Connector

> Placetel Connector for Open Integration Hub.

## Data model
This connector transforms to and from the placetel contact data model, using these fields:

```json
{
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "email_work": "string",
    "company": "string",
    "address": "string",
    "address_work": "string",
    "phone_work": "string",
    "mobile_work": "string",
    "phone": "string",
    "mobile": "string",
    "fax": "string",
    "fax_work": "string",
    "facebook_url": "string",
    "linkedin_url": "string",
    "xing_url": "string",
    "twitter_account": "string"
}
```

As addresses are expressed here only as a single string, this can lead to difficulties accurately parsing them into individual fields. As such, address functionality is currently disabled when transforming data from Placetel, but enabled for transforming to Placetel.

The fields marked here with `_work` correspond to a OIH contactData/address entry with a description "work". As such, a Placetel field of:
```json
"phone_work": "12345"
```
would be represented by:
```json
{
  "type": "phone",
  "value": "12345",
  "description": "work"
}
```
and vice versa.

## Usage

1. Register an account at https://www.placetel.de/
2. Generate an API key at https://web.placetel.de/settings/api#api_token
3. Pass this API key into the connector as property `apiKey`, using either the `fields` object or a secret

## Actions

### upsertContact
This action will upsert a contact in Placetel. If an ID is supplied, the connector will attempt to look up an existing contact with this ID. If the lookup is successful, the contact is updated with the new values. If no existing contact is found, a new one will be created instead.

## Triggers

### getContacts
This trigger will get all contacts from the associated Placetel account and pass them forward. By default it will only fetch the first 1000 entries.

## Integrated Transformations

By default, this connector attempts to automatically transform data to and from the OIH Address Master Data model. If you would like to use your own transformation solution, simply set `skipTransformation: true` in the `fields` object of your flow configuration. Alternatively, you can also inject a valid, stringified JSONata expression in the `customMapping` key of the `fields` object, which will be used instead of the integrated transformation.
