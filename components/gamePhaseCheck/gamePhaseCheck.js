import { useAppContext } from "../context/AppContext";

const GamePhaseCheck = ({ allowedPhases = [], children }) => {
  const { state } = useAppContext();

  if (allowedPhases.includes(state.CurrentPhase)) {
    return <>{children}</>;
  } else {
    return <></>;
  }
};

export default GamePhaseCheck;
