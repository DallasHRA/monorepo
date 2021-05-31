exports = async function(arg) {
  const data = arg.data;
  console.log(JSON.stringify(arg));
  const runnerId = data[arg.row - 1][arg.header.indexOf('_id')];
  const key = arg.header[arg.column - 1];
  const value = arg.value;

  let collection = context.services
    .get("mongodb-atlas")
    .db("DHRA_PROXY")
    .collection("fieldAgents");

  let update = { $set: {} }
  update['$set'][key] = value

  const result = (await collection.updateOne({"_id": BSON.ObjectId(runnerId)}, update));


  console.log(JSON.stringify(result))
  return JSON.stringify(result);
}