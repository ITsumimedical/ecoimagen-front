import io from "socket.io-client";

export default ({ app }, inject) => {
  const socket = io(process.env.NEST_WEBSOCKET, {
    transports: ["websocket"],
  });

  inject("socket", socket);
};
