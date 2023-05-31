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

export const setupDefaultCards = (game, phraseCards, jobCards) => {
  if (game == null) return;

  game.jobCardIndex = 0;
  game.phraseCardIndex = 0;

  game.jobCards = jobCards;
  game.phraseCards = phraseCards;
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

  return drawnCard;
};

export const nextInterviewee = (game) => {
  const availablePlayers = game.players.filter(
    (player) => !player.hasInterviewed && !player.interviewer
  );

  const newInterviewee = chooseNext(availablePlayers, game);

  if (newInterviewee) {
    newInterviewee.interviewee = true;
    newInterviewee.hasInterviewed = true;
    return newInterviewee;
  }
  return false;
};

export const nextInterviewer = (game) => {
  let availablePlayers = game.players.filter(
    (player) => !player.hasBeenInterviewer
  );

  if (availablePlayers.length <= 0) {
    game.players.map((player) => {
      player.hasBeenInterviewer == false;
    });
    availablePlayers = game.players;
  }

  const newInterviewer = chooseNext(availablePlayers, game);

  if (newInterviewer) {
    game.players.forEach((player) => {
      player.interviewer = false;
    });
    newInterviewer.interviewer = true;
    newInterviewer.hasBeenInterviewer = true;
    return newInterviewer;
  }
  return false;
};

export const chooseNext = (availablePlayers, game) => {
  if (availablePlayers.length <= 0) return false;

  const nextPlayerRaw =
    availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

  const nextPlayerIndex = game.players.findIndex(
    (player) => player.socketId == nextPlayerRaw.socketId
  );

  if (nextPlayerIndex == -1) return false;

  return game.players[nextPlayerIndex];
};

export const generateHiringList = (game) => {
  const hiringList = [];

  game.players.map((player) => {
    if (!player.interviewee) return;
    const applicantData = {
      name: player.name,
      socketId: player.socketId,
    };

    hiringList.push(applicantData);
  });

  return hiringList;
};

export const resetForRound = (game) => {
  game.players.forEach((player) => {
    player.hasInterviewed = false;
    player.interviewee = false;
    player.interviewer = false;
  });
};

export const resetPlayerData = (game) => {
  game.players.forEach((player) => {
    player.points = 0;
    player.hasBeenInterviewer = false;
    player.hasInterviewed = false;
    player.hasSubmittedCards = false;
    player.interviewer = false;
    player.interviewee = false;
  });
};

export const checkForWinner = (game, scoreToWin) => {
  let winner = null;
  game.players.forEach((player) => {
    if (player.points >= scoreToWin) {
      winner = player.name;
    }
  });
  return winner;
};

export const nextRound = (game) => {
  resetForRound(game);
  const newRoles = {
    interviewer: nextInterviewer(game),
    interviewee: nextInterviewee(game),
  };
  return newRoles;
};
