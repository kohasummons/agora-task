import AgoraRTC from "agora-rtc-sdk-ng";
import { getByID, showLoader, hideLoader } from "./utils.js";

let config = {
  appId: import.meta.env.VITE_APP_ID,
  channel: import.meta.env.VITE_CHANNEL,
  token: import.meta.env.VITE_APP_TOKEN,
  uid: 0,
};

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

// state-ish
let localTracks = []; // you
let remoteUsers = {}; // whoever joins your stream, all' of em

// On button click
let joinAndDisplayLocalStream = async () => {
  client.on("user-published", handleUserJoined);
  client.on("user-unpublished", handleUserLeft);

  let UID = await client.join(config.appId, config.channel, config.token, null);
  localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

  let player = `
      <div class="video-container" id="user-container-${UID}">
          <div class="video-player" id="user-${UID}"></div>
      </div>
  `;

  getByID("video-streams").insertAdjacentHTML("beforeend", player);

  // [0]: audio track
  // [1]: video track
  // .play: creates  a video element and adds' it
  // to Dom elemeten with the ID specified as it's agrumnt
  localTracks[1].play(`user-${UID}`);

  // Publish local vidoo to globl channel
  await client.publish([localTracks[0], localTracks[1]]);
};

let joinStream = async (e) => {
  showLoader();
  await joinAndDisplayLocalStream();
  e.target.style.display = "none";
  getByID("stream-controls").style.display = "flex";
  getByID("stream-wrapper").style.display = "block";
  getByID("hero").style.display = "none";
  setTimeout(hideLoader, 3000);
};

// on user joins stream
let handleUserJoined = async (user, mediaType) => {
  remoteUsers[user.uid] = user;

  // subscribe local client to
  // the new audio & video track
  await client.subscribe(user, mediaType);

  switch (mediaType) {
    case "video":
      let player = getByID(`user.container-${user.uid}`);
      if (player != null) player.remove();

      player = `
              <div class="video-container" id="user-container-${user.uid}">
                  <div class="video-player" id="user-${user.uid}"></div>
              </div>
          `;
      getByID(`video-streams`).insertAdjacentHTML("beforeend", player);
      user.videoTrack.play(`user-${user.uid}`);
    case "audio":
      user.audioTrack.play();
  }
};

let handleUserLeft = (user) => {
  delete remoteUsers[user.uid];
  getByID(`user-container-${user.uid}`).remove();
};

let leaveAndRemoveLocalStream = async () => {
  showLoader();
  localTracks.forEach((track) => {
    track.stop();
    track.close();
  });

  await client.leave();
  getByID("joinBtn").style.display = "block";
  getByID("stream-controls").style.display = "none";
  getByID("video-streams").innerHTML = "";
  getByID("hero").style.display = "flex";
  setTimeout(hideLoader, 3000);
};

let toggleMic = async (e) => {
  if (localTracks[0].muted) {
    await localTracks[0].setMuted(false);
    let mic = e.target.querySelector('[data-icon="raphael:mic"]');
    let micmute = e.target.querySelector('[data-icon="raphael:micmute"]');
    mic?.classList.remove("hidden");
    micmute?.classList.add("hidden");
  } else {
    await localTracks[0].setMuted(true);
    let mic = e.target.querySelector('[data-icon="raphael:mic"]');
    let micmute = e.target.querySelector('[data-icon="raphael:micmute"]');
    micmute?.classList.remove("hidden");
    mic?.classList.add("hidden");
  }
};

let toggleCamera = async (e) => {
  if (localTracks[1].muted) {
    await localTracks[1].setMuted(false);
    let cam = e.target.querySelector('[data-icon="ic:sharp-photo-camera"]');
    let nocam = e.target.querySelector('[data-icon="ic:sharp-no-photography"]');
    cam?.classList.remove("hidden");
    nocam?.classList.add("hidden");
  } else {
    await localTracks[1].setMuted(true);
    let cam = e.target.querySelector('[data-icon="ic:sharp-photo-camera"]');
    let nocam = e.target.querySelector('[data-icon="ic:sharp-no-photography"]');
    nocam?.classList.remove("hidden");
    cam?.classList.add("hidden");
  }
};

getByID("joinBtn").addEventListener("click", joinStream);
getByID("leaveBtn").addEventListener("click", leaveAndRemoveLocalStream);
getByID("micBtn").addEventListener("click", toggleMic);
getByID("cameraBtn").addEventListener("click", toggleCamera);

window.onload = function () {
  setTimeout(hideLoader, 4000);
};
