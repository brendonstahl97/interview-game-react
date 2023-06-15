import { GAME_MODE } from "@/lib/enums";
import { GamemodeStrategy } from "../GameMode";

export class InterviewGameMode implements GamemodeStrategy {
  Name: GAME_MODE;

  constructor() {
    this.Name = GAME_MODE.INTERVIEW_GAME;
  }

  chooseNext(availablePlayers: PlayerData[], allPlayers: PlayerData[]): number {
    if (availablePlayers.length <= 0) return null;

    const nextPlayerRaw =
      availablePlayers[Math.floor(Math.random() * availablePlayers.length)];

    const nextPlayerindex = allPlayers.findIndex(
      (player) => player.socketId == nextPlayerRaw.socketId
    );

    if (nextPlayerindex === -1) return null;

    return nextPlayerindex;
  }

  nextInterviewee(allPlayers: PlayerData[]): PlayerData {
    const availablePlayers = allPlayers.filter(
      (player) => !player.hasInterviewed && !player.interviewer
    );

    const newInterviewee =
      allPlayers[this.chooseNext(availablePlayers, allPlayers)];

    if (newInterviewee != null) {
      newInterviewee.interviewee = true;
      newInterviewee.hasInterviewed = true;
      return newInterviewee;
    }
    return null;
  }

  nextInterviewer = (allPlayers: PlayerData[]) => {
    let availablePlayers = allPlayers.filter(
      (player) => !player.hasBeenInterviewer && !player.interviewee
    );

    if (availablePlayers.length <= 0) {
      allPlayers.forEach((player) => {
        player.hasBeenInterviewer = false;
      });
      availablePlayers = allPlayers;
    }

    const newInterviewer =
      allPlayers[this.chooseNext(availablePlayers, allPlayers)];

    if (newInterviewer !== null) {
      allPlayers.forEach((player) => {
        player.interviewer = false;
      });
      newInterviewer.interviewer = true;
      newInterviewer.hasBeenInterviewer = true;
      return newInterviewer;
    }
    return null;
  };

  assignNewRoles(allPlayers: PlayerData[]): {
    interviewer: PlayerData;
    interviewee: PlayerData;
  } {
    return {
      interviewer: this.nextInterviewer(allPlayers),
      interviewee: this.nextInterviewee(allPlayers),
    };
  }

  assignPoints(
    recipientSocketId: string,
    allPlayers: PlayerData[]
  ): PlayerData {
    const playerReceivingPoint = allPlayers.find(
      (player) => player.socketId == recipientSocketId
    );
    playerReceivingPoint.points++;
    return playerReceivingPoint;
  }
}
