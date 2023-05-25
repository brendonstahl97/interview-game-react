import { Server } from "socket.io";
import {
  updatePlayerList,
  toggleReady,
  checkStartEligibility,
  setupDefaultCards,
  submitPlayerCards,
  checkAllPlayersSubmitted,
  resetHasInterviewed,
  drawJobCard,
  drawPhraseCards,
  nextInterviewee,
} from "@/lib/game";
import {
  generateRoomNum,
  AddPlayerToGame,
  getJobCards,
  getPhraseCards,
  shuffle,
  getGameIndex,
} from "@/lib/utils";

const Games = [];
let DefaultJobCards = [];
let DefaultPhraseCards = [];
const cardsPerPlayer = 5;

const GetDefaultCards = async () => {
  DefaultJobCards = await getJobCards();
  DefaultPhraseCards = await getPhraseCards();
};

GetDefaultCards();

const handler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  console.log("Socket is initializing");
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("newUser", async ({ displayName, roomNumber }) => {
      let room = roomNumber;

      if (room === "") {
        room = generateRoomNum(Games);
      }

      socket.join(room);

      const addedPlayer = AddPlayerToGame(Games, socket, room, displayName);

      io.to(addedPlayer.socketId).emit("updateRoomData", room);
      io.to(addedPlayer.socketId).emit("updatePlayerData", addedPlayer);
      io.to(addedPlayer.socketId).emit("setGamePhase", "Setup Phase");

      const playerReadyData = updatePlayerList(room, Games);
      io.to(room).emit("updatePlayerList", playerReadyData);
    });

    socket.on("toggleReady", (roomNumber) => {
      const gameOfToggledPlayer = toggleReady(roomNumber, socket, Games);

      const playerReadyData = updatePlayerList(roomNumber, Games);
      io.to(roomNumber).emit("updatePlayerList", playerReadyData);

      if (
        checkStartEligibility(gameOfToggledPlayer) !=
        gameOfToggledPlayer.canStart
      ) {
        gameOfToggledPlayer.canStart = !gameOfToggledPlayer.canStart;
        io.to(roomNumber).emit("setCanStart", gameOfToggledPlayer.canStart);
      }
    });

    socket.on("startGame", (roomNumber) => {
      setupDefaultCards(roomNumber, Games, DefaultPhraseCards, DefaultJobCards);
      io.to(roomNumber).emit("setGamePhase", "Submission Phase");
    });

    socket.on(
      "submitPlayerCards",
      ({ socketId, roomNumber, jobs, phrases }) => {
        const gameSubmittedTo = submitPlayerCards(
          socketId,
          roomNumber,
          Games,
          phrases,
          jobs
        );
        const allPlayersSubmitted = checkAllPlayersSubmitted(gameSubmittedTo);

        if (!allPlayersSubmitted) return;

        shuffle(gameSubmittedTo.jobCards);
        shuffle(gameSubmittedTo.phraseCards);
        resetHasInterviewed(gameSubmittedTo);

        io.to(roomNumber).emit(
          "updateCurrentInterviewer",
          gameSubmittedTo.players.find((player) => player.interviewer == true)
            .name
        );
        io.to(roomNumber).emit("setGamePhase", "Deal Phase");

        // Deal Phase Stuff
        const jobCard = drawJobCard(gameSubmittedTo);
        io.to(roomNumber).emit("updateCurrentJob", jobCard);

        const phraseCards = drawPhraseCards(gameSubmittedTo, cardsPerPlayer);
        const newInterviewee = nextInterviewee(gameSubmittedTo);

        gameSubmittedTo.players.forEach((player, i) => {
          player.phraseCards = phraseCards[i];
          io.to(player.socketId).emit("updatePlayerData", player);
        });

        io.to(roomNumber).emit("setCurrentInterviewee", newInterviewee.name);
        io.to(roomNumber).emit("setGamePhase", "Interview Phase");
      }
    );

    socket.on("playCard", ({ cardText, roomNumber }) => {
      io.to(roomNumber).emit("cardPlayed", cardText);
    });

    socket.on("turnEnded", ({ roomNumber }) => {
      const game = Games[getGameIndex(roomNumber, Games)];
      const newInterviewee = nextInterviewee(game);

      game.players.forEach((player) => {
        io.to(player.socketId).emit("updatePlayerData", player);
      });

      io.to(roomNumber).emit("cardPlayed", "");

      if (!newInterviewee) {
        io.to(roomNumber).emit("setGamePhase", "Employment Phase");
      } else {
        io.to(roomNumber).emit("setCurrentInterviewee", newInterviewee.name);
      }
    });
  });

  res.end();
};

export default handler;
