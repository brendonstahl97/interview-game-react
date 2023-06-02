import {
  Dispatch,
  ReactElement,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from "react";
import {
  AppReducer,
  initialState,
  stateType,
  ReducerAction,
} from "./AppReducer";

const AppContext = createContext<{
  state: stateType;
  dispatch: Dispatch<ReducerAction>;
}>(null);

const AppWrapper = ({ children }: { children: ReactElement }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

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
