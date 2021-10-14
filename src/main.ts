import { createApp, ref } from "vue";
import App from "./App.vue";
import { message, initMessage } from "./common/message";
import "./style.scss";
import { guid, information } from "./common/utils";

const connectState = ref(false);
const enterRoomState = ref(false);
const roomId = ref("");
const remBase = ref(0);

const url = new URL(location.href);
const urlRoomId = url.searchParams.get("roomId");
const storageRoomId = localStorage.getItem("roomId");
if (urlRoomId) {
  roomId.value = urlRoomId;
} else {
  if (storageRoomId) {
    roomId.value = storageRoomId;
  } else {
    roomId.value = guid();
    localStorage.setItem("roomId", roomId.value);
  }
  url.searchParams.set("roomId", roomId.value);
  history.replaceState(null, "", url);
}

function enterRoom() {
  message.emit("enterRoom", roomId.value);
  message.on("enterRoom", (state: boolean) => {
    enterRoomState.value = state;
    if (!state) {
      information("房间已满，已创建新的房间，如需双人对战，需要重新邀请");
      roomId.value = guid();
      enterRoom();
    }
  });
}
initMessage(
  () => {
    connectState.value = true;
    enterRoom();
  },
  () => {
    connectState.value = false;
    enterRoomState.value = false;
  }
);

const html = document.querySelector("html") as HTMLElement;
const appx = document.querySelector("#app") as HTMLElement;
function rotateWindow() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  if (width === height) {
    width = html.offsetWidth;
    height = html.offsetHeight;
  }
  if (width < height) {
    const offset = (height - width) / 2;
    remBase.value = (height / 736) * 100;
    html!.style.fontSize = remBase.value + "px";
    appx.style.transform = `rotateZ(90deg) translate(${offset}px, ${offset}px)`;
    appx.style.width = height + "px";
    appx.style.height = width + "px";
  } else {
    remBase.value = (width / 736) * 100;
    html!.style.fontSize = remBase.value + "px";
    appx.style.transform = "none";
    appx.style.width = width + "px";
    appx.style.height = height + "px";
  }
}
rotateWindow();
window.addEventListener("resize", () => {
  rotateWindow();
});

const app = createApp(App);
app.provide("connectState", connectState);
app.provide("enterRoomState", enterRoomState);
app.provide("roomId", roomId);
app.provide("remBase", remBase);
app.mount("#app");
