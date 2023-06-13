import PocketBase from "pocketbase";
import Game from "@/Classes/Game/game";
import { Socket } from "socket.io";
const pb = new PocketBase("http://127.0.0.1:8090");

// Check this later
export const getGame = (roomNum: string, games: Game[]): Game => {
  return games.find((game) => game.room == roomNum);
};

export const findPlayerBySocketID = (socketId: string, game: Game) => {
  return game.players.find((x) => x.socketId == socketId);
};

export const generateRoomNum = (games: Game[]): string => {
  let roomNumber = Math.floor(Math.random() * 9999).toString();
  if (!checkIfRoomExists(roomNumber, games)) {
    return roomNumber;
  } else {
    return generateRoomNum(games);
  }
};

export const checkIfRoomExists = (roomNum: string, games: Game[]) => {
  let roomExists = false;
  if (games.length == 0) {
    return roomExists;
  }
  games.forEach((game) => {
    if (game.room == roomNum) {
      roomExists = true;
    }
  });
  return roomExists;
};

export const AddPlayerToGame = (
  games: Game[],
  socket: Socket,
  roomNum: string,
  displayName: string
): PlayerData => {
  // Create new player object
  // First player defaults to interviewer
  const newPlayer: PlayerData = {
    socketId: socket.id,
    name: displayName,
    interviewer: false,
    interviewee: false,
    hasInterviewed: false,
    hasBeenInterviewer: false,
    ready: false,
    hasSubmittedCards: false,
    points: 0,
    phraseCards: [],
  };

  if (!checkIfRoomExists(roomNum, games)) {
    // Create new room
    const newRoom = new Game(roomNum);
    games.push(newRoom);

    // Add player to room
    newRoom.players.push(newPlayer);
  } else {
    const game = getGame(roomNum, games);
    game.players.push(newPlayer);
  }

  // Add player to existing room

  return newPlayer;
};

export const getPhraseCards = async (): Promise<string[]> => {
  // Grab all phrase cards from PocketBase
  const phraseCardsRaw = await pb.collection("phrases").getFullList();
  // Isolate card values
  const phraseCards = phraseCardsRaw.map((card) => card.value);
  return phraseCards;
};

export const getJobCards = async (): Promise<string[]> => {
  // Grab all phrase cards from PocketBase
  const jobCardsRaw = await pb.collection("jobs").getFullList();
  // Isolate card values
  const jobCards = jobCardsRaw.map((card) => card.value);
  return jobCards;
};

// Maybe Make this return the shuffled deck to be safe
export const shuffle = (a: any[]) => {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
};

export const removePlayerEntry = (game: Game, socketId: string) => {
  if (game) {
    const playerIndex = game.players.findIndex((player) => {
      player.socketId == socketId;
    });
    game.players.splice(playerIndex, 1);
    console.log(`removed player from room ${game.room}`);
  }
};

export const checkEmptyGames = (game: Game, gameIndex: number) => {
  if (game) {
    if (game.players.length < 1) {
      console.log(`Removed game ${gameIndex} from games array`);
      games.splice(gameIndex, 1);
    }
  }
};
