export const initialState = {
  DisplayName: "",
};

export const AppReducer = (state, action) => {
  switch (action.type) {
    case "SET_DISPLAY_NAME":
      return {
        ...state,
        DisplayName: action.value,
      };
    case "REPLACE_STATE":
      return action.payload;

    default:
      return state;
  }
};
