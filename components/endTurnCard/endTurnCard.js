const EndTurnCard = ({ handleEndTurn }) => {
  return (
    <div className="card text-center mb-3">
      <div className="card-body">
        <button
          href="#"
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
