import { Server } from "socket.io";
import Game from "@/Classes/Game/Game";
import { GAME_PHASE } from "@/lib/enums";
import {
  generateRoomNum,
  AddPlayerToGame,
  getJobCards,
  getPhraseCards,
  shuffle,
  getGame,
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

const Games: Game[] = [];
let DefaultJobCards: string[] = [];
let DefaultPhraseCards: string[] = [];
const cardsPerPlayer = 5;
const scoreToWin = 3;

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
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(
    res.socket.server
  );
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
      io.to(addedPlayer.socketId).emit("setGamePhase", GAME_PHASE.SETUP_PHASE);

      const playerReadyData = getGame(room, Games).updatePlayerList();
      io.to(room).emit("updatePlayerList", playerReadyData);
    });

    socket.on("toggleReady", (roomNumber) => {
      const gameOfToggledPlayer = getGame(roomNumber, Games);
      gameOfToggledPlayer.toggleReady(socket.id);

      const playerReadyData = gameOfToggledPlayer.updatePlayerList();
      io.to(roomNumber).emit("updatePlayerList", playerReadyData);

      if (
        gameOfToggledPlayer.checkStartEligibility() !=
        gameOfToggledPlayer.canStart
      ) {
        gameOfToggledPlayer.canStart = !gameOfToggledPlayer.canStart;
        io.to(roomNumber).emit("setCanStart", gameOfToggledPlayer.canStart);
      }
    });

    socket.on("startGame", (roomNumber) => {
      const game = getGame(roomNumber, Games);
      game.setupDefaultCards(DefaultPhraseCards, DefaultJobCards);
      io.to(roomNumber).emit("setGamePhase", GAME_PHASE.SUBMISSION_PHASE);
    });

    const DealPhase = (game: Game) => {
      io.to(game.room).emit("setGamePhase", GAME_PHASE.DEAL_PHASE);

      shuffle(game.jobCards);
      shuffle(game.phraseCards);

      const jobCard = game.drawJobCard();
      io.to(game.room).emit("updateCurrentJob", jobCard);

      const newRoles = game.nextRound();

      io.to(game.room).emit(
        "updateCurrentInterviewee",
        newRoles.interviewee.name
      );
      
      io.to(game.room).emit(
        "updateCurrentInterviewer",
        newRoles.interviewer.name
      );

      const phraseCards = game.drawPhraseCards(cardsPerPlayer);

      game.players.forEach((player: PlayerData, i: number) => {
        player.phraseCards = phraseCards[i];
        io.to(player.socketId).emit("updatePlayerData", player);
      });

      io.to(game.room).emit("setGamePhase", GAME_PHASE.INTERVIEW_PHASE);
    };

    socket.on(
      "submitPlayerCards",
      ({ socketId, roomNumber, jobs, phrases }) => {
        const gameSubmittedTo = getGame(roomNumber, Games);

        gameSubmittedTo.submitPlayerCards(socketId, phrases, jobs);
        const allPlayersSubmitted = gameSubmittedTo.checkAllPlayersSubmitted();

        if (!allPlayersSubmitted) return;

        DealPhase(gameSubmittedTo);
      }
    );

    socket.on("playCard", ({ cardText, roomNumber }) => {
      io.to(roomNumber).emit("cardPlayed", cardText);
    });

    socket.on("turnEnded", (roomNumber) => {
      const game = getGame(roomNumber, Games);
      const newInterviewee = game.gameMode.nextInterviewee(game.players);

      game.players.forEach((player: PlayerData) => {
        io.to(player.socketId).emit("updatePlayerData", player);
      });

      io.to(roomNumber).emit("cardPlayed", "");

      if (!newInterviewee) {
        const hiringList = game.generateHiringList();
        io.to(roomNumber).emit("populateHiringList", hiringList);
        io.to(roomNumber).emit("setGamePhase", GAME_PHASE.EMPLOYMENT_PHASE);
      } else {
        io.to(roomNumber).emit("updateCurrentInterviewee", newInterviewee.name);
      }
    });

    socket.on("roundWinnerSelected", ({ roomNumber, winnerSocketId }) => {
      const game = getGame(roomNumber, Games);

      const winningPlayer = game.gameMode.assignPoints(winnerSocketId, game.players);

      io.to(winnerSocketId).emit("updatePlayerData", winningPlayer);

      const gameWinner = game.checkForWinner(scoreToWin);

      if (gameWinner != null) {
        io.to(roomNumber).emit("setGameWinner", gameWinner);
        io.to(roomNumber).emit("setGamePhase", GAME_PHASE.WINNER_PHASE);
      } else {
        DealPhase(game);
      }
    });

    socket.on("resetGame", ({ roomNumber, useNewCards }) => {
      const game = getGame(roomNumber, Games);
      game.fullPlayerReset();

      if (useNewCards) {
        game.setupDefaultCards(DefaultPhraseCards, DefaultJobCards);
        io.to(roomNumber).emit("resetSubmissionData");
        io.to(roomNumber).emit("setGamePhase", GAME_PHASE.SUBMISSION_PHASE);
      } else {
        DealPhase(game);
      }
    });
  });

  res.end();
};

export default handler;
