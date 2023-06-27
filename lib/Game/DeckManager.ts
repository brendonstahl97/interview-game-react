import { shuffle } from "../utils";

export default class DeckManager {
  private jobCards: string[];
  private phraseCards: string[];
  private jobCardIndex: number;
  private phraseCardIndex: number;

  constructor() {
    this.jobCards = [];
    this.phraseCards = [];
    this.jobCardIndex = 0;
    this.phraseCardIndex = 0;
  }

  setupDefaultCards = (
    defaultPhraseCards: string[],
    defaultJobCards: string[]
  ) => {
    this.jobCards = structuredClone(defaultJobCards);
    this.phraseCards = defaultPhraseCards;

    this.jobCardIndex = 0;
    this.phraseCardIndex = 0;
  };

  submitPlayerCards = (
    submittedPhraseCards: string[],
    submittedJobCards: string[]
  ) => {
    this.jobCards.push(...submittedJobCards);
    this.phraseCards.push(...submittedPhraseCards);
  };

  drawPhraseCards = (cardsPerPlayer: number): string[] => {
      const endIndex = this.phraseCardIndex + cardsPerPlayer;
      const drawnPlayerCards = this.phraseCards.slice(
        this.phraseCardIndex,
        endIndex
      );

      if (endIndex >= this.phraseCards.length) {
        this.phraseCards = shuffle(this.phraseCards);

        const remainder = endIndex - this.phraseCards.length;
        const remainderCards = this.phraseCards.slice(0, remainder);

        drawnPlayerCards.push(...remainderCards);
        this.phraseCardIndex = remainder;
      } else {
        this.phraseCardIndex = this.phraseCardIndex + cardsPerPlayer;
      }

    return drawnPlayerCards;
  };

  drawJobCard = (): string => {
    const drawnCard = this.jobCards[this.jobCardIndex];
    this.jobCardIndex++;

    if (this.jobCardIndex >= this.jobCards.length) {
      this.jobCards = shuffle(this.jobCards);
      this.jobCardIndex = 0;
    }
    return drawnCard;
  };

  shuffleDecks = (): void => {
    this.jobCards = shuffle(this.jobCards);
    this.phraseCards = shuffle(this.phraseCards);
  }
}
