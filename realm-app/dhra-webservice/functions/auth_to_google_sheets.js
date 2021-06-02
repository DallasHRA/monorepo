exports = async function(args) {
  function getPrivateKey(context) {
    const key = context.values.get('google_json_no_priv');
    key["private_key"] =
      decodeURIComponent(context.values.get('GSheetsPrivateKeyVal'))
    return key;
  }

  function getScopes(context) {
    return context.values.get('google_scopes');
  }

  function auth() {
    return new Promise((res, rej) => {
      let key = getPrivateKey(context)
      let jwtClient = new google.auth.JWT(
        key.client_email,
        null,
        key.private_key,
        getScopes(context));
      jwtClient.authorize((err, tokens) => {
        if (err) {
         console.log(err);
         rej(err);
       } else {
         console.log("Successfully connected!");
         res(Object.assign({}, arguments[0], {jwtClient: jwtClient}));
       }
     });
    });
  }

  return auth.bind(null, args);
}
