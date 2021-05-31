exports = async function(payload, response) {
  const body = EJSON.parse(payload.body.text());
  const newState = body.onCall.toLowerCase().split(' ')

  const parseTime = (time) => {
    return Date.now() + time * 3600
  }

  const getUpdate = (newState) => {
    const queries = {
      "on": {$set: {state: "ON_CALL"}},
      "break": {
        $set: {
          state: "ON_BREAK",
          nextStateChangeTime: parseTime(newState[1]),
          nextState: "ON_CALL"
        }
      },
      "off": {$set: {state: "OFF_DUTY"}},
    }
    return queries[newState[0]];
  }

  const getMessage = (state) => {
    const messages = {
      ON_CALL: 'You are now on call',
      OFF_DUTY: 'You are now off call',
      ON_BREAK: `You are off call for ${newState[1]}hr`,
      invalid: 'Invalid. You may type: "On", "Off", or "Break <time in hours e.g. 1.25>"',
    }
    return {msg: messages[state]};
  }

  const isImproperBreakArgs = (newState) => {
    return (newState[0] === 'break' && newState.length < 2)
  }

  const isCommandInvalid = (newState) => {
    acceptedCommands = ['on', 'break', 'off']
    if (acceptedCommands.indexOf(newState[0]) === -1) {
      return true;
    } else {
      return false;
    }
  }

  if (isCommandInvalid(newState) || isImproperBreakArgs(newState)) {
    return getMessage("invalid");
  }


  //const contentTypes = payload.headers["Content-Type"];
  const update = getUpdate(newState);
  
  console.log(JSON.stringify(getMessage("ON_BREAK")))

    await context.services.get("mongodb-atlas")
      .db("DHRA_PROXY")
      .collection("fieldAgents")
      .findOneAndUpdate(
        { number: body.number }, update, { returnNewDocument: true })
      .then(doc => doc.state)
      .then(getMessage)
      .then(msg => {
        console.log(msg.msg)
        response.setHeader("Content-Type", "application/json");
        response.setStatusCode(200);
        response.setBody(JSON.stringify(msg));
        console.log(JSON.stringify(response))
        // return JSON.stringify(msg);
      })
      .catch(err => err);


    // Calling a function:
    // const result = context.functions.execute("function_name", arg1, arg2);

    // The return value of the function is sent as the response back to the client
    // when the "Respond with Result" setting is set.
    // return response;
};
