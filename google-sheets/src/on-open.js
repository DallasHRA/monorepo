const util = require('./util');
const { makereq } = require('./make-realm-request');

const REALM_API_KEY = process.env.REALM_API_KEY;

global.onOpen = async function (e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("FieldAgents");
  var headerRows = 2;  // Number of rows of header info (to skip)

  var range = sheet.getDataRange();
  var header = range.getValues()[0];
  var numRangeRows = range.getNumRows - headerRows
  range = range.offset(headerRows, 0);

  const resp = await makereq('get_all_runners');
  range.clear();
  resp.map(runner => util.convertRunnerObjectToValueArray(header, runner))
    .map(runner => sheet.appendRow(runner))
}
