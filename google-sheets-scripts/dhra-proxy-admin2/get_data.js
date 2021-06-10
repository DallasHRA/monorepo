function getData() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("FieldAgentsDev");
  var range = sheet.getDataRange();
  var data = range.getValues();
  return data;
}

function getHeader() {

}
