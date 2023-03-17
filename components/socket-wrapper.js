import { useEffect } from "react";
import { io } from "socket.io-client";

export let socket = null;

const SocketWrapper = ({ children }) => {
  useEffect(() => {
    fetch("/api/socket").finally(() => {
      socket = io();

      socket.on("connect", () => {
        console.log("connect");
        socket.emit("hello");
      });
    });
  }, []);

  return (
    <>{children}</>
  )
};

export default SocketWrapper;
