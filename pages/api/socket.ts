import { Server } from "socket.io";
import {
  updatePlayerList,
  toggleReady,
  checkStartEligibility,
  setupDefaultCards,
  submitPlayerCards,
  checkAllPlayersSubmitted,
  drawJobCard,
  drawPhraseCards,
  nextInterviewee,
  generateHiringList,
  checkForWinner,
  nextRound,
  resetPlayerData,
} from "@/lib/game";
import {
  generateRoomNum,
  AddPlayerToGame,
  getJobCards,
  getPhraseCards,
  shuffle,
  getGameIndex,
} from "@/lib/utils";

// Extending NextAPIRepsonse with socket functionality from the bottom up
import type { Server as HTTPServer } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const Games: any[] = [];
let DefaultJobCards: string[] = [];
let DefaultPhraseCards: string[] = [];
const cardsPerPlayer = 5;
const scoreToWin = 1;

const GetDefaultCards = async () => {
  DefaultJobCards = await getJobCards();
  DefaultPhraseCards = await getPhraseCards();
};

GetDefaultCards();

const handler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    res.end();
    return;
  }

  console.log("Socket is initializing");
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(res.socket.server);
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
      const game = Games[getGameIndex(roomNumber, Games)];
      setupDefaultCards(game, DefaultPhraseCards, DefaultJobCards);
      io.to(roomNumber).emit("setGamePhase", "Submission Phase");
    });

    const DealPhase = (game: any) => {
      io.to(game.room).emit("setGamePhase", "Deal Phase");

      shuffle(game.jobCards);
      shuffle(game.phraseCards);

      const jobCard = drawJobCard(game);
      io.to(game.room).emit("updateCurrentJob", jobCard);

      const newRoles = nextRound(game);

      io.to(game.room).emit("updateCurrentInterviewee", newRoles.interviewee.name);
      io.to(game.room).emit(
        "updateCurrentInterviewer",
        newRoles.interviewer.name
      );

      const phraseCards = drawPhraseCards(game, cardsPerPlayer);

      game.players.forEach((player: PlayerData, i: number) => {
        player.phraseCards = phraseCards[i];
        io.to(player.socketId).emit("updatePlayerData", player);
      });

      io.to(game.room).emit("setGamePhase", "Interview Phase");
    };

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

        DealPhase(gameSubmittedTo);
      }
    );

    socket.on("playCard", ({ cardText, roomNumber }) => {
      io.to(roomNumber).emit("cardPlayed", cardText);
    });

    socket.on("turnEnded", (roomNumber) => {
      const game = Games[getGameIndex(roomNumber, Games)];
      const newInterviewee = nextInterviewee(game);

      game.players.forEach((player: PlayerData) => {
        io.to(player.socketId).emit("updatePlayerData", player);
      });

      io.to(roomNumber).emit("cardPlayed", "");

      if (!newInterviewee) {
        const hiringList = generateHiringList(game);
        io.to(roomNumber).emit("populateHiringList", hiringList);
        io.to(roomNumber).emit("setGamePhase", "Employment Phase");
      } else {
        io.to(roomNumber).emit("updateCurrentInterviewee", newInterviewee.name);
      }
    });

    socket.on("roundWinnerSelected", ({ roomNumber, winnerSocketId }) => {
      const game = Games[getGameIndex(roomNumber, Games)];

      game.players.map((player: PlayerData) => {
        if (player.socketId == winnerSocketId) {
          player.points++;
          io.to(winnerSocketId).emit("updatePlayerData", player);
        }
      });

      const gameWinner = checkForWinner(game, scoreToWin);

      if (gameWinner != null) {
        io.to(roomNumber).emit("setGameWinner", gameWinner);
        io.to(roomNumber).emit("setGamePhase", "Winner Phase");
      } else {
        DealPhase(game);
      }
    });

    socket.on("resetGame", ({ roomNumber, useNewCards }) => {
      const game = Games[getGameIndex(roomNumber, Games)];
      resetPlayerData(game);

      if (useNewCards) {
        setupDefaultCards(game, DefaultPhraseCards, DefaultJobCards);
        io.to(roomNumber).emit("resetSubmissionData");
        io.to(roomNumber).emit("setGamePhase", "Submission Phase");
      } else {
        DealPhase(game);
      }
    });
  });

  res.end();
};

export default handler;