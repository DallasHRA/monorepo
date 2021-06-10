// This function is the webhook's request handler.
exports = async function(payload, response) {
  const data = EJSON.parse(payload.body.text());
  const getResults = async () => {
    return (await context.functions.execute("update_from_google_sheets", data));
  }
  // const results = (await context.functions.execute("update_from_google_sheets", data));
  return getResults().then(results => {
      response.setHeader("Content-Type", "application/json");
      response.setStatusCode(200);
      response.setBody(results);
      return results;
    }).then(results => console.log(results));
};
