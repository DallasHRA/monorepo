exports = async function(changeEvent) {
  const fetch = require('node-fetch');
  
  function isStateUpdate(changeEvent) {
    return (changeEvent.fullDocument.state !== changeEvent.fullDocumentBeforeChange.state);
  }
  
  if (isStateUpdate(changeEvent)) {
    let reason = 'STATE_CHANGE';
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "state": changeEvent.fullDocument.state,
        "to": changeEvent.fullDocument.number,
        "reason": reason
      })
    };
    
    const baseuri = context.environment.values['twilio_base_api'];
    const uri = `${baseuri}/notify-runner`;
    console.log("URI:", uri);
    const response = await fetch(uri, options);
    console.log('RESPONSE:', response);
    return JSON.stringify(response.json());
  }
}