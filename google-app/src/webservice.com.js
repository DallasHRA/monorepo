function makeArrayFromData(keys, runner) {
  return keys.map(key => (runner[key])? runner[key] : "");
}

function findRowByNumber(key, data, runner) {
  const index = key.indexOf('number');
  for (let i = 0; i < data.length; i++) {
    if (row[index] = runner.number) {
      return i;
    }
  }
  return -1;
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

global.addFieldRunners = function(runner) {
  const headerRows = 2
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName("FieldAgentsDev");
  var range = sheet.getDataRange()
  var key = range.getValues()[0];

  var data = range.getValues().splice(2)

  const inputData = makeArrayFromData(key, runner)

  let editRow = -1
  let editAction = "appendRow"

  for (let i = 0; i < data.length; i++) {
    if (data[0] === inputData[0]
          || data[key.indexOf('number') === runner.number]) {
      editRow = i;
      editAction = "update"
      break;
    }
  }

  sheet[editAction](inputData);


  // let runnerRow = findRowByNumber(key, values, runner);
  // if (values.length === 0) {
  //   insertRunner(headerRows + 1, runner);
  // } else if (runnerRow >= 0) {
  //   updateRunner(headerRows + runnerRow + 1, runner);
  // }

  return JSON.stringify(inputData);
}
