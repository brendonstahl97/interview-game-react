import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAppContext } from "./AppContext";

export let socket;

const SocketWrapper = ({ children }) => {
  const { dispatch } = useAppContext();

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
      });

      socket.on("setGamePhase", (newPhase) => {
        dispatch({ type: "SET_GAME_PHASE", value: newPhase });
        if (newPhase == "Submission Phase") {
          localStorage.removeItem("phraseCards");
          localStorage.removeItem("jobCards");
        }
      });

      socket.on("updatePlayerList", (readyPlayerData) => {
        dispatch({ type: "SET_READY_PLAYER_DATA", value: readyPlayerData });
      });

      socket.on("setCanStart", (canStart) => {
        dispatch({ type: "SET_CAN_START", value: canStart });
      });

      socket.on("updateCurrentInterviewer", (interviewerName) => {
        dispatch({ type: "SET_CURRENT_INTERVIEWER", value: interviewerName });
      });

      socket.on("updateCurrentJob", (jobTitle) => {
        dispatch({ type: "SET_CURRENT_JOB", value: jobTitle });
      });
    });
  }, []);

  return <>{children}</>;
};

export default SocketWrapper;
