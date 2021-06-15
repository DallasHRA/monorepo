const URL_BASE = 'https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/dhra-webservice-usyzs/service/google-sheets-updater/incoming_webhook/'

module.exports = {
  makereq: async function(path, options = { method: 'GET' }) {
    options.headers = {
      'api-key': process.env.REALM_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    options.muteHttpExceptions = true
    if (options.payload) options.payload = JSON.stringify(options.payload);

    console.log(options);
    var response = await UrlFetchApp.fetch(`${URL_BASE}${path}`, options);

    console.log(`${URL_BASE}${path}`)
    console.log('RESP:', response.getContentText());

    return JSON.parse(response.getContentText());
  }
}
