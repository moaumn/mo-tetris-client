import { createApp, ref } from "vue";
import App from "./App.vue";
import { message, initMessage } from "./common/message";

const roomId = 123;
const connectState = ref(false);
const entryRoomState = ref(false);
initMessage(
  () => {
    connectState.value = true;
    message.emit("enterTheRoom", roomId);
    message.on("enterTheRoom", (state: number) => {
      entryRoomState.value = state === 1;
    });
  },
  () => {
    connectState.value = false;
    entryRoomState.value = false;
  }
);

const app = createApp(App);
app.provide("connectState", connectState);
app.provide("entryRoomState", entryRoomState);
app.mount("#app");
