import { MouseEvent } from "react";

type EndTurnCardProps = { 
  handleEndTurn: (e: MouseEvent<HTMLButtonElement>) => void
};

const EndTurnCard = ({ handleEndTurn }: EndTurnCardProps) => {
  return (
    <div className="card text-center mb-3">
      <div className="card-body">
        <button
          className="endTurn btn btn-primary"
          onClick={(e) => {
            handleEndTurn(e);
          }}
        >
          End Turn
        </button>
      </div>
    </div>
  );
};

export default EndTurnCard;
