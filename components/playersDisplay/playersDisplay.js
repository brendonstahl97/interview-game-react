import ReadyPlayerDisplay from "../readyPlayerDisplay/readyPlayerDisplay";
import { useAppContext } from "../context/AppContext";

const PlayersDisplay = () => {
  const { state } = useAppContext();

  return (
    <div className="card mb-3">
      <h3 className="card-header">Players:</h3>
      <div className="card-body">
        {state.ReadyPlayerData.map((player, i) => {
          return (
            <ReadyPlayerDisplay
              key={i}
              playerName={player.displayName}
              ready={player.ready}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlayersDisplay;
