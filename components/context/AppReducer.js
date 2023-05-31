export const initialState = {
  RoomNumber: "",
  CurrentPhase: "",
  CurrentPhrase: "",
  CanStart: false,
  CurrentInterviewer: "",
  CurrentInterviewee: "",
  CurrentJob: "",
  GameWinner: "",
  HiringList: [],
  SubmittedCards: {
    job: 0,
    phrase: 0,
  },
  ReadyPlayerData: [{ displayName: "Test", ready: false }],
  PlayerData: {
    socketId: "",
    name: "",
    interviewer: false,
    interviewee: false,
    hasInterviewed: false,
    hasBeenInterviewer: false,
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
      if (action.value == "Submission Phase") {
        sessionStorage.removeItem("phraseCards");
        sessionStorage.removeItem("jobCards");
        return {
          ...state,
          CurrentPhase: action.value,
          SubmittedCards: {
            job: 0,
            phrase: 0,
          },
        };
      }
      return {
        ...state,
        CurrentPhase: action.value,
      };

    case "SET_CAN_START":
      return {
        ...state,
        CanStart: action.value,
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

    case "SET_CURRENT_PHRASE":
      return {
        ...state,
        CurrentPhrase: action.value,
      };

    case "SET_GAME_WINNER":
      return {
        ...state,
        GameWinner: action.value,
      };

    case "POPULATE_HIRING_LIST":
      return {
        ...state,
        HiringList: action.value,
      };

    case "INCREASE_SUBMITTED_JOB_CARDS":
      return {
        ...state,
        SubmittedCards: {
          ...state.SubmittedCards,
          job: state.SubmittedCards.job++,
        },
      };

    case "INCREASE_SUBMITTED_PHRASE_CARDS":
      return {
        ...state,
        SubmittedCards: {
          ...state.SubmittedCards,
          phrase: state.SubmittedCards.phrase++,
        },
      };

    case "RESET_SUBMISSION_DATA":
      return {
        ...state,
        SubmittedCards: {
          job: 0,
          phrase: 0,
        },
      };

    case "REPLACE_STATE":
      return action.payload;

    default:
      return state;
  }
};
