import { createApp, ref } from "vue";
import App from "./App.vue";
import { message, initMessage } from "./common/message";

const roomId = 123;
const connectState = ref(false);
const enterRoomState = ref(false);
const rivalEnterRoomState = ref(false);
initMessage(
  () => {
    connectState.value = true;
    message.emit("enterRoom", roomId);
    message.on("enterRoom", (state: number) => {
      // 0进入房间失败，需要进入新的房间，1进入成功，对手不在线，2进入成功，对手在线
      enterRoomState.value = !!state;
      if (state === 2) {
        rivalEnterRoomState.value = true;
      }
    });
    message.on("rivalEnterRoom", () => {
      rivalEnterRoomState.value = true;
    });
    message.on("rivalLeaveRoom", () => {
      rivalEnterRoomState.value = false;
    });
  },
  () => {
    connectState.value = false;
    enterRoomState.value = false;
    rivalEnterRoomState.value = false;
  }
);

const app = createApp(App);
app.provide("connectState", connectState);
app.provide("enterRoomState", enterRoomState);
app.provide("rivalEnterRoomState", rivalEnterRoomState);
app.mount("#app");
