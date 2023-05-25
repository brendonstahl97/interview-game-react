import { getGameIndex, findPlayerBySocketID, shuffle } from "./utils.js";

export const updatePlayerList = (roomNum, games) => {
  const game = games[getGameIndex(roomNum, games)];
  const playerReadyData = game.players.map((player) => {
    return {
      displayName: player.name,
      ready: player.ready,
    };
  });

  return playerReadyData;
};

export const checkStartEligibility = (game) => {
  const readyPlayers = game.players.filter((player) => player.ready == true);

  if (readyPlayers.length == game.players.length && game.players.length > 1) {
    return true;
  }
  return false;
};

export const toggleReady = (roomNum, socket, games) => {
  const playersGame = games[getGameIndex(roomNum, games)];

  const playerIndex = playersGame.players.findIndex(
    (player) => player.socketId == socket.id
  );

  const player = playersGame.players[playerIndex];
  player.ready = !player.ready;

  return playersGame;
};

export const setupDefaultCards = (roomNumber, games, phraseCards, jobCards) => {
  const index = getGameIndex(roomNumber, games);

  if (games[index] != null) {
    games[index].jobCards.push(...jobCards);
    games[index].phraseCards.push(...phraseCards);
  }
};

export const submitPlayerCards = (
  socketId,
  roomNumber,
  games,
  phraseCards,
  jobCards
) => {
  const gameToAddCards = games[getGameIndex(roomNumber, games)];
  gameToAddCards.jobCards.push(...jobCards);
  gameToAddCards.phraseCards.push(...phraseCards);

  const player = findPlayerBySocketID(socketId, gameToAddCards);
  player.hasSubmittedCards = true;

  return gameToAddCards;
};

export const checkAllPlayersSubmitted = (game) => {
  const submittedPlayers = game.players.filter(
    (player) => player.hasSubmittedCards == true
  );

  if (submittedPlayers.length == game.players.length) {
    return true;
  }
  return false;
};

export const drawPhraseCards = (game, cardsPerPlayer) => {
  let drawnPhraseCards = Array.from(Array(game.players.length - 1), () => []);
  game.players.forEach((player, i) => {
    if (player.interviewer) return;
    const playerCards = game.phraseCards.slice(
      game.phraseCardIndex,
      game.phraseCardIndex + cardsPerPlayer
    );

    if (game.phraseCardIndex >= game.phraseCards.length) {
      shuffle(game.phraseCards);
      const remainder = game.phraseCardIndex - game.phraseCards.length;
      const remainderCards = game.phraseCards.slice(0, remainder);
      playerCards.push(remainderCards);
      game.phraseCardIndex = remainder;
    } else {
      game.phraseCardIndex = game.phraseCardIndex + cardsPerPlayer;
    }

    drawnPhraseCards[i] = playerCards;
  });

  return drawnPhraseCards;
};

export const drawJobCard = (game) => {
  const drawnCard = game.jobCards[game.jobCardIndex];
  game.jobCardIndex = game.jobCardIndex + 1;

  if (game.jobCardIndex >= game.jobCards.length) {
    shuffle(game.jobCards);
    game.jobCardIndex = 0;
  }
};

export const chooseNextInterviewee = (game) => {
  const availablePlayers = game.players.filter(
    (player) => !player.hasInterviewed && !player.interviewer
  );

  if (availablePlayers.length > 0) {
    const newIntervieweeRaw =
      availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    const newIntervieweeIndex = game.players.findIndex(
      (player) => player.socketId == newIntervieweeRaw.socketId
    );
    return game.players[newIntervieweeIndex];
  }
  return false;
};

export const nextInterviewee = (game) => {
  const newInterviewee = chooseNextInterviewee(game);

  if (newInterviewee) {
    game.players.forEach((player) => {
      player.interviewee = false;
    });
    newInterviewee.interviewee = true;
    newInterviewee.hasInterviewed = true;
    return newInterviewee;
  }
  return false;
};

export const nextInterviewer = (roomNum) => {
  const game = games[getGameIndex(roomNum)];
  // Toggle interviewerStatus of the current interviewer (to false) on both client and server
  io.to(game.players[game.interviewerIndex].socketId).emit("toggleInterviewer");
  game.players[game.interviewerIndex].interviewer = false;

  game.interviewerIndex += 1;

  if (game.interviewerIndex >= game.players.length) {
    game.interviewerIndex = 0;
  }

  // Toggle interviewerStatus of the new interviewer (to true) on both client and server
  io.to(game.players[game.interviewerIndex].socketId).emit("toggleInterviewer");
  game.players[game.interviewerIndex].interviewer = true;

  io.to(roomNum).emit(
    "setCurrentInterviewer",
    game.players[game.interviewerIndex].name
  );
};

export const resetHasInterviewed = (game) => {
  game.players.forEach((player) => (player.hasInterviewed = false));
};

export const resetPoints = (game) => {
  game.players.forEach((player) => (player.points = 0));
};

export const checkForWinner = (game) => {
  let winner;
  game.players.forEach((player) => {
    if (player.points >= scoreToWin) {
      winner = player.name;
      console.log(`${winner} Wins!`);
    }
  });
  return winner;
};

export const setInterviewerDisplay = (roomNum) => {
  const game = games[getGameIndex(roomNum)];
  let interviewerName = "";
  game.players.forEach((player) => {
    if (player.interviewer) {
      interviewerName = player.name;
    }

    if (interviewerName != "") {
      io.emit("setCurrentInterviewer", interviewerName);
    }
  });
};

export const nextRound = (room) => {
  Game.setInterviewerDisplay(room);
  Game.resetHasInterviewed(games[getGameIndex(room)]);
  Game.changeInterviewee(room);
  Game.dealPhraseCards(room);

  io.to(room).emit("interviewPhase");
};

export const resetGame = ({ room, newCards }) => {
  const gameIndex = getGameIndex(room);
  const game = games[gameIndex];

  Game.resetPoints(game);

  if (newCards) {
    game.jobCards = [];
    game.phraseCards = [];

    game.jobCardsOrig = [];
    game.phraseCardsOrig = [];

    Game.submissionPhaseSetup(room);
  } else {
    game.jobCards = game.jobCardsOrig;
    game.phraseCards = game.phraseCardsOrig;

    io.to(roomNum).emit("endSubmissionPhase");
  }
};
