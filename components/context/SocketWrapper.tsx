import { ReactElement, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAppContext } from "./AppContext";
import { REDUCER_ACTION_TYPE } from "./AppReducer";

export let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

const SocketWrapper = ({ children }: { children: ReactElement }) => {
  const { dispatch } = useAppContext();

  useEffect(() => {
    fetch("/api/socket").finally(() => {
      socket = io();
      socket.on("connect", () => {
        console.log("connect");
      });

      //   socket.on("connect_error", () => {
      //     setTimeout(() => {
      //       socket.connect();
      //     }, 1000).then(socket.emit("reconnect"));
      //   });

      socket.on("updateRoomData", (room) => {
        dispatch({ type: REDUCER_ACTION_TYPE.SET_ROOM_NUMBER, value: room });
      });

      socket.on("updatePlayerData", (newPlayerData) => {
        dispatch({
          type: REDUCER_ACTION_TYPE.SET_PLAYER_DATA,
          value: newPlayerData,
        });
      });

      socket.on("setGamePhase", (newPhase) => {
        dispatch({ type: REDUCER_ACTION_TYPE.SET_GAME_PHASE, value: newPhase });
      });

      socket.on("updatePlayerList", (readyPlayerData) => {
        dispatch({
          type: REDUCER_ACTION_TYPE.SET_READY_PLAYER_DATA,
          value: readyPlayerData,
        });
      });

      socket.on("setCanStart", (canStart) => {
        dispatch({ type: REDUCER_ACTION_TYPE.SET_CAN_START, value: canStart });
      });

      socket.on("updateCurrentInterviewer", (interviewerName) => {
        dispatch({
          type: REDUCER_ACTION_TYPE.SET_CURRENT_INTERVIEWER,
          value: interviewerName,
        });
      });

      socket.on("updateCurrentInterviewee", (intervieweeName) => {
        dispatch({
          type: REDUCER_ACTION_TYPE.SET_CURRENT_INTERVIEWEE,
          value: intervieweeName,
        });
      });

      socket.on("updateCurrentJob", (jobTitle) => {
        dispatch({
          type: REDUCER_ACTION_TYPE.SET_CURRENT_JOB,
          value: jobTitle,
        });
      });

      socket.on("cardPlayed", (cardText) => {
        dispatch({
          type: REDUCER_ACTION_TYPE.SET_CURRENT_PHRASE,
          value: cardText,
        });
      });

      socket.on("populateHiringList", (hiringList) => {
        dispatch({
          type: REDUCER_ACTION_TYPE.POPULATE_HIRING_LIST,
          value: hiringList,
        });
      });

      socket.on("setGameWinner", (winnerName) => {
        dispatch({
          type: REDUCER_ACTION_TYPE.SET_GAME_WINNER,
          value: winnerName,
        });
      });

      socket.on("resetSubmissionData", () => {
        dispatch({ type: REDUCER_ACTION_TYPE.RESET_SUBMISSION_DATA });
      });
    });
  }, []);

  return <>{children}</>;
};

export default SocketWrapper;
