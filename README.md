# woop-agora

:zap: ~ Agora Ambassadorship Program Task.

[Woop](https://woop-agora.vercel.app) is chill zone where you can chat with random woopers in the world. 

A tiny PoC built using Agora Video SDK. Go wooooping!

## Stack

Tools & services used:

- Vite
- Agora Video SDK
- Iconify
- Railway(WIP)

### Todo

- Token server
- Fix Loading animation when leave stream is pressed
- Random User Logic

### Development

To setup woop on your local machine:

1. Fork and clone the repo to a directory on your machine.
1. Navigate to the `woop-agora` directory

   ```bash
   cd woop-agora
   ```

1. Run `yarn` to install dependencies
1. Run `yarn dev` to open the development server

### Notes

🥇 Agora provides tools to add voice, video and chat streaming in your applications. Wherever you build your apps.

👍 Every Month, Agora gives 10, 000 free minutes of streaming to build and test your applications. Ouuuu!

☁️ Temp Tokens will expire every 24 hours. To use in production, you can use a token server to generate tokens dynamically.

🍮 The Agora Client Interface provides the basic functionalities for voice, video call such as joining a track, publishing a track, subscribing to other track.

⛏️ The mode property can be set to `live` or `rtc`. It specifies the algorithm optimization that you wish to use.

🗑️ The codec property: the codec that the property should use.

👾 The `client.join()` method takes in your apps credentials and returns a UID. It adds the local User to the channel. You can set the last arguments to `null` so it auto generates a UID for you.

🦸 `AgoraRTC.createMicrophonAndCamerTracks()`: This method prompts the user to allow agora/the website access the camera and Microphone.

🎷 When `client.join(...)` is called, it triggers an event `client.on(user-published callback_func)`. This is how we handle users joining our stream/channel remotely. The callback receives two arguments, `user` & `mediaType`.

## Error

```text
Uncaught (in promise) AgoraRTCException: AgoraRTCError INVALID_OPERATION: Can't publish stream, haven't joined yet!
```

Fix:

```diff
- let UID = client.join(APP_ID, CHANNEL_NAME, APP_TOKEN, null);
+ let UID = await client.join(APP_ID, CHANNEL_NAME, APP_TOKEN, null);
```
