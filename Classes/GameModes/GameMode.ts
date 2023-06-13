export interface GamemodeStrategy {
  chooseNext(availablePlayers: PlayerData[], allPlayers: PlayerData[]): number;
  nextInterviewee(allPlayers: PlayerData[]): PlayerData;
  assignNewRoles(allPlayers: PlayerData[]): {
    interviewer: PlayerData;
    interviewee: PlayerData;
  };
  assignPoints(recipientSocketId: string, allPlayers: PlayerData[]): PlayerData;
}
