type PlayerData = {
  socketId: string;
  name: string;
  interviewer: boolean;
  interviewee: boolean;
  hasInterviewed: boolean;
  hasBeenInterviewer: boolean;
  ready: boolean;
  hasSubmittedCards: boolean;
  points: number;
  phraseCards: string[];
};

type ReadyPlayerData = {
  displayName: string;
  ready: boolean;
};

type HiringListEntry = {
  socketId: string;
  name: string;
};

type Role = "Interviewer" | "Interviewee";

type PlayerRoleData = {
  player: PlayerData;
  role: Role;
};

interface ServerToClientEvents {
  connect: () => void;
  connectError: () => void;
  updateRoomData: (room: string) => void;
  setGameMode: (gameMode: import("@/lib/enums").GAME_MODE) => void;
  updatePlayerData: (newPlayerData: IPlayerData) => void;
  setGamePhase: (newPhase: GAME_PHASE) => void;
  updatePlayerList: (readyPlayerData: ReadyPlayerData[]) => void;
  setCanStart: (canStart: boolean) => void;
  updateCurrentInterviewer: (interviewerName: string) => void;
  updateCurrentInterviewee: (intervieweeName: string) => void;
  updateCurrentJob: (jobTitle: string) => void;
  cardPlayed: (cardText: string) => void;
  populateHiringList: (hiringList: HiringListEntry[]) => void;
  setGameWinner: (winnerName: string) => void;
  resetSubmissionData: () => void;
}

interface ClientToServerEvents {
  newUser: (userData: { displayName: string; roomNumber: string }) => void;
  toggleReady: (roomNumber: string) => void;
  startGame: (roomNumber: string) => void;
  submitPlayerCards: (submissionData: {
    socketId: string;
    roomNumber: string;
    jobs: string[];
    phrases: string[];
  }) => void;
  playCard: (cardData: { cardText: string; roomNumber: string }) => void;
  turnEnded: (roomNumber: string) => void;
  roundWinnerSelected: (winnerData: {
    roomNumber: string;
    winnerSocketId: string;
  }) => void;
  resetGame: (resetData: { roomNumber: string; useNewCards: boolean }) => void;
}
