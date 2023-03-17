import { useEffect } from "react";
import io from "socket.io-client";

export default () => {
  useEffect(() => {
    fetch("/api/socket").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        console.log("connect");
        socket.emit("hello");
      });
    });
  }, []);

  return <h1>Socket.io</h1>;
};
