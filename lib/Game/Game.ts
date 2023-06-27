import { findPlayerBySocketID, shuffle } from "@/lib/utils";
import { GamemodeStrategy } from "../GameModes/GameMode";
import { InterviewGameMode } from "../GameModes/InterviewGame/InterviewGameMode";
import DeckManager from "./DeckManager";
import { BoardOfDirectorsGameMode } from "../GameModes/BoardOfDirectors/BoardOfDirectorsGameMode";

export default class Game {
  room: string;
  players: PlayerData[];
  canStart: boolean;
  gameMode: GamemodeStrategy;
  deckManager: DeckManager;

  constructor(roomNumber: string) {
    this.room = roomNumber;
    this.players = [];
    this.canStart = false;
    this.gameMode = new BoardOfDirectorsGameMode();
    this.deckManager = new DeckManager();
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

    if (readyPlayers.length == this.players.length && this.players.length > 1)
      return true;

    return false;
  };

  HandlePlayerSubmission = (
    socketId: string,
    submittedPhraseCards: string[],
    submittedJobCards: string[]
  ) => {

    this.deckManager.submitPlayerCards(submittedPhraseCards, submittedJobCards);

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

  requestPhraseCards = (cardsPerPlayer: number): string[][] => {
    const cardsToDeal: string[][] = []

    this.players.forEach(player => {
      if(!player.interviewer)
        cardsToDeal.push(this.deckManager.drawPhraseCards(cardsPerPlayer));
    });

    return cardsToDeal;
  } 
}
