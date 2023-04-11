import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAppContext } from "./AppContext";

export let socket;

const SocketWrapper = ({ children }) => {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    fetch("/api/socket").finally(() => {
      socket = io();
      socket.on("connect", () => {
        console.log("connect");
      });

      socket.on("connect_error", () => {
        setTimeout(() => {
          socket.connect();
        }, 1000).then(socket.emit("reconnect"));
      });

      socket.on("updateRoomData", (room) => {
        dispatch({ type: "SET_ROOM_NUMBER", value: room });
      });

      socket.on("updatePlayerData", (newPlayerData) => {
        dispatch({ type: "SET_PLAYER_DATA", value: newPlayerData });
      })
    });
  }, []);

  return <>{children}</>;
};

export default SocketWrapper;
