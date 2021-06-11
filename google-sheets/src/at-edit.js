const util = require('./util');
require('./webservice.com.js');
const onScheduleEdit = require('./on-schedule-edit').onScheduleEdit;

function onFieldAgentsEdit(e, spreadsheet, sheet) {
  var headerRows = 2;  // Number of rows of header info (to skip)

  if (e.range.getRow() - headerRows - 1 < 0) {
    return;
  }

  var range = sheet.getDataRange(); // determine the range of populated data
  var numRows = range.getNumRows(); // get the number of rows in the range
  var numColumns = range.getNumColumns();
  var header = range.getValues()[0];
  var data = util.makeDataArray(header, headerRows, range.getValues());
  data = util.getRelevantRows(e, data, headerRows);


  var action = "UPDATE";

  var payload = {
      "action": action,
      "header": header,
      "data": data
    };

  Logger.log(payload)

  if (payload['_id'] === '' && payload.number === '') {
    return { message: "no number, no id. nothing to upload." }
  }

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

function makeReq(payload) {
  const url = 'https://us-east-1.aws.webhooks.mongodb-realm.com/api/client/v2.0/app/dhra-webservice-usyzs/service/google-sheets-updater/incoming_webhook/update_from_google_sheet'

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  }

  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
  return response;
}

global.atEdit = function (e) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  let payload;
  if (sheet.getName() === 'FieldAgents') {
    payload = onFieldAgentsEdit(e, spreadsheet, sheet);
  } else if (sheet.getName() === 'Schedule') {
    payload = onScheduleEdit(spreadsheet, sheet);
  }

  const response = makeReq(payload)
  var respArr = JSON.parse(response.getContentText());

  if (sheet.getName() === 'FieldAgents') {
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
}
