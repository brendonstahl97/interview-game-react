import { ReactElement } from "react";
import { useAppContext } from "../context/AppContext";
import { GAME_PHASE } from "@/lib/enums";

interface IGamePhaseCheckProps {
  allowedPhases: GAME_PHASE[];
  isNot?: boolean;
  children: ReactElement;
}

const GamePhaseCheck = ({
  allowedPhases = [],
  children,
  isNot = false,
}: IGamePhaseCheckProps) => {
  const { state } = useAppContext();
  let condition = allowedPhases.includes(state.CurrentPhase);

  if (isNot) {
    condition = !condition;
  }

  if (condition) {
    return <>{children}</>;
  } else {
    return <></>;
  }
};

export default GamePhaseCheck;
