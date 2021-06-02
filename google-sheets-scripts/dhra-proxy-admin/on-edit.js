function makeDataArray(header, headerRows, data) {
  return data.splice(headerRows)
    .map(arr => arr.reduce((acc, cur, i) => {
      if (i < header.length)
        acc[header[i]] = cur;
      return acc;
    }, {}))
}

async function onEdit(e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("FieldAgents");
  var headerRows = 2;  // Number of rows of header info (to skip)

  var range = sheet.getDataRange(); // determine the range of populated data
  var numRows = range.getNumRows(); // get the number of rows in the range
  var numColumns = range.getNumColumns();
  var header = range.getValues()[0];
  var data = makeDataArray(header, headerRows, range.getValues());
  var index = e.range.getRow() - headerRows - 1
  var action = "UPDATE";

  if (data[index]['_id'] === "") {
    action = "INSERT";
  }

  var payload = {
      "action": "UPDATE",
      "range": e.range,
      "header": header,
      "index": index,
      "key": header[e.range.getColumn() - 1],
      "value": e.value,
      "data": data
    };

    console.log(payload)

  const url = 'https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/dhra-webservice-usyzs/service/google-sheets-updater/incoming_webhook/update_from_google_sheet'

  const options = {
    method: 'POST',
    contentType: 'application/json',
    muteHttpExceptions: true,
    payload: JSON.stringify(payload)
  }

  let resp = await UrlFetchApp.fetch(url, options);
  console.log(JSON.stringify(resp));

  if (action === "INSERT") {
    sheet.getRange(`A${e.range.getRow()}`).setValue(resp.insertedId)
  }
}
