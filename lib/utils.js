import PocketBase from "pocketbase";
const pb = new PocketBase("http://127.0.0.1:8090");

export const getGameIndex = (roomNum, games) => {
  return games.findIndex((game) => game.room == roomNum);
};

export const findPlayerBySocketID = (socketId, game) => {
    return game.players.find(x => x.socketId == socketId);
};

export const generateRoomNum = (games) => {
  let roomNumber = Math.floor(Math.random() * 9999).toString();
  if (!checkIfRoomExists(roomNumber, games)) {
    return roomNumber;
  } else {
    return generateRoomNum(games);
  }
};

export const checkIfRoomExists = (room, games) => {
  let roomExists = false;
  if (games.length == 0) {
    return roomExists;
  }
  games.forEach((game) => {
    if (game.room == room) {
      roomExists = true;
    }
  });
  return roomExists;
};

export const CreateRoom = (games, roomNum) => {
  const room = {
    room: roomNum,
    players: [],
    jobCards: [],
    phraseCards: [],
    jobCardIndex: 0,
    phraseCardIndex: 0,
    canStart: false,
  };

  return games.push(room) - 1;
};

export const AddPlayerToGame = (games, socket, roomNum, displayName) => {
  // Create new player object
  // First player defaults to interviewer
  const newPlayer = {
    socketId: socket.id,
    name: displayName,
    interviewer: false,
    interviewee: false,
    hasInterviewed: false,
    hasBeenInterviewer: false,
    ready: false,
    hasSubmittedCards: false,
    points: 0,
    phraseCards: []
  };

  // If room doesn't exist
  if (!checkIfRoomExists(roomNum, games)) {

    // Create new room
    const roomIndex = CreateRoom(games, roomNum);

    // Add player to room
    games[roomIndex].players.push(newPlayer);

    return newPlayer;
  }

  // If room does exist

  // Add player to existing room
  const index = getGameIndex(roomNum, games);
  games[index].players.push(newPlayer);

  return newPlayer;
};

  export const getPhraseCards = async () => {
    // Grab all phrase cards from PocketBase
    const phraseCardsRaw = await pb.collection("phrases").getFullList();
    // Isolate card values
    const phraseCards = phraseCardsRaw.map((card) => card.value);
    return phraseCards;
  }

  export const getJobCards = async () => {
    // Grab all phrase cards from PocketBase
    const jobCardsRaw = await pb.collection("jobs").getFullList();
    // Isolate card values
    const jobCards = jobCardsRaw.map((card) => card.value);
    return jobCards;
  }

export const shuffle = (a) => {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
};

export const removePlayerEntry = (game, socketId) => {
  if (game) {
    const playerIndex = game.players.findIndex((player) => {
      player.socketId == socketId;
    });
    game.players.splice(playerIndex, 1);
    console.log(`removed player from room ${game.room}`);
  }
};

export const checkEmptyGames = (game, gameIndex) => {
  if (game) {
    if (game.players.length < 1) {
      console.log(`Removed game ${gameIndex} from games array`);
      games.splice(gameIndex, 1);
    }
  }
};

export const resetPlayerReady = (room) => {
  const gameIndex = getGameIndex(room);
  games[gameIndex].players.forEach((player) => (player.ready = false));
};
