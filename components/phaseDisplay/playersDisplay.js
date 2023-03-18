import ReadyPlayerDisplay from "../readyPlayerDisplay/readyPlayerDisplay";

const PlayersDisplay = ({ children }) => {
  return (
    <div className="card mb-3">
      <h3 className="card-header">Players:</h3>
      <div className="card-body">

        <ReadyPlayerDisplay playerName={"Test Player 1"}  ready/>
        <ReadyPlayerDisplay playerName={"Test Player 2"} />

      </div>
    </div>
  );
};

export default PlayersDisplay;
