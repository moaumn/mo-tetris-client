import { io, Socket } from "socket.io-client";
import config from "./config";

let socket: Socket;
export function initMessage(onConnect: () => void, onDisConnect: () => void) {
  socket = io(config.serverUrl);
  socket.on("connect", onConnect);
  socket.on("disconnect", onDisConnect);
}

export const message = {
  on(...args: any[]) {
    // @ts-ignore
    return socket.on(...args);
  },
  emit(...args: any[]) {
    // @ts-ignore
    return socket.emit(...args);
  },
};
