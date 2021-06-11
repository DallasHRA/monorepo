exports = async function(changeEvent) {
  const fetch = require('node-fetch');
  var jwt = require('jsonwebtoken');

  function makeReturn(paramsIn, paramsOut) {
    return Promise.resolve(Object.assign({}, paramsIn, paramsOut));
  }

  function getScopes(context) {
    return context.values.get('google_scopes').join(' ');
  }

  function getDocument(changeEvent) {
    return Promise.resolve({doc: changeEvent.fullDocument, changeEvent })
  }

  function getPrivateKey(context) {
    const key = context.values.get('google_json_no_priv');
    key["private_key_id"] = context.values.get('google_private_key_id_val');
    key["private_key"] =
      decodeURIComponent(context.values.get('google_private_key_val'))
    return key;
  }

  function getToken() {
    const key = getPrivateKey(context);

    const now = Math.floor(Date.now()/1000)
    const payload = {
      "iss": key['client_email'],
      "sub": "contact@dallashra.com",
      "scope": getScopes(context),
      "aud": key['token_uri'],
      "exp": (now + 3600),
      "iat": now
    }

    const options = {
      algorithm: "RS256",
      header: {"alg":"RS256","typ":"JWT"}
    }

    token = jwt.sign(payload, key['private_key'], options)
    return makeReturn(arguments[0], {key: key, jwt: token});
  }

  async function getOauth({key, jwt}) {
    const data = {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    }
    const response = await fetch(key['token_uri'], {
      method: 'POST',
      headers: {
        ContentType: 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }

  function buildReqBody(doc) {
    const body = {
      "function": "addFieldRunners",
      "parameters": [[doc]]
    }
    return body;
  }

  async function updateSheet({doc, access_token, token_type}) {
    // console.log('BODY:', JSON.stringify(buildReqBody(doc)));
    const options = {
      method: 'POST',
      headers: {
        ContentType: 'application/json',
        Authorization: `${token_type} ${access_token}`
      },
      body: JSON.stringify(buildReqBody(changeEvent.fullDocument))
    };
    console.log("OPTIONS:", JSON.stringify(options));

    const response = await fetch('https://script.googleapis.com/v1/scripts/AKfycbyKDiAwHMO77-evhxHA2mdswGYh_S_QTbgDXVcVnhEpDOkLjs67Xiyj00RoYgQUBHurpw:run', options);
    return response.json();
  }

  const resp = await getDocument(changeEvent)
    .then(getToken)
    .then(getOauth)
    .then(updateSheet);
    
  console.log(JSON.stringify(resp));
  return resp;
}
