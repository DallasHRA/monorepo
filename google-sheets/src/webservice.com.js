const utils = require('./util')

function makeArrayFromData(keys, runner) {
  return keys.map(key => {
    if (key === 'number') {
      return utils.domesticFormatPhoneNumber(runner[key]);
    } else if (runner[key]) {
      return runner[key];
    }
    return "";
  });
}

function getColumnStartAndEnd(range) {
  const regex = /^([A-Za-z]+)\d+:([A-Za-z]+)\d+$/
  const matches = range.getA1Notation().match(regex);
  return {start: matches[1], end: matches[2]};
}

function getById() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var data = spreadsheet.getSheetByName("FieldAgentsDev").getDataRange().createDeveloperMetadataFinder().onIntersectingLocations().withKey("mongoid").withValue("60a0c11a28e69a79579b0dd4").find()
    data.map(r => {
      let row = r.getLocation().getRow();
      // let obj = loc.getLocationType() === SpreadsheetApp.DeveloperMetadataLocationType.COLUMN ?
      //     {range: loc.getColumn().getA1Notation()} :
      //     loc.getLocationType() === SpreadsheetApp.DeveloperMetadataLocationType.ROW ?
      //         {range: loc.getRow().getA1Notation()} : {};
    // obj[e.getKey()] = e.getValue();
    console.log(row)
    return row;
  });

  console.log(JSON.stringify(data));
}

function getMatchingRowById(rows, runnerId) {
  return rows.reduce((acc, cur, i) => {
    if (cur[0] === runnerId) return i;
    else return acc;
  }, -1)
}

global.addFieldRunners = function(runners) {
  // if (!Array.isArray(runners)) {
  //   runners = Array.from(runners);
  // }
  Logger.log(runners);
  const headerRows = 2
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("FieldAgents");
  var range = sheet.getDataRange()
  var key = range.getValues()[0];

  var data = range.getValues().splice(2)

  Logger.log(JSON.stringify(runners));

  const inputData = runners
    .map(runner => makeArrayFromData(key, runner))
    .map(runner => {

      let editAction = "update"
      const row = getMatchingRowById(data, runner[0]) + headerRows + 1;
      if (row < headerRows + 1) {
        sheet.appendRow(runner);
      } else {
        Logger.log(runner)
        sheet.getRange(row, 1, 1, key.length).setValues([runner]);
      }
      return runner;
    });

  Logger.log(JSON.stringify(inputData));

  // let editRow = -1
  // let editAction = "appendRow"
  //
  // for (let i = 0; i < data.length; i++) {
  //   if (data[i][0] === inputData[i][0]
  //         || data[key.indexOf('_id') === runner['_id']]) {
  //     editRow = i;
  //     editAction = "update"
  //     break;
  //   }
  // }
  //
  // sheet[editAction](inputData);


  // let runnerRow = findRowByNumber(key, values, runner);
  // if (values.length === 0) {
  //   insertRunner(headerRows + 1, runner);
  // } else if (runnerRow >= 0) {
  //   updateRunner(headerRows + runnerRow + 1, runner);
  // }

  return JSON.stringify(inputData);
}
