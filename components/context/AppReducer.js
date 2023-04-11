export const initialState = {
  Socket: null,
  RoomNumber: "",
  CurrentPhase: "",
  PlayerData: {
    socketId: "",
    name: "",
    interviewer: false,
    interviewee: false,
    hasInterviewed: false,
    ready: false,
    points: 0,
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

    case "REPLACE_STATE":
      return action.payload;

    default:
      return state;
  }
};
