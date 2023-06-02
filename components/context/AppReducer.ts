export type stateType = {
  RoomNumber: string;
  CurrentPhase: string;
  CurrentPhrase: string;
  CanStart: boolean;
  CurrentInterviewer: string;
  CurrentInterviewee: string;
  CurrentJob: string;
  GameWinner: string;
  HiringList: HiringListEntry[];
  SubmittedCards: {
    job: number;
    phrase: number;
  };
  ReadyPlayerData: ReadyPlayerData[];
  PlayerData: PlayerData;
};

export const initialState: stateType = {
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

export const enum REDUCER_ACTION_TYPE {
  SET_ROOM_NUMBER,
  SET_PLAYER_DATA,
  SET_READY_PLAYER_DATA,
  SET_SOCKET,
  SET_GAME_PHASE,
  SET_CAN_START,
  SET_CURRENT_INTERVIEWER,
  SET_CURRENT_INTERVIEWEE,
  SET_CURRENT_JOB,
  SET_CURRENT_PHRASE,
  SET_GAME_WINNER,
  POPULATE_HIRING_LIST,
  INCREASE_SUBMITTED_JOB_CARDS,
  INCREASE_SUBMITTED_PHRASE_CARDS,
  RESET_SUBMISSION_DATA,
  REPLACE_STATE,
}

export type ReducerAction =
  | {
      type: REDUCER_ACTION_TYPE.SET_ROOM_NUMBER;
      value: string;
    }
  | {
      type: REDUCER_ACTION_TYPE.SET_PLAYER_DATA;
      value: PlayerData;
    }
  | {
      type: REDUCER_ACTION_TYPE.SET_READY_PLAYER_DATA;
      value: ReadyPlayerData[];
    }
  | {
      type: REDUCER_ACTION_TYPE.SET_GAME_PHASE;
      value: string;
    }
  | {
      type: REDUCER_ACTION_TYPE.SET_CAN_START;
      value: boolean;
    }
  | {
      type: REDUCER_ACTION_TYPE.SET_CURRENT_INTERVIEWER;
      value: string;
    }
  | {
      type: REDUCER_ACTION_TYPE.SET_CURRENT_INTERVIEWEE;
      value: string;
    }
  | {
      type: REDUCER_ACTION_TYPE.SET_CURRENT_JOB;
      value: string;
    }
  | {
      type: REDUCER_ACTION_TYPE.SET_CURRENT_PHRASE;
      value: string;
    }
  | {
      type: REDUCER_ACTION_TYPE.SET_GAME_WINNER;
      value: string;
    }
  | {
      type: REDUCER_ACTION_TYPE.POPULATE_HIRING_LIST;
      value: HiringListEntry[];
    }
  | {
      type: REDUCER_ACTION_TYPE.INCREASE_SUBMITTED_JOB_CARDS;
    }
  | {
      type: REDUCER_ACTION_TYPE.INCREASE_SUBMITTED_PHRASE_CARDS;
    }
  | {
      type: REDUCER_ACTION_TYPE.RESET_SUBMISSION_DATA;
    };

export const AppReducer = (
  state: stateType,
  action: ReducerAction
): stateType => {
  switch (action.type) {
    case REDUCER_ACTION_TYPE.SET_ROOM_NUMBER:
      return {
        ...state,
        RoomNumber: action.value,
      };

    case REDUCER_ACTION_TYPE.SET_PLAYER_DATA:
      return {
        ...state,
        PlayerData: action.value,
      };

    case REDUCER_ACTION_TYPE.SET_READY_PLAYER_DATA:
      return {
        ...state,
        ReadyPlayerData: action.value,
      };

    case REDUCER_ACTION_TYPE.SET_GAME_PHASE:
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

    case REDUCER_ACTION_TYPE.SET_CAN_START:
      return {
        ...state,
        CanStart: action.value,
      };

    case REDUCER_ACTION_TYPE.SET_CURRENT_INTERVIEWER:
      return {
        ...state,
        CurrentInterviewer: action.value,
      };

    case REDUCER_ACTION_TYPE.SET_CURRENT_INTERVIEWEE:
      return {
        ...state,
        CurrentInterviewee: action.value,
      };

    case REDUCER_ACTION_TYPE.SET_CURRENT_JOB:
      return {
        ...state,
        CurrentJob: action.value,
      };

    case REDUCER_ACTION_TYPE.SET_CURRENT_PHRASE:
      return {
        ...state,
        CurrentPhrase: action.value,
      };

    case REDUCER_ACTION_TYPE.SET_GAME_WINNER:
      return {
        ...state,
        GameWinner: action.value,
      };

    case REDUCER_ACTION_TYPE.POPULATE_HIRING_LIST:
      return {
        ...state,
        HiringList: action.value,
      };

    case REDUCER_ACTION_TYPE.INCREASE_SUBMITTED_JOB_CARDS:
      return {
        ...state,
        SubmittedCards: {
          ...state.SubmittedCards,
          job: state.SubmittedCards.job++,
        },
      };

    case REDUCER_ACTION_TYPE.INCREASE_SUBMITTED_PHRASE_CARDS:
      return {
        ...state,
        SubmittedCards: {
          ...state.SubmittedCards,
          phrase: state.SubmittedCards.phrase++,
        },
      };

    case REDUCER_ACTION_TYPE.RESET_SUBMISSION_DATA:
      return {
        ...state,
        SubmittedCards: {
          job: 0,
          phrase: 0,
        },
      };

    default:
      return state;
  }
};
