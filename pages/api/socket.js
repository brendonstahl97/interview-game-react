import { Server } from "socket.io";
import Game from "@/lib/game";
import utils from "@/lib/utils";

const Games = [];

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
    socket.on("newUser", ({ displayName, roomNumber }) => {
      let room = roomNumber;

      if (room === "") {
        room = utils.generateRoomNum(Games);
      }

      socket.join(room);

      const addedPlayer = utils.AddPlayerToGame(
        Games,
        socket,
        room,
        displayName
      );

      io.to(addedPlayer.socketId).emit("updateRoomData", room);
      io.to(addedPlayer.socketId).emit("updatePlayerData", addedPlayer);
      io.to(addedPlayer.socketId).emit("setGamePhase", "Setup Phase");

      const playerReadyData = Game.updatePlayerList(room, Games);
      io.to(room).emit("updatePlayerList", playerReadyData);
    });

    socket.on("toggleReady", (roomNumber) => {
      const gameOfToggledPlayer = Game.toggleReady(roomNumber, socket, Games);

      const playerReadyData = Game.updatePlayerList(roomNumber, Games);
      io.to(roomNumber).emit("updatePlayerList", playerReadyData);

      if (
        Game.checkStartEligibility(gameOfToggledPlayer) !=
        gameOfToggledPlayer.canStart
      ) {
        gameOfToggledPlayer.canStart = !gameOfToggledPlayer.canStart;
        io.to(roomNumber).emit("setCanStart", gameOfToggledPlayer.canStart);
      }
    });
  });

  res.end();
};

export default handler;
