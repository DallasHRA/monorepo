var npm = require('npm');
const path = require('path');
const prefix = path.join(__dirname, '../', 'dhra-webservice/functions/node_modules');
npm.load(function(err) {
  // handle errors

  // install module ffi
  npm.commands.install([`--prefix=${prefix}`, 'ffi'], function(er, data) {
    // log errors or data
  });

  npm.on('log', function(message) {
    // log installation progress
    console.log(message);
  });
});
