const util = require('./util');
require('./webservice.com.js');

global.atEdit = function (e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("FieldAgents");
  var headerRows = 2;  // Number of rows of header info (to skip)

  var range = sheet.getDataRange(); // determine the range of populated data
  var numRows = range.getNumRows(); // get the number of rows in the range
  var numColumns = range.getNumColumns();
  var header = range.getValues()[0];
  var data = util.makeDataArray(header, headerRows, range.getValues());
  data = util.getRelevantRows(e, data, headerRows);
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
  const insertRange = util.getInsertRange(sheet, header, e)
    .setValues(
      respArr.map((runner => util.convertRunnerObjectToValueArray(header, runner)))
  );
  util.addDataValidation(
    sheet,
    header,
    headerRows,
    util.buildValidation(spreadsheet)
  );
}
