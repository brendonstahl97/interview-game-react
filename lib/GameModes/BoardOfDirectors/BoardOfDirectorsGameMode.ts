import { GAME_MODE } from "@/lib/enums";
import { InterviewGameMode } from "../InterviewGame/InterviewGameMode";
import { GamemodeStrategy } from "../GameMode";

export class BoardOfDirectorsGameMode extends InterviewGameMode implements GamemodeStrategy {
  Name: GAME_MODE.INTERVIEW_GAME;
  private voteCount = 0;
  private votes: { [key: string]: number } = {};

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

  assignPoints(
    recipientSocketId: string,
    allPlayers: PlayerData[]
  ): PlayerData {
    // Assign vote to socketID in votes object
    this.votes[recipientSocketId] = this.votes[recipientSocketId]
      ? this.votes[recipientSocketId] + 1
      : 1;
    this.voteCount++;

    // Check if all players have voted
    if (this.voteCount! >= allPlayers.length) return null;

    let winningPlayerSocketId: string;
    let highestVoteCount = 0;

    // Determine which socketID has the most votes
    Object.keys(this.votes).forEach((key) => {
      if (this.votes[key] > highestVoteCount) {
        highestVoteCount = this.votes.key;
        winningPlayerSocketId = key;
      }
    });

    // Get player from socketID
    const playerReceivingPoint = allPlayers.find(
      (player) => player.socketId == winningPlayerSocketId
    );

    // Give point
    playerReceivingPoint.points += 1;

    // Reinitialize voting variables
    this.voteCount = 0;
    this.votes = {};

    return playerReceivingPoint;
  }
}
