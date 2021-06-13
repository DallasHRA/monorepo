const utils = require('./util');
const {makereq} = require('./make-realm-request'); 
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function splitNameAndNumber(nameNum) {
  const keys = ['name', 'number'];
  return nameNum.split(' | ').reduce((acc, cur, i) => (acc[keys[i]]), {});  
}

function arrangeDataIntoColumns(header, data) {
  return header.map((_, colIndex) => data.map(row => row[colIndex]))
    .map(day => day.filter(e => !!e))
    .map(day => day.map(nameNum => splitNameAndNumber))
    .map(day => day.map(runner => ))
}

function makePayload(header, data) {
  const agentsOnCallThisWeek = [...new Set(data.flat())]
    .map(runner => {
      runner = splitNameAndNumber(runner);
      runner.schedule = Array(7).fill(false);
      return runner;
    }
  const schedule = arrangeDatatIntoColumns(header, data);

  return {
    method: 'POST',
    payload: {data: agentsOnCallThisWeek.map(runner => schedule.map((day, i) => {
      runner.schedule[i] = !!(day.filter(a => (a.number === runner.number)).length);
      return runner;
    }))}
  };
}

function onChange(e) {
  let data = e.source.getSheetByName(e.range.getSheetName()).getDataRange();
  const header = data[0];
  data = data.splice(1);
  makereq('change_schedule', makePayload(header, data); 
}
