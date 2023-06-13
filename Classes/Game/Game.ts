import {
  findPlayerBySocketID,
  shuffle,
} from "@/lib/utils";

export default class Game {
  room: string;
  players: PlayerData[];
  jobCards: string[];
  phraseCards: string[];
  jobCardIndex: number;
  phraseCardIndex: number;
  canStart: boolean;

  constructor(roomNumber: string) {
    this.room = roomNumber;
    this.players = [];
    this.jobCards = [];
    this.phraseCards = [];
    this.jobCardIndex = 0;
    this.phraseCardIndex = 0;
    this.canStart = false;
  }

  // Ready Player Methods -------------
  updatePlayerList = () => {
    const playerReadyData = this.players.map((player) => {
      return { displayName: player.name, ready: player.ready };
    });

    return playerReadyData;
  };

  toggleReady = (socketId: string) => {
    const playerIndex = this.players.findIndex(
      (player) => player.socketId == socketId
    );

    const player = this.players[playerIndex];
    player.ready = !player.ready;
  };

  checkStartEligibility = (): boolean => {
    const readyPlayers = this.players.filter(
      (player: PlayerData) => player.ready == true
    );

    if (readyPlayers.length == this.players.length && this.players.length > 1) {
      return true;
    }
    return false;
  };

  // Game Setup Methods --------------
  setupDefaultCards = (
    defaultPhraseCards: string[],
    defaultJobCards: string[]
  ) => {
    this.jobCards = structuredClone(defaultJobCards);
    this.phraseCards = structuredClone(defaultPhraseCards);

    this.jobCardIndex = 0;
    this.phraseCardIndex = 0;
  };

  resetForRound = () => {
    this.players.forEach((player) => {
      player.hasInterviewed = false;
      player.interviewee = false;
      player.interviewer = false;
    });
  };

  fullPlayerReset = () => {
    this.resetForRound();
    this.players.forEach((player) => {
      player.points = 0;
      player.hasBeenInterviewer = false;
      player.hasSubmittedCards = false;
    });
  };

  nextRound = () => {
    this.resetForRound();
    const newRoles = {
      interviewer: this.nextInterviewer(),
      interviewee: this.nextInterviewee(),
    };
    return newRoles;
  };

  // Returns the index of the next player
  protected chooseNext = (availablePlayers: PlayerData[]): number => {
    if (availablePlayers.length <= 0) return null;

    const nextPlayerRaw =
      availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

    const nextPlayerindex = this.players.findIndex(
      (player) => player.socketId == nextPlayerRaw.socketId
    );

    if (nextPlayerindex === -1) return null;

    return nextPlayerindex;
  };

  nextInterviewee = () => {
    const availablePlayers = this.players.filter(
      (player) => !player.hasInterviewed && !player.interviewer
    );

    const newInterviewee = this.players[this.chooseNext(availablePlayers)];

    if (newInterviewee != null) {
      newInterviewee.interviewee = true;
      newInterviewee.hasInterviewed = true;
      return newInterviewee;
    }
    return null;
  };

  nextInterviewer = (): PlayerData => {
    let availablePlayers = this.players.filter(
      (player) => !player.hasBeenInterviewer && !player.interviewee
    );

    if (availablePlayers.length <= 0) {
      this.players.forEach((player) => {
        player.hasBeenInterviewer = false;
      });
      availablePlayers = this.players;
    }

    const newInterviewer = this.players[this.chooseNext(availablePlayers)];

    if (newInterviewer !== null) {
      this.players.forEach((player) => {
        player.interviewer = false;
      });
      newInterviewer.interviewer = true;
      newInterviewer.hasBeenInterviewer = true;
      return newInterviewer;
    }
    return null;
  };

  // Submission Phase methods ------------
  submitPlayerCards = (
    socketId: string,
    submittedPhraseCards: string[],
    submittedJobCards: string[]
  ) => {
    this.jobCards.push(...submittedJobCards);
    this.phraseCards.push(...submittedPhraseCards);

    // This will need to be fixed for sure
    const player = findPlayerBySocketID(socketId, this);
    player.hasSubmittedCards = true;
  };

  checkAllPlayersSubmitted = (): boolean => {
    const submittedPlayers = this.players.filter(
      (player) => player.hasSubmittedCards == true
    );

    if (submittedPlayers.length === this.players.length) {
      return true;
    }

    return false;
  };

  // Deal Phase methods ---------------
  drawPhraseCards = (cardsPerPlayer: number) => {
    // Create an array of empty arrays, one per player
    let drawnPhaseCards = Array.from(Array(this.players.length - 1), () => []);

    // Draw Cards for each player
    this.players.forEach((player, i) => {
      const endIndex = this.phraseCardIndex + cardsPerPlayer;
      const playerCards = this.phraseCards.slice(
        this.phraseCardIndex,
        endIndex
      );

      // If the number of cards to draw exceeds the length of the deck
      if (endIndex >= this.phraseCards.length) {
        // Shuffle the deck
        shuffle(this.phraseCards);

        // Determine how many cards are still needed
        const remainder = endIndex - this.phraseCards.length;
        const remainderCards = this.phraseCards.slice(0, remainder);

        // Add those cards to the player's cards
        playerCards.push(...remainderCards);
        this.phraseCardIndex = remainder;
      } else {
        this.phraseCardIndex = this.phraseCardIndex + cardsPerPlayer;
      }
      drawnPhaseCards[i] = playerCards;
    });
    return drawnPhaseCards;
  };

  drawJobCard = (): string => {
    const drawnCard = this.jobCards[this.jobCardIndex];
    this.jobCardIndex++;

    if (this.jobCardIndex >= this.jobCards.length) {
      shuffle(this.jobCards);
      this.jobCardIndex = 0;
    }
    return drawnCard;
  };

  // Hiring phase methods ---------------
  generateHiringList = (): HiringListEntry[] => {
    const hiringList: HiringListEntry[] = [];

    this.players.map((player) => {
      if (!player.interviewee) return;
      const applicantData = {
        name: player.name,
        socketId: player.socketId,
      };

      hiringList.push(applicantData);
    });

    return hiringList;
  };

  checkForWinner = (scoreToWin: number): string => {
    let winner = null;
    this.players.forEach((player) => {
      if (player.points >= scoreToWin) {
        winner = player.name;
      }
    });
    return winner;
  };
}

// // Got it
// export const updatePlayerList = (roomNum: string, games: any[]) => {
//   const game = games[getGameIndex(roomNum, games)];
//   const playerReadyData = game.players.map((player: PlayerData) => {
//     return {
//       displayName: player.name,
//       ready: player.ready,
//     };
//   });

//   return playerReadyData;
// };

// // got it
// export const checkStartEligibility = (game) => {
//   const readyPlayers = game.players.filter(
//     (player: PlayerData) => player.ready == true
//   );

//   if (readyPlayers.length == game.players.length && game.players.length > 1) {
//     return true;
//   }
//   return false;
// };

// // Got it, but will need to be changed elsewhere
// export const toggleReady = (roomNum, socket, games) => {
//   const playersGame = games[getGameIndex(roomNum, games)];

//   const playerIndex = playersGame.players.findIndex(
//     (player) => player.socketId == socket.id
//   );

//   const player = playersGame.players[playerIndex];
//   player.ready = !player.ready;

//   return playersGame;
// };

// // Got it
// export const setupDefaultCards = (
//   game,
//   defaultPhraseCards,
//   defaultJobCards
// ) => {
//   if (game == null) return;

//   game.jobCardIndex = 0;
//   game.phraseCardIndex = 0;

//   game.jobCards = defaultJobCards.slice();
//   game.phraseCards = defaultPhraseCards.slice();
// };

// // Got it
// export const submitPlayerCards = (
//   socketId,
//   roomNumber,
//   games,
//   phraseCards,
//   jobCards
// ) => {
//   const gameToAddCards = games[getGameIndex(roomNumber, games)];
//   gameToAddCards.jobCards.push(...jobCards);
//   gameToAddCards.phraseCards.push(...phraseCards);

//   const player = findPlayerBySocketID(socketId, gameToAddCards);
//   player.hasSubmittedCards = true;

//   return gameToAddCards;
// };

// // Got it
// export const checkAllPlayersSubmitted = (game) => {
//   const submittedPlayers = game.players.filter(
//     (player) => player.hasSubmittedCards == true
//   );

//   if (submittedPlayers.length == game.players.length) {
//     return true;
//   }
//   return false;
// };
// // Got it
// export const drawPhraseCards = (game, cardsPerPlayer) => {
//   let drawnPhraseCards = Array.from(Array(game.players.length - 1), () => []);
//   game.players.forEach((player, i) => {
//     if (player.interviewer) return;
//     const playerCards = game.phraseCards.slice(
//       game.phraseCardIndex,
//       game.phraseCardIndex + cardsPerPlayer
//     );

//     if (game.phraseCardIndex >= game.phraseCards.length) {
//       shuffle(game.phraseCards);
//       const remainder =
//         game.phraseCardIndex + cardsPerPlayer - game.phraseCards.length;
//       const remainderCards = game.phraseCards.slice(0, remainder);
//       playerCards.push(remainderCards);
//       game.phraseCardIndex = remainder;
//     } else {
//       game.phraseCardIndex = game.phraseCardIndex + cardsPerPlayer;
//     }

//     drawnPhraseCards[i] = playerCards;
//   });

//   return drawnPhraseCards;
// };

// // Got it
// export const drawJobCard = (game) => {
//   const drawnCard = game.jobCards[game.jobCardIndex];
//   game.jobCardIndex = game.jobCardIndex + 1;

//   if (game.jobCardIndex >= game.jobCards.length) {
//     shuffle(game.jobCards);
//     game.jobCardIndex = 0;
//   }

//   return drawnCard;
// };

// // got it
// export const nextInterviewee = (game) => {
//   const availablePlayers = game.players.filter(
//     (player) => !player.hasInterviewed && !player.interviewer
//   );

//   const newInterviewee = chooseNext(availablePlayers, game);

//   if (newInterviewee) {
//     newInterviewee.interviewee = true;
//     newInterviewee.hasInterviewed = true;
//     return newInterviewee;
//   }
//   return false;
// };

// // got it
// export const nextInterviewer = (game) => {
//   let availablePlayers = game.players.filter(
//     (player) => !player.hasBeenInterviewer
//   );

//   if (availablePlayers.length <= 0) {
//     game.players.map((player) => {
//       player.hasBeenInterviewer == false;
//     });
//     availablePlayers = game.players;
//   }

//   const newInterviewer = chooseNext(availablePlayers, game);

//   if (newInterviewer) {
//     game.players.forEach((player) => {
//       player.interviewer = false;
//     });
//     newInterviewer.interviewer = true;
//     newInterviewer.hasBeenInterviewer = true;
//     return newInterviewer;
//   }
//   return false;
// };

// // got it
// export const chooseNext = (availablePlayers, game) => {
//   if (availablePlayers.length <= 0) return false;

//   const nextPlayerRaw =
//     availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

//   const nextPlayerIndex = game.players.findIndex(
//     (player) => player.socketId == nextPlayerRaw.socketId
//   );

//   if (nextPlayerIndex == -1) return false;

//   return game.players[nextPlayerIndex];
// };

// // Got it
// export const generateHiringList = (game) => {
//   const hiringList = [];

//   game.players.map((player) => {
//     if (!player.interviewee) return;
//     const applicantData = {
//       name: player.name,
//       socketId: player.socketId,
//     };

//     hiringList.push(applicantData);
//   });

//   return hiringList;
// };

// export const resetForRound = (game) => {
//   game.players.forEach((player) => {
//     player.hasInterviewed = false;
//     player.interviewee = false;
//     player.interviewer = false;
//   });
// };

// // got it, now called fullPlayerReset()
// export const resetPlayerData = (game) => {
//   game.players.forEach((player) => {
//     player.points = 0;
//     player.hasBeenInterviewer = false;
//     player.hasInterviewed = false;
//     player.hasSubmittedCards = false;
//     player.interviewer = false;
//     player.interviewee = false;
//   });
// };

// // Got it
// export const checkForWinner = (game, scoreToWin) => {
//   let winner = null;
//   game.players.forEach((player) => {
//     if (player.points >= scoreToWin) {
//       winner = player.name;
//     }
//   });
//   return winner;
// };

// export const nextRound = (game) => {
//   resetForRound(game);
//   const newRoles = {
//     interviewer: nextInterviewer(game),
//     interviewee: nextInterviewee(game),
//   };
//   return newRoles;
// };
