const util = require('./util');

global.onOpen = function (e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("FieldAgents");
  var headerRows = 2;  // Number of rows of header info (to skip)

  var range = sheet.getDataRange();
  var header = range.getValues()[0];
  var numRangeRows = range.getNumRows - headerRows
  range = range.offset(headerRows, 0);

  var url = 'https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/dhra-webservice-usyzs/service/google-sheets-updater/incoming_webhook/get_all_runners';
  var response = UrlFetchApp.fetch(url);
  var respArr = JSON.parse(response.getContentText())

  range.clearFormat();
  range.clearContent();
  range.clearDataValidations();

  sheet.getRange(headerRows + 1, 1, respArr.length, header.length).setValues(
    respArr.map((runner => util.convertRunnerObjectToValueArray(header, runner)))
  );

  util.addDataValidation(
    sheet,
    header,
    headerRows,
    util.buildValidation(spreadsheet)
  );
}
