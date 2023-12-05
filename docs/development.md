# Development

This integration connects to the Armis Centrix portal using the Armis APIs for
collecting data.

## Prerequisites

Aside from what is documented in the [README](../README.md), no special tooling
is required to run and test this integration.

## Provider account setup

### Deep Security

To start, ensure you have a valid Armis Centrix account.

## Authentication

You'll need to generate an API Key to access/authenticate to the Armis Centrix

1. Log in to your Armis Centrix account
2. Go to the API Management from the Settings option
3. Click on Generate to generate an API key or Show to use an existing API
4. Create a .env file at the root of this project, and set an API_KEY variable
   with the copied value.
5. Additionally, you'll also need to set the host and the historic time frame
   for which you would like to lookup the data

```bash
HOST="Armis hostname"
API_KEY="Paste the api key here"
TIME_FRAME="Time frame in days, e.g. 15"
```

After following the above steps, you should now be able to start contributing to
this integration.

After following the above steps, you should be able to now invoke the
integration to start collecting data. The integration will pull in the `HOST`,
`API_KEY`, and `TIME_FRAME` variable from the `.env` file and use them to make
API calls to Armis Centrix.
