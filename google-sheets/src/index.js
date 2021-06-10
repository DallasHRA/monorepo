require('./at-edit');
require('./webservice.com');
require('./on-open');
global.doGet = function(e) {
  Logger.log(JSON.stringify(e));
  return ContentService.createTextOutput('Hello, world!');
}
