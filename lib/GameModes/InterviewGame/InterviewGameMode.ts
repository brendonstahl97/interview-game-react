import { GAME_MODE } from "@/lib/enums";
import { GamemodeStrategy } from "../GameMode";
import { Server } from "socket.io";
import Game from "@/lib/Game/Game";

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

  getNextInterviewer = (allPlayers: PlayerData[]): PlayerData => {
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

  assignNewRoles(allPlayers: PlayerData[]): PlayerRoleData[] {
    return [
      {
        player: this.getNextInterviewer(allPlayers),
        role: "Interviewer",
      },
      {
        player: this.nextInterviewee(allPlayers),
        role: "Interviewee",
      },
    ];
  }

  resetForRound(players: PlayerData[]): void {
    players.forEach((player) => {
      player.hasInterviewed = false;
      player.interviewee = false;
      player.interviewer = false;
    });
  }

  fullPlayerReset(players: PlayerData[]): void {
    this.resetForRound(players);
    players.forEach((player) => {
      player.points = 0;
      player.hasBeenInterviewer = false;
      player.hasSubmittedCards = false;
    });
  }

  nextRound(players: PlayerData[], io: Server, game: Game): void {
    this.resetForRound(players);
    const newRoles = this.assignNewRoles(players);
    
    newRoles.forEach((playerRole) => {
      if (playerRole.role === "Interviewee") {
        io.to(game.room).emit(
          "updateCurrentInterviewee",
          playerRole.player.name
        );
      } else if (playerRole.role === "Interviewer") {
        io.to(game.room).emit(
          "updateCurrentInterviewer",
          playerRole.player.name
        );
      }
    });
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

  generateHiringList(players: PlayerData[]): HiringListEntry[] {
    const hiringList: HiringListEntry[] = [];

    players.map((player) => {
      if (!player.interviewee) return;
      const applicantData = {
        name: player.name,
        socketId: player.socketId,
      };

      hiringList.push(applicantData);
    });

    return hiringList;
  }

  checkForWinner(scoreToWin: number, players: PlayerData[]): string {
    let winner = null;
    players.forEach((player) => {
      if (player.points >= scoreToWin) {
        winner = player.name;
      }
    });
    return winner;
  }
}
