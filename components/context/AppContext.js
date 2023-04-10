import {
  useEffect,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react";
import { AppReducer, initialState } from "./AppReducer";

const AppContext = createContext();

const AppWrapper = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  useEffect(() => {
    // Check if state already exists in local storage
    if (!localStorage["state"]) {
      // If yes, replace current state with local storage
      dispatch({
        type: "REPLACE_STATE",
        value: JSON.parse(localStorage.getItem("state")),
      });
    }
  }, []);

  console.log(state);

  useEffect(() => {
    if (state !== initialState) {
      // Update state in local storage
      localStorage.setItem("state", JSON.stringify(state));
    }
  }, [state]);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined || context === null) {
    throw new Error(`useAppContext must be called within AppWrapper`);
  }
  return context;
};

export default AppWrapper;
