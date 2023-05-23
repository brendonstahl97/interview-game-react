export const initialState = {
  Socket: null,
  RoomNumber: "",
  CurrentPhase: "",
  CanStart: false,
  CurrentInterviewer: "",
  CurrentInterviewee: "",
  CurrentJob: "",
  ReadyPlayerData: [{ displayName: "Test", ready: false }],
  PlayerData: {
    socketId: "",
    name: "",
    interviewer: false,
    interviewee: false,
    hasInterviewed: false,
    ready: false,
    hasSubmittedCards: false,
    points: 0,
    phraseCards: [],
  },
};

export const AppReducer = (state, action) => {
  switch (action.type) {
    case "SET_ROOM_NUMBER":
      return {
        ...state,
        RoomNumber: action.value,
      };

    case "SET_PLAYER_DATA":
      return {
        ...state,
        PlayerData: action.value,
      };

    case "SET_READY_PLAYER_DATA":
      return {
        ...state,
        ReadyPlayerData: action.value,
      };

    case "SET_SOCKET":
      return {
        ...state,
        Socket: action.value,
      };

    case "SET_GAME_PHASE":
      return {
        ...state,
        CurrentPhase: action.value,
      };

    case "SET_CAN_START":
      return {
        ...state,
        CanStart: action.value,
      };

    case "SET_PLAYER_PHRASE_CARDS":
      return {
        ...state,
        PlayerData: {
          ...state.PlayerData,
          phraseCards: action.value,
        },
      };

    case "SET_CURRENT_INTERVIEWER":
      return {
        ...state,
        CurrentInterviewer: action.value,
      };

    case "SET_CURRENT_INTERVIEWEE":
      return {
        ...state,
        CurrentInterviewee: action.value,
      };

    case "SET_CURRENT_JOB":
      return {
        ...state,
        CurrentJob: action.value,
      };

    case "REPLACE_STATE":
      return action.payload;

    default:
      return state;
  }
};
