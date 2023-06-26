import { GAME_MODE } from "@/lib/enums";

export interface GamemodeStrategy {
  Name: GAME_MODE;
  chooseNext(availablePlayers: PlayerData[], allPlayers: PlayerData[]): number;
  nextInterviewee(allPlayers: PlayerData[]): PlayerData;
  assignNewRoles(allPlayers: PlayerData[]): {
    interviewer: PlayerData;
    interviewee: PlayerData;
  };

  resetForRound(players: PlayerData[]): void;
  fullPlayerReset(players: PlayerData[]): void;
  nextRound(players: PlayerData[]): void;

  assignPoints(recipientSocketId: string, allPlayers: PlayerData[]): PlayerData;
  generateHiringList(players: PlayerData[]): HiringListEntry[];
  checkForWinner(scoreToWin: number, players: PlayerData[]): string;
}
