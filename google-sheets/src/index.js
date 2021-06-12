require('./at-edit');
require('./edit-field-agents');
require('./on-open');
global.doGet = function(e) {
  Logger.log(JSON.stringify(e));
  return ContentService.createTextOutput('Hello, world!');
}
