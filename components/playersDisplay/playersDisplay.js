import ReadyPlayerDisplay from "../readyPlayerDisplay/readyPlayerDisplay";
import { socket } from "../context/socket-wrapper";
import { useEffect, useState } from "react";

const PlayersDisplay = () => {
  const [readyPlayerData, setReadyPlayerData] = useState([
    { displayName: "Test", ready: false },
  ]);

  useEffect(() => {
    console.log(readyPlayerData);
  }, [readyPlayerData]);

  socket.on("updatePlayerList", (playerData) => {
    setReadyPlayerData(playerData);
  });

  return (
    <div className="card mb-3">
      <h3 className="card-header">Players:</h3>
      <div className="card-body">
        {readyPlayerData.map((player, i) => {
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
