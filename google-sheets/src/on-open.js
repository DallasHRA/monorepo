const util = require('./util');

const REALM_API_KEY = process.env.REALM_API_KEY;

global.onOpen = async function (e) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("FieldAgents");
  var headerRows = 2;  // Number of rows of header info (to skip)

  var range = sheet.getDataRange();
  var header = range.getValues()[0];
  var numRangeRows = range.getNumRows - headerRows
  range = range.offset(headerRows, 0);

  var options = {
    Authorization: `Bearer ${REALM_API_KEY}`
  }
try {
  const user = await app.logIn(credentials);
  console.log("Successfully logged in!", user.id);
  return user;
  } catch (err) {
    console.error("Failed to log in", err.message);
  }
}
