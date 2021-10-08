import { createApp, ref } from "vue";
import App from "./App.vue";
import { message, initMessage } from "./common/message";
import "./style.scss";
import { guid, information } from "./common/utils";

const connectState = ref(false);
const enterRoomState = ref(false);
const roomId = ref("");

const { searchParams } = new URL(location.href);
roomId.value = searchParams.get("roomId") || guid();

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

function rotateWindow() {
  let { clientWidth: width, clientHeight: height } = document.body;

  if (width < height) {
    const html = document.querySelector("html");
    html!.style.transform = `rotateZ(90deg) translate(${
      (height - width) / 2
    }px, ${(height - width) / 2}px)`;
    html!.style.fontSize = (height / 736) * 100 + "px";
    html!.style.width = height + "px";
    html!.style.height = width + "px";
  }
}
rotateWindow();
window.addEventListener("resize", rotateWindow);

const app = createApp(App);
app.provide("connectState", connectState);
app.provide("enterRoomState", enterRoomState);
app.provide("roomId", roomId);
app.mount("#app");
