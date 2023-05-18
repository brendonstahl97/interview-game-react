import { getGameIndex, resetPlayerReady, findPlayerBySocketID } from "./utils.js";

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

  //   if (readyPlayers.length == game.players.length && game.players.length > 1) {
  if (readyPlayers.length == game.players.length) {
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
}

export const submitPlayerCards = (socketId, roomNumber, games, phraseCards, jobCards) => {
    const gameToAddCards = games[getGameIndex(roomNumber, games)];
    gameToAddCards.jobCards.push(...jobCards);
    gameToAddCards.phraseCards.push(...phraseCards);

    const player = findPlayerBySocketID(socketId, gameToAddCards);
    player.hasSubmittedCards = true;

    return gameToAddCards;
}

export const checkAllPlayersSubmitted = (game) => {
    const submittedPlayers = game.players.filter(player => player.hasSubmittedCards == true);

    if (submittedPlayers.length == game.players.length) {
        return true;
    }
    return false;
}

export const dealPhraseCards = (roomNum) => {
  const gameIndex = getGameIndex(roomNum);
  const players = games[gameIndex].players;

  players.forEach((player) => {
    if (!player.interviewer) {
      const cardPack = games[gameIndex].phraseCards.slice(0, cardsPerPlayer);
      games[gameIndex].phraseCards =
        games[gameIndex].phraseCards.slice(cardsPerPlayer);
      io.to(player.socketId).emit("cardPack", cardPack);
    }
  });
};

export const dealJobCard = (roomNum) => {
  const gameIndex = getGameIndex(roomNum);

  const card = games[gameIndex].jobCards[0];
  games[gameIndex].jobCards = games[gameIndex].jobCards.slice(1);

  console.log(card);
  io.to(roomNum).emit("dealJobCard", card);
};

export const chooseNextInterviewee = (roomNum) => {
  const game = games[getGameIndex(roomNum)];
  const availablePlayers = game.players.filter(
    (player) => !player.hasInterviewed && !player.interviewer
  );

  if (availablePlayers.length > 0) {
    const newIntervieweeRaw =
      availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
    return game.players.findIndex(
      (player) => player.socketId == newIntervieweeRaw.socketId
    );
  } else {
    io.to(roomNum).emit(
      "employmentPhase",
      games[getGameIndex(roomNum)].players
    );
    return -1;
  }
};

export const changeInterviewee = (roomNum) => {
  const game = games[getGameIndex(roomNum)];
  let newIntervieweeIndex = -1;
  newIntervieweeIndex = Game.chooseNextInterviewee(roomNum);

  if (newIntervieweeIndex != -1) {
    const newInterviewee = game.players[newIntervieweeIndex];

    game.players.forEach((player) => {
      player.interviewee = false;
    });
    newInterviewee.interviewee = true;
    newInterviewee.hasInterviewed = true;
    io.to(roomNum).emit("setCurrentPlayer", newInterviewee);
    io.to(roomNum).emit("interviewPhase");
  }
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
  console.log(`Draw phase sent to room ${room}`);

  io.to(room).emit("drawPhase");
  Game.setInterviewerDisplay(room);
  Game.resetHasInterviewed(games[getGameIndex(room)]);
  Game.changeInterviewee(room);
  Game.dealPhraseCards(room);
  Game.dealJobCard(room);

  console.log(`Interview phase sent to room ${room}`);
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
