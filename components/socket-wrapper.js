import { useEffect } from "react";
import { io } from "socket.io-client";

export let socket = io();

const SocketWrapper = ({ children }) => {
  useEffect(() => {
    fetch("/api/socket").finally(() => {

      socket.on("connect", () => {
        console.log("connect");
        socket.emit("hello");
      });

      socket.on("connect_error", () => {
        setTimeout(() => {
          socket.connect();
        }, 1000).then(socket.emit("reconnect"));
      });

    });
  }, []);

  return <>{children}</>;
};

export default SocketWrapper;
