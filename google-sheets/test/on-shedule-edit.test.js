const { getScheduleData } = require('../src/on-schedule-change');

const testData = [ 
  [ 'Maddy Freeman | (214) 769-3832',
    'Abby Brown | (214) 779-4932',
    '',
    '',
    '',
    'Abby Brown | (214) 779-4932',
    'David | (214) 864-2807' ],
  [ '', '', 'Nick Moreno | (972) 655-4624', '', '', '', '' ],
  [ '', '', '', '', 'Candice Starns  | (214) 718-3482', '', '' ],
  [ '', '', '', '', '', '', '' ],
  [ '', '', '', '', '', '', '' ],
  [ '', '', '', '', '', '', '' ],
  [ '', '', '', 'Hampton Mills | (214) 707-9194', '', '', '' ] ];

test('make a row per agent', () => {
  expect(getScheduleData(testData).length).toBe(6);
});

test('make each row and object with name, phone, and schedule', () => {
  expect(getScheduleData(testData).map(e => {
    e.name.toBeDefined;
    e.number.toBeDefined;
    e.schedule.toBeDefined;
  })); 
});

test('make sure phone number is in twilio format', () => {
  const regex = /\+1\d{10}/;
  getScheduleData(testData).map(e => expect(e.number).toMatch(regex))
});
