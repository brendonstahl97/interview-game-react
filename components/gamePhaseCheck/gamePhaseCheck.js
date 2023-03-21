const GamePhaseCheck = ({ currentPhase, allowedPhases = [], children }) => {
  if (allowedPhases.includes(currentPhase)) {
    return <>{children}</>;
  } else {
    return <></>;
  }
};

export default GamePhaseCheck;
