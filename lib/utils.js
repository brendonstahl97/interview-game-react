const utils = {
  generateRoomNum: (games) => {
    let roomNumber = Math.floor(Math.random() * 9999).toString();
    if (!utils.checkIfRoomExists(roomNumber, games)) {
      return roomNumber;
    } else {
      return utils.generateRoomNum(games);
    }
  },

  checkIfRoomExists: (room, games) => {
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
  },

  AddPlayerToGame: (games, socket, roomNum, displayName) => {
    if (!utils.checkIfRoomExists(roomNum, games)) {
      const newPlayer = {
        socketId: socket.id,
        name: displayName,
        interviewer: true,
        interviewee: false,
        hasInterviewed: false,
        ready: false,
        points: 0,
      };
      console.log(newPlayer);
      games.push({
        room: roomNum,
        players: [newPlayer],
        interviewerIndex: 0,
        jobCards: [],
        jobCardsOrig: [],
        phraseCards: [],
        phraseCardsOrig: [],
        canStart: false,
      });

      return newPlayer;
    }
    const newPlayer = {
      socketId: socket.id,
      name: displayName,
      interviewer: false,
      interviewee: false,
      hasInterviewed: false,
      ready: false,
      points: 0,
    };

    const index = utils.getGameIndex(roomNum, games);
    games[index].players.push(newPlayer);

    return newPlayer;
  },

  getPhraseCards: async (roomNum) => {
    const gameIndex = utils.getGameIndex(roomNum);
    const phraseCardsRaw = await db.premadePhrases.findAll({});
    const phraseCards = phraseCardsRaw.map((card) => card.content);

    let phraseDeck = [...games[gameIndex].phraseCards, ...phraseCards];

    utils.shuffle(phraseDeck);
    games[gameIndex].phraseCards = phraseDeck;
    games[gameIndex].phraseCardsOrig = phraseDeck;

    console.log(games[gameIndex].phraseCardsOrig);
  },

  shuffle: (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
  },

  getJobCards: async (roomNum) => {
    const gameIndex = utils.getGameIndex(roomNum);
    const jobCardsRaw = await db.premadeJobs.findAll({});
    const jobCards = jobCardsRaw.map((card) => card.title);

    let jobDeck = [...games[gameIndex].jobCards, ...jobCards];

    utils.shuffle(jobDeck);
    games[gameIndex].jobCards = jobDeck;
    games[gameIndex].jobCardsOrig = jobDeck;

    console.log(games[gameIndex].jobCardsOrig);
  },

  getGameIndex: (roomNum, games) => {
    return games.findIndex((game) => game.room == roomNum);
  },

  removePlayerEntry: (game, socketId) => {
    if (game) {
      const playerIndex = game.players.findIndex((player) => {
        player.socketId == socketId;
      });
      game.players.splice(playerIndex, 1);
      console.log(`removed player from room ${game.room}`);
    }
  },

  checkEmptyGames: (game, gameIndex) => {
    if (game) {
      if (game.players.length < 1) {
        console.log(`Removed game ${gameIndex} from games array`);
        games.splice(gameIndex, 1);
      }
    }
  },

  resetPlayerReady: (room) => {
    const gameIndex = utils.getGameIndex(room);
    games[gameIndex].players.forEach((player) => (player.ready = false));
  },
};

export default utils;
