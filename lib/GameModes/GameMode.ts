import { GAME_MODE } from "@/lib/enums";

export interface GamemodeStrategy {
  Name: GAME_MODE;
  chooseNext(availablePlayers: PlayerData[], allPlayers: PlayerData[]): number;
  nextInterviewee(allPlayers: PlayerData[]): PlayerData;
  assignNewRoles(allPlayers: PlayerData[]): {
    interviewer: PlayerData;
    interviewee: PlayerData;
  };
  assignPoints(recipientSocketId: string, allPlayers: PlayerData[]): PlayerData;
}
