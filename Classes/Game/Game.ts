import { findPlayerBySocketID, shuffle } from "@/lib/utils";
import { GamemodeStrategy } from "../GameModes/GameMode";
import { InterviewGameMode } from "../GameModes/InterviewGame/InterviewGameMode";

export default class Game {
  room: string;
  players: PlayerData[];
  jobCards: string[];
  phraseCards: string[];
  jobCardIndex: number;
  phraseCardIndex: number;
  canStart: boolean;
  gameMode: GamemodeStrategy;

  constructor(roomNumber: string) {
    this.room = roomNumber;
    this.players = [];
    this.jobCards = [];
    this.phraseCards = [];
    this.jobCardIndex = 0;
    this.phraseCardIndex = 0;
    this.canStart = false;
    this.gameMode = new InterviewGameMode();
  }

  // Ready Player Methods
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

  // Game Setup Methods
  setupDefaultCards = (
    defaultPhraseCards: string[],
    defaultJobCards: string[]
  ) => {
    this.jobCards = structuredClone(defaultJobCards);
    this.phraseCards = defaultPhraseCards;

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
    const newRoles = this.gameMode.assignNewRoles(this.players);
    return newRoles;
  };

  // Submission Phase methods
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

  // Deal Phase methods
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

  // Hiring phase methods
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

//   assignPoints = (winnerSocketId: string): PlayerData => {
//     const playerReceivingPoint = this.players.find(player => player.socketId == winnerSocketId);
//     playerReceivingPoint.points++;
//     return playerReceivingPoint;
//   }
}
