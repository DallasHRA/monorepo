const util = require('./util');

function cellToNameAndPhoneNumber(cell) {
  if (cell.toString() === '') return;
  const arr = cell.toString().split(' | ');
  return {
    name: arr[0],
    number: `+1${arr[1].match(/\d*/g).join('')}`
  }
}

function getRunnerSchedule(runner, week) {
  return week.map(day => !!(day.filter(e => {
    e = e || {number: -1};
    return (e.number === runner.number)
  })).length);
}

module.exports = {
  onScheduleEdit: function onScheduleEdit() {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName('Schedule');
    const agentSheet = spreadsheet.getSheetByName('FieldAgents');
    const data = sheet.getDataRange().getValues().splice(1)
    const range = sheet.getRange(2, 1, (data.length <= 0) ? 1 : data.length);
    let runners = [ ...new Set(data.flat().filter(e => (!!e))) ]
      .map(runner => cellToNameAndPhoneNumber(runner))


    const week = [];
    for (let i = 0; i < sheet.getDataRange().getNumColumns(); i++) {
      week.push(range.offset(0, i).getValues().map(runner => cellToNameAndPhoneNumber(runner)));
    }

    const runnersWithSched = runners.map(runner => {
      const textFinder = agentSheet.createTextFinder(
        util.domesticFormatPhoneNumber(runner.number));

      runner['_id'] = textFinder.findNext().offset(0, -2, 1).getValue();

        runner.schedule = getRunnerSchedule(runner, week);
        return runner;
    });

    console.log(runnersWithSched);
    return {
      method: 'POST',
      contentType: 'application/json',
      payload: {
        action: 'UPDATE',
        header: ['name', 'number', 'schedule'],
        data: runnersWithSched
      }
    };
  }
}
