exports = async function(arg) {
  var moment = require('moment');
  var collection = context.services
                  .get("mongodb-atlas")
                  .db("DHRA_PROXY")
                  .collection("applicationSettings");

  const applicationSettings = await collection.findOne({});

  var agentCollection = context.services
                  .get("mongodb-atlas")
                  .db("DHRA_PROXY")
                  .collection("fieldAgents");

  let allRunners = await agentCollection.find({}).toArray();

  const format = 'hh:mm';
  const now = moment();
  const openTime = moment(applicationSettings.openTime, format);
  const closeTime = moment(applicationSettings.closeTime, format);
  
  console.log(now.day());
  console.log(openTime.valueOf());

  if (now.isBetween(openTime, closeTime)) {
    allRunners = allRunners.map(runner => {
      if (runner.schedule[now.day()] && runner.state === 'OFF_DUTY') {
        runner.state = "ON_CALL";
      }

      if (now.valueOf() - runner.breakEndTime > 0 && runner.state === "ON_BREAK") {
        runner.state = "ON_CALL";
      }
      
      return runner;
    })
  } else {
    allRunners = allRunners.map(runner => runner.state = 'OFF_DUTY');
  }
  
  console.log(JSON.stringify(allRunners));

  results = await agentCollection.updateMany({}, {$set: { allRunners }});
}
