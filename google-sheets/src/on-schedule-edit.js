const util = require('./util');


function getListOfUniqueRunners(data) {
  return [ ...new Set([].concat.apply([], data)) ];
}

function isRunnerScheduledOnDay (runner, day, data) {
  return data.reduce((acc, week) => {
    console.log('DAY:', week[day]);
    if (week[day] === runner) {
      return true;
    } else {
      return acc;
    }
  }, false);
}

function getRunnersSchedule(runner, data) {
  console.log(runner)
  let schedule = [ false, false, false, false, false, false, false ];
  for (let i = 0; i < schedule.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (data[j][i] === runner) schedule[i] = true;
    }
  }
  // return schedule.map((day, i) => isRunnerScheduledOnDay(runner, i, data));
  return schedule
}


function makeObject(runner, i, data) {
  if (runner) {
    const schedule = getRunnersSchedule(runner, data)
    const runArr = runner.split(' | ');
    return Object.assign({},
      { _id: runArr[2], name: runArr[0], number: util.twilioFormatPhoneNumber(runArr[1]) },
      { schedule });
  }
}

module.exports = {
  onScheduleEdit: function(data) {
    const runners =  getListOfUniqueRunners(data)
      .map((r, i) => makeObject(r, i, data))
      .filter(r => (r !== undefined));
    console.log(runners);
    return runners;
  }
}
