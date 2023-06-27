import { GAME_MODE } from "@/lib/enums";
import { GamemodeStrategy } from "../GameMode";
import Game from "@/lib/Game/Game";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export class BoardOfDirectorsGameMode implements GamemodeStrategy {
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

  nextRound(
    players: PlayerData[],
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    game: Game
  ): void {
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

  getNewInterviewers = (allPlayers: PlayerData[]): PlayerData[] => {
    let availablePlayers = allPlayers.filter(
      (player) => !player.hasBeenInterviewer && !player.interviewee
    );

    allPlayers.forEach((player) => {
      player.interviewer = false;
    });

    const newInterviewers: PlayerData[] = [];

    let numInterviewersRequired = allPlayers.length - 2;

    if (availablePlayers.length < numInterviewersRequired) {
      newInterviewers.push(...availablePlayers);

      allPlayers.forEach((player) => {
        player.hasBeenInterviewer = false;
      });

      availablePlayers.forEach((player) => (player.hasBeenInterviewer = true));
      numInterviewersRequired -= availablePlayers.length;

      availablePlayers = allPlayers.filter(
        (player) => player.hasBeenInterviewer === false
      );
    }

    for (let i = 0; i < numInterviewersRequired; i++) {
      const newInterviewer =
        allPlayers[this.chooseNext(availablePlayers, allPlayers)];
      if (newInterviewer === null) continue;

      newInterviewers.push(newInterviewer);

      newInterviewer.interviewer = true;
      newInterviewer.hasBeenInterviewer = true;
    }
    return newInterviewers;
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
    if (
      this.voteCount <
      allPlayers.filter((player) => {
        player.interviewer;
      }).length
    )
      return null;

    // find the round winner
    const playerReceivingPoint = this.evaluateRoundWinner(allPlayers);

    // Give point
    playerReceivingPoint.points += 1;

    // Reinitialize voting variables
    this.voteCount = 0;
    this.votes = {};

    return playerReceivingPoint;
  }

  evaluateRoundWinner = (allPlayers: PlayerData[]): PlayerData => {
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

    return playerReceivingPoint;
  };

  assignNewRoles(allPlayers: PlayerData[]): PlayerRoleData[] {
    const newRoles: PlayerRoleData[] = [];

    this.getNewInterviewers(allPlayers).forEach((interviewer) => {
      newRoles.push({
        player: interviewer,
        role: "Interviewer",
      });
    });

    newRoles.push({
      player: this.nextInterviewee(allPlayers),
      role: "Interviewee",
    });

    return newRoles;
  }
}
