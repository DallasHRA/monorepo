const { onScheduleEdit } = require('../src/on-schedule-edit');

const testData = [
  [ 'Maddy Freeman | (214) 769-3832 | 60c5e9a63cb7be3a6025df73',
    'Abby Brown | (214) 779-4932 | 60c5e9a63cb7be3a6025df71',
    '',
    '',
    '',
    'Abby Brown | (214) 779-4932 | 60c5e9a63cb7be3a6025df71',
    'David | (214) 864-2807 | 60c5e9a63cb7be3a6025df78' ],
  [ '', '', 'Nick Moreno | (972) 655-4624 | 60c5e9a63cb7be3a6025df75', '', '', '', '' ],
  [ '', '', '', '', 'Nick Moreno | (972) 655-4624 | 60c5e9a63cb7be3a6025df75', '', '' ],
  [ '', '', '', '', '', '', '' ],
  [ '', '', '', '', '', '', '' ],
  [ '', '', '', '', '', '', '' ],
  [ '', '', '', 'Hampton Mills | (214) 707-9194 | 60c5e9a63cb7be3a6025df7a', '', '', '' ] ];

test('make a row per agent', () => {
  expect(onScheduleEdit(testData).length).toBe(5);
});

test('make each row and object with name, phone, and schedule', () => {
  expect(onScheduleEdit(testData).map(e => {
    e.name.toBeDefined;
    e._id.toBeDefined;
    e.number.toBeDefined;
    e.schedule.toBeDefined;
  }));
});

test('make sure phone number is in twilio format', () => {
  const regex = /\+1\d{10}/;
  onScheduleEdit(testData).map(e => expect(e.number).toMatch(regex))
});
