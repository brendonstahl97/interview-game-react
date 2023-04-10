export const initialState = {
  Socket: null,
  DisplayName: "",
  RoomNumber: "",
};

export const AppReducer = (state, action) => {
  switch (action.type) {
    case "SET_DISPLAY_NAME":
      return {
        ...state,
        DisplayName: action.value,
      };

    case "SET_ROOM_NUMBER":
      return {
        ...state,
        RoomNumber: action.value,
      };

      case "SET_SOCKET": 
      return {
        ...state,
        Socket: action.value,
      }

    case "REPLACE_STATE":
      return action.payload;

    default:
      return state;
  }
};
