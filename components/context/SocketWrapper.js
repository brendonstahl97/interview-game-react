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

      socket.on("setCurrentInterviewee", (intervieweeName) => {
        dispatch({ type: "SET_CURRENT_INTERVIEWEE", value: intervieweeName });
      });

      socket.on("updateCurrentJob", (jobTitle) => {
        dispatch({ type: "SET_CURRENT_JOB", value: jobTitle });
      });

      socket.on("cardPlayed", (cardText) => {
        dispatch({ type: "SET_CURRENT_PHRASE", value: cardText });
      });

      socket.on("populateHiringList", (hiringList) => {
        dispatch({ type: "POPULATE_HIRING_LIST", value: hiringList });
      });

      socket.on("setGameWinner", (winnerName) => {
        dispatch({ type: "SET_GAME_WINNER", value: winnerName });
      });

      socket.on("resetSubmissionData", () => {
        dispatch({ type: "RESET_SUBMISSION_DATA" });
      });
    });
  }, []);

  return <>{children}</>;
};

export default SocketWrapper;
