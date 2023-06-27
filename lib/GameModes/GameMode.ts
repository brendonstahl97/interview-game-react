import { GAME_MODE } from "@/lib/enums";
import { Server } from "socket.io";
import Game from "../Game/Game";

export interface GamemodeStrategy {
  Name: GAME_MODE;
  chooseNext(availablePlayers: PlayerData[], allPlayers: PlayerData[]): number;
  nextInterviewee(allPlayers: PlayerData[]): PlayerData;
  assignNewRoles(allPlayers: PlayerData[]): PlayerRoleData[];

  resetForRound(players: PlayerData[]): void;
  fullPlayerReset(players: PlayerData[]): void;
  nextRound(players: PlayerData[], io: Server, game: Game): void;

  assignPoints(recipientSocketId: string, allPlayers: PlayerData[]): PlayerData;
  generateHiringList(players: PlayerData[]): HiringListEntry[];
  checkForWinner(scoreToWin: number, players: PlayerData[]): string;
}
