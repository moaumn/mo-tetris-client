import { createApp, ref } from "vue";
import App from "./App.vue";
import { message, initMessage } from "./common/message";
import "./style.scss";

const roomId = 123;
const connectState = ref(false);
const enterRoomState = ref(false);
initMessage(
  () => {
    connectState.value = true;
    message.emit("enterRoom", roomId);
    message.on("enterRoom", (state: boolean) => {
      enterRoomState.value = state;
      if (!state) {
        alert("房间已满，请创建新的房间");
      }
    });
  },
  () => {
    connectState.value = false;
    enterRoomState.value = false;
  }
);

const app = createApp(App);
app.provide("connectState", connectState);
app.provide("enterRoomState", enterRoomState);
app.mount("#app");
