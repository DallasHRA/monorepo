exports.handler = async function (context, event, callback) {
  //
  //
  // const twiml = new Twilio.twiml.VoiceResponse();
  //
  // twiml.gather({
  //   action: 'https://13df91323f64.ngrok.io/ivr/menu',
  //   numDigits: '1',
  //   method: 'POST',
  // }).play({
  //   loop: 3,
  // }, "https://13df91323f64.ngrok.io/ivr-welcome.wav")
  //
  // return callback(null, twiml);
  const twiml = new Twilio.twiml.VoiceResponse();
    const gather = twiml.gather({
      numDigits: 1,
      action: 'https://dhra-twilio-proxy-1741-dev.twil.io/ivr/menu',
      hints: 'harm reduction',
      input: 'dtmf',
    });
    gather.play('https://dhra-twilio-proxy-1741-dev.twil.io/ivr-welcome-1623469593.wav');
    twiml.redirect();
    callback(null, twiml);
}
