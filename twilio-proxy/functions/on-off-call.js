const axios = require('axios');

const REALM_API_KEY = process.env.REALM_API_KEY;
const API_BASE_URL = process.env.REALM_BASE_URL;

exports.handler = async function (context, event, callback) {
  const twiml = new Twilio.twiml.MessagingResponse();

  console.log(event.Body, event.From)
  const resp = await axios
    .post(`${API_BASE_URL}service/pick-runner/incoming_webhook/on-off-call`,
      { "api-key": REALM_API_KEY, onCall: event.Body, number: event.From })
    .then(resp => {console.log(resp); return resp.data.msg;})
    // .then(msg => {
    //   twiml.message(msg)
    //   callback(null, twiml);
    // })
    .catch(err => {
      console.error(err)
      calback(err)
    })
};
