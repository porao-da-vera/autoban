window.addEventListener("onWidgetLoad", function (obj) {
  const fieldData = obj.detail.fieldData;
  const channel = obj.detail.channel.username;
  console.log("init", obj);
  const options = {
    options: {
      debug: true,
    },
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      username: channel,
      password: fieldData.token,
    },
    channels: [channel],
  };
  let client = new tmi.client(options);

  client.connect(options).then(() => {
    window.addEventListener("onEventReceived", function (wobj) {
      if (wobj.detail.listener === "follower-latest") {
        const username = wobj.detail.event.name;
        const blackList = fieldData.terms
          .split(",")
          .map((string) => string.trim());
        if (blackList.find((term) => username.includes(term))) {
          client.ban(channel, username, "bot safado");
        }
      }
    });
  });
});
