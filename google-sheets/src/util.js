function makeDataArray(header, headerRows, data) {
  return data.splice(headerRows)
    .map(arr => arr.reduce((acc, cur, i) => {
      if (i < header.length)
        acc[header[i]] = (header[i] === 'number') ? formatPhoneNumber(twilioFormatStrategy, cur) : cur;
      return acc;
    }, {}))
}

function convertRunnerObjectToValueArray(header, runner) {
  return header.map(key => {
    if (!runner[key]) {
      return "";
    } else if (key == 'number') {
      return formatPhoneNumber(domesticFormatStrategy, runner[key])
    } else {
      return runner[key]
    }
  });
}

function twilioFormatStrategy(digits) {
  digits = digits.toString();
  let formatted = ''
  if (digits.length === 10) {
    formatted = '1' + digits;
  }
  formatted = '+' + formatted;
  return formatted;
}

function formatPhoneNumber(strategy, phoneNumber) {
  digitregex = /\d*/g;
  if (phoneNumber.toString() === '') {
    return phoneNumber;
  }
  let digits = phoneNumber.toString().toLowerCase().match(digitregex).join('');
  if (digits >= 10) {
    return strategy(digits)
  }
  return digits;
}

function domesticFormatStrategy(digits) {
  const regex = /1?(\d{3})(\d{3})(\d{4})/;
  const arr = digits.match(regex).splice(1,3);
  return `(${arr[0]}) ${arr[1]}-${arr[2]}`
}

function getRelevantRows(e, data, headerRows) {
  const startIndex = e.range.rowStart - headerRows - 1;
  const numberOfRows = e.range.rowEnd - e.range.rowStart + 1;
  return data.splice(startIndex, numberOfRows);
}

function getInsertRange(sheet, header, e) {
  let row = e.range.getRow();
  let numRows = e.range.getNumRows();
  let column = 1;
  let numColumns = header.length;
  return sheet.getRange(row, column, numRows, numColumns);
}

function buildValidation(spreadsheet) {
  let range = spreadsheet
    .getSheetByName('AgentStates')
    .getDataRange()
  return SpreadsheetApp
  .newDataValidation()
  .requireValueInRange(range)
  .build();
}

function getColumnOfData(sheet, header, headerRows, column) {
  let range = sheet.getDataRange();
  return range.offset(
    headerRows,
    header.indexOf(column),
    range.getNumRows() - headerRows,
    1
  );
}

function addDataValidation(sheet, header, headerRows, validation) {
  getColumnOfData(sheet, header, headerRows, 'state').setDataValidation(validation);
}

function friendlyFormatNumbers(sheet, header, headerRows) {
  const range = getColumnOfData(sheet, header, headerRows, 'number')
  range.setValues(range.getValues()
    .map(n => formatPhoneNumber(domesticFormatStrategy, n[0])));
}

module.exports = {
  addDataValidation,
  buildValidation,
  getInsertRange,
  getRelevantRows,
  twilioFormatPhoneNumber: formatPhoneNumber.bind(null, twilioFormatStrategy),
  domesticFormatPhoneNumber: formatPhoneNumber.bind(null, domesticFormatStrategy),
  convertRunnerObjectToValueArray,
  makeDataArray,
  friendlyFormatNumbers
}
