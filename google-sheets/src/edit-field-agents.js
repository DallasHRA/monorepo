const utils = require('./util');

const REALM_API_KEY = process.env.REALM_API_KEY;

function makeArrayFromData(keys, runner) {
  return keys.map(key => {
    if (key === 'number') {
      return utils.domesticFormatPhoneNumber(runner[key]);
    } else if (runner[key]) {
      return runner[key];
    }
    return '';
  });
}

function getColumnStartAndEnd(range) {
  const regex = /^([A-Za-z]+)\d+:([A-Za-z]+)\d+$/;
  const matches = range.getA1Notation().match(regex);
  return {start: matches[1], end: matches[2]};
}

function getMatchingRowById(rows, runnerId) {
  return rows.reduce((acc, cur, i) => {
    if (cur[0] === runnerId) return i;
    else return acc;
  }, -1);
}

function getRowByPhoneNumber(sheet, keys, phoneNumber) {
  return sheet.getDataRange().getValues()
    .map(row => row[keys.indexOf('number')])
    .map(number => utils.twilioFormatPhoneNumber(number))
    .indexOf(phoneNumber) + 1;
}

function getRowById(sheet, keys, id) {
  console.log(keys.indexOf('_id'));
  const data = sheet.getDataRange().getValues();
  console.log('data', data);
  const row = data.map(row => row[(keys.indexOf('_id'))]);
  console.log('row', row);
  const rowNum = row.indexOf(id);
  return rowNum + 1;
}

function onDelete(sheet, keys, id) {
  sheet.deleteRow(getRowById(sheet, keys, id));
}

function onReplace(sheet, keys, id, runner) {
  console.log('REPLACE:', id, runner);
  onUpdate(sheet, keys, id, runner);
  return;
}

function onUpdate(sheet, keys, id, runner) {
  const values = makeArrayFromData(keys, runner);
  const rowNum = getRowById(sheet, keys, id);
  console.log('NEW STUFF:', rowNum, values.length, JSON.stringify(values), JSON.stringify(keys));
  sheet.getRange(rowNum, 1, 1, keys.length).setValues([values]);
}

function onInsert(sheet, keys, id, runner) {
  const values = makeArrayFromData(keys, runner);
  const rowNum = getRowByPhoneNumber(sheet, keys, runner.number);
  if (rowNum <= 0) {
    sheet.appendRow(values);
  } else {
    sheet.getRange(rowNum, 1, 1, keys.length).setValues([values]);
  }
  console.log('INSERT:', id, runner);
  return;
}

const OPERATIONS = {
  'delete': onDelete,
  'update': onUpdate,
  'replace': onReplace,
  'insert': onInsert
};

global.addFieldRunners = function(operation, id, runners) {
  Logger.log(arguments);
  Logger.log(id);
  const headerRows = 2;
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('FieldAgents');
  var range = sheet.getDataRange();
  var keys = range.getValues()[0];
  
  OPERATIONS[operation.toLowerCase()](sheet, keys, id, runners);
  return;
  if (operation.toLowerCase() === 'delete') {
    onDelete(sheet, key, id);
    return;
  } else if (operation.toLowerCase() === 'update') {
    onUpdate(sheet, key, id, runners);
    return;
  }
  var data = range.getValues().splice(2);

  Logger.log(JSON.stringify(runners));

  const inputData = runners
    .map(runner => makeArrayFromData(key, runner))
    .map(runner => {
      let editAction = 'update';
      const row = getMatchingRowById(data, runner[0]) + headerRows + 1;
      if (row < headerRows + 1) {
        sheet.appendRow(runner);
      } else {
        Logger.log(runner);
        sheet.getRange(row, 1, 1, key.length).setValues([runner]);
      }
      return runner;
    });

  Logger.log(JSON.stringify({ inputData }));

  return JSON.stringify({'api-key': REALM_API_KEY, inputData});
}
