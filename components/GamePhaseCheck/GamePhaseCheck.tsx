import { ReactElement } from "react";
import { useAppContext } from "../context/AppContext";

interface IGamePhaseCheckProps {
  allowedPhases: GAME_PHASE[];
  children: ReactElement;
}

const GamePhaseCheck = ({
  allowedPhases = [],
  children,
}: IGamePhaseCheckProps) => {
  const { state } = useAppContext();

  if (allowedPhases.includes(state.CurrentPhase)) {
    return <>{children}</>;
  } else {
    return <></>;
  }
};

export default GamePhaseCheck;
