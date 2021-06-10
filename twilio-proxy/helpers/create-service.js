exports = (client, uniqueName, friendlyName) => {
  return client.serverless.services
    .create({
        includeCredentials: true,
        uniqueName: uniqueName,
        friendlyName: friendlyName
      })
     .then(service => console.log(service.sid));
}
