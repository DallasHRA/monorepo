const util = require('./util');
const {makereq} = require('./make-realm-request');
const onScheduleEdit = require('./on-schedule-edit').onScheduleEdit;

require('./edit-field-agents');

function onFieldAgentsEdit(e, spreadsheet, sheet) {
  const  headerRows = 2;  // Number of rows of header info (to skip)

  if (e.range.getRow() - headerRows - 1 < 0) {
    return;
  }

  var range = sheet.getDataRange(); // determine the range of populated data
  var header = range.getValues()[0];
  var data = util.makeDataArray(header, headerRows, range.getValues());
  data = util.getRelevantRows(e, data, headerRows);


  var action = 'UPDATE';

  var payload = {
    'action': action,
    'header': header,
    'data': data
  };

  Logger.log(payload)

  if (payload.data['_id'] === '' && payload.data.number === '') {
    return undefined;
  }

  return {
    method: 'POST',
    contentType: 'application/json',
    payload: payload
  };

}

global.atEdit = async function (e) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  let payload;
  if (sheet.getName() === 'FieldAgents') {
    payload = onFieldAgentsEdit(e, spreadsheet, sheet);
  } else if (sheet.getName() === 'Schedule') {
    payload = onScheduleEdit(spreadsheet, sheet);
  }

  let header = sheet.getDataRange().getValues()[0];

  const response = await makereq('update_from_google_sheet', payload);
  console.log('RESPONSE:', response);

  if (sheet.getName() === 'FieldAgents') {
    util.getInsertRange(sheet, header, e)
      .setValues(
        response.map((runner => util.convertRunnerObjectToValueArray(header, runner)))
      );
    util.addDataValidation(
      sheet,
      sheet.getDataRange().getValues()[0],
      2,
      util.buildValidation(spreadsheet)
    );
  }
};
