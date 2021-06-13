exports = async function(arg) {
  const data = arg.data;
  console.log(arg);
  
  let collection = context.services
    .get("mongodb-atlas")
    .db("DHRA_PROXY")
    .collection("fieldAgents");
  
  async function updateRunner(runner) {
    const query = {'_id': BSON.ObjectId(runner['_id'])};
    const update = Object.assign({}, runner);
    delete update['_id'];
    const result = (await collection.updateOne(query, {$set: update}));
    return runner;
  }
  
  async function insertRunner(runner) {
    const insert = Object.assign({}, runner, {state: "OFF_DUTY", active: true, lastSession: 0, default: false});
    delete insert['_id'];
    const result = (await collection.insertOne(insert));
    insert['_id'] = result.insertedId.toString();
    return insert;
  }
  
  async function getAllRunners() {
    const query = {};
    return collection.find(query).toArray();
  }
  
  const getResult = async () => {
    if (arg.getAllRunners === true) {
      return getAllRunners();
    }
    
    return Promise.all(data.map(async (runner) => {
        if (runner['_id'] !== '') {
          console.log('insertRunner')
          return updateRunner(runner); 
        } else if (runner['_id'] === '' && runner['number'] !== '') {
          console.log('updateRunner')
          return insertRunner(runner);
        }
      })
    );
  }
  
  // const result = data.map(async (runner) => {
  //   if (runner['_id'] !== '') {
  //     return await updateRunner(runner); 
  //   } else if (runner['_id'] === '' && runner['number'] !== '') {
  //     return await insertRunner(runner);
  //   }
  // });
  
  // const runner = data[arg.index]
  // const runnerId = runner._id;
  // const key = arg.key;
  // const value = arg.value;

  // let collection = context.services
  //   .get("mongodb-atlas")
  //   .db("DHRA_PROXY")
  //   .collection("fieldAgents");

  // let update = { $set: {} }
  // update['$set'][key] = value

  // let result;
  // if (runner._id !== "") {
  //   result =
  //     (await collection.updateOne({"_id": BSON.ObjectId(runnerId)}, update));
  // } else if (runner.number.length > 0) {
  //   console.log(JSON.stringify(runner));
  //   delete runner._id;
  //   result = (await collection.insertOne(runner))
  
  return getResult().then(result => {
    console.log('Result:', JSON.stringify(result));
    return JSON.stringify(result)
  });
}