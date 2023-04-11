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

    socket.on("newUser", ({ DisplayName, RoomNum }) => {
      let room = RoomNum;

      if (room === "") {
        room = utils.generateRoomNum(Games);
      }

      socket.join(room);
      console.log(room);
      const addedPlayer = utils.AddPlayerToGame(Games, socket, RoomNum, DisplayName);
      io.to(addedPlayer.socketId).emit("updateRoomData", room);
      io.to(addedPlayer.socketId).emit("updatePlayerData", addedPlayer);
    });
  });

  res.end();
};

export default handler;
