function makeDataArray(header, headerRows, data) {
  return data.splice(headerRows)
    .map(arr => arr.reduce((acc, cur, i) => {
      if (i < header.length)
        acc[header[i]] = (header[i] === 'number') ? formatPhoneNumber(cur) : cur;
      return acc;
    }, {}))
}

function formatPhoneNumber(phoneNumber) {
  regex = /\d*/g;
  if (phoneNumber === '') {
    return phoneNumber;
  }
  let formatted = phoneNumber.toString().toLowerCase().match(regex).join('');
  if (formatted.length === 10) {
    formatted = '1' + formatted;
  }
  formatted = '+' + formatted;
  return formatted;
}

function getRelevantRows(e, data, headerRows) {
  const startIndex = e.range.rowStart - headerRows - 1;
  const numberOfRows = e.range.rowEnd - e.range.rowStart + 1;
  return data.splice(startIndex, numberOfRows);
}

async function atEdit(e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("FieldAgents");
  var headerRows = 2;  // Number of rows of header info (to skip)

  var range = sheet.getDataRange(); // determine the range of populated data
  var numRows = range.getNumRows(); // get the number of rows in the range
  var numColumns = range.getNumColumns();
  var header = range.getValues()[0];
  var data = makeDataArray(header, headerRows, range.getValues());
  data = getRelevantRows(e, data, headerRows);
  var index = e.range.getRow() - headerRows - 1;
  var action = "UPDATE";

  var payload = {
      "action": "UPDATE",
      "header": header,
      "data": data
    };

    console.log(payload)

  const url = 'https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/dhra-webservice-usyzs/service/google-sheets-updater/incoming_webhook/update_from_google_sheet'

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  }

  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
  var respArr = JSON.parse(response.getContentText())
  var idColumn = header.indexOf('_id') + 1
  respArr.map((r, i) => {
    sheet.getRange(e.range.rowStart, idColumn).setValue(r['_id']);
  })
}
