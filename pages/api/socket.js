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
    console.log("connect");
    socket.on("newUser", ({ DisplayName, RoomNum }) => {
      let room = RoomNum;
      if (room === "") {
        room = utils.generateRoomNum(Games);
      }
      socket.join(room);
      socket.to(room).emit("updateRoomData", room);
    });
  });

  res.end();
};

export default handler;
