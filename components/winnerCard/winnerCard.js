const WinnerCard = ({ winnerName }) => {
  return (
    <div className="card mb-3">
      <h3 className="font-weight-bold card-header">Winner:</h3>
      <br />
      <h1>{winnerName}</h1>
      <br />

      <button href="#" className="replaySameCardsBtn btn btn-primary m-3">
        New Game with Same Cards
      </button>
      <button href="#" className="replayReuseCardsBtn btn btn-primary m-3">
        New Game with New Cards
      </button>
    </div>
  );
};

export default WinnerCard;
