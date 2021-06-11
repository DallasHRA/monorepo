// function makeStateChangeMessage(event) {
  // const MESSAGE = {
  //   ON_CALL: 'you are now on call.',
  //   OFF_DUTY: 'you are now off duty.'
  //   ON_BREAK: 'you are taking a break.'
  // };
//   return {
//     from: '+14693824849',
//     to: event.to,
//     body: "message[event.state]"
//   };
// }

exports.handler = async function (context, event, callback) {
  console.log('EVENT:', event);
  const twilioClient = context.getTwilioClient();

  let msg = '';
  switch (event.state) {
    case 'ON_CALL':
      msg = "You are now on call.";
      break;
    case 'OFF_DUTY':
      msg = "You are now off duty."
      break;
    case 'ON_BREAK':
      msg = "You are on a break."
      break;
    default:
      msg = "You are probably recieving this message in error."
  }

  await twilioClient.messages
    .create({
      to: event.to,
      from: '+14693824849',
      body: msg
    })
    .then((message) => {
      console.log('Notified runner using callback');
      console.log(message.sid);
      return callback(null, JSON.stringify({success: true, messageSid: message.sid}));
    })
    .catch((error) => {
      console.error(error);
      return callback(error);
    });
}
