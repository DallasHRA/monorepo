exports.handler = async function (context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  let UserInput = event.Digits

  const optionActions = {
    '1': '+12147794932',
    '2': '+12147696862',
    '3': '+12816736042',
    '4': '+12144702225'
  };

  // if (!UserInput || parseInt(UserInput) > 4) {
  //   twiml.say('Sorry something went wrong. Please call again');
  //   return callback(null, twiml);
  // }
  twiml.dial(optionActions[event.Digits]);
  return callback(null, twiml);
};
