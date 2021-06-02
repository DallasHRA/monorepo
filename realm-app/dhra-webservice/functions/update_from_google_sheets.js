exports = async function(arg) {
  const data = arg.data;
  console.log(JSON.stringify(arg));
  const runner = data[arg.index]
  const runnerId = runner._id;
  const key = arg.key;
  const value = arg.value;

  let collection = context.services
    .get("mongodb-atlas")
    .db("DHRA_PROXY")
    .collection("fieldAgents");

  let update = { $set: {} }
  update['$set'][key] = value

  let result;
  if (runner._id !== "") {
    result =
      (await collection.updateOne({"_id": BSON.ObjectId(runnerId)}, update));
  } else if (runner.number !== "") {
    delete runner._id;
    result = (await collection.insertOne(runner))
  }



  console.log(JSON.stringify(result))
  return JSON.stringify(result);
}
