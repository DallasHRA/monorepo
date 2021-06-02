exports = async function(changeEvent) {
  const {google} = require('googleapis');

  function getPrivateKey(context) {
    const key = context.values.get('google_json_no_priv');
    key["private_key_id"] = context.values.get('google_private_key_id_val');
    key["private_key"] =
      decodeURIComponent(context.values.get('google_private_key_val'))
    console.log(key["private_key"])
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

  async function getSheet({jwtClient}) {
    let spreadsheetId = context.values.get('field_agent_sheet_id');
    let range = 'FieldAgents!A1:Z'
    const sheets = google.sheets('v4');
    const results =  (await sheets.spreadsheets.values.get({
      auth: jwtClient,
      spreadsheetId: spreadsheetId,
      range: range
    })).data;
   return Object.assign(
     {}, arguments[0], {sheetId: spreadsheetId, data: results, range:range});
  }

  function buildRow(sheet, doc) {
    const fields = sheet[0]
    return fields.map(field => doc[field] || "")
  }

  function getRowFromRangeString(range) {
    rowNumRegex = /(^\w*\!\w)(\d*):(\w)(\d*)/
    matches = range.match(rowNumRegex)
    if (matches) {
      return parseInt(matches[2])
    } else {
      return null;
    }
  }

  function makeUpdateRange(oldRange, oldValues, id) {
    rowNumRegex = /(^\w*\!\w)(\d*):(\w)(\d*)/
    matches = oldRange.match(rowNumRegex)
    const row = getSheetIndexById(oldRange, oldValues, id);
    if (matches) {
      console.log(`${matches[1]}${row}:${matches[3]}${row}`)
      return `${matches[1]}${row}:${matches[3]}${row}`;
    } else {
      return null;
    }
  }

  function getSheetIndexById(range, values, id) {
    console.log('id', id);
    let arrayIndex = -1
    for (let i = 0; i < values.length; i++) {
      if (values[i][0] === id) {
        console.log('ayay')
        arrayIndex = i;
      }
    }
    if (arrayIndex !== -1) return arrayIndex + getRowFromRangeString(range);
    else return -1;
  }

  async function update({doc, jwtClient, sheetId, data, range}) {
    let index = getSheetIndexById(data.range, data.values, doc['_id'].toString());

    let method = 'update'
    let reqRange = range
    if (index === -1) {
      method = 'append'
    } else {
      reqRange = makeUpdateRange(data.range, data.values, doc['_id'].toString());
    }

    console.log(range);
    const results =  (await google.sheets('v4').spreadsheets.values[method]({
      auth: jwtClient,
      spreadsheetId: sheetId,
      range: reqRange,
      valueInputOption: "USER_ENTERED",
      resource: {
        majorDimension: "ROWS",
        values: [buildRow(data.values, doc)]
      }
    })).data;
    console.log('BUILDT:', buildRow(data.values, doc))
    return Object.assign({}, arguments[0], {updateResult: results});
  }

  function getDocument(changeEvent) {
    return Promise.resolve({doc: changeEvent.fullDocument})
  }

  return (await getDocument(changeEvent)
    .then(auth)
    .then(getSheet)
    .then(x => {console.log(x); return x;})
    .then(update)
    .catch(err => console.log(err)));
};
