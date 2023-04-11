import { socket } from "../context/socket-wrapper";
import { useAppContext } from "../context/AppContext";

const PhaseDisplay = () => {
  const { state } = useAppContext();

  const handleReadyClick = (e) => {
    e.preventDefault();
    socket.emit("toggleReady", state.RoomNumber);
  };

  const handleStartClick = (e) => {
    e.preventDefault();
    socket.emit("startGame", state.RoomNumber);
  }

  return (
    <div className="card mb-3 text-center">
      <h5 className="font-weight-bold card-header">Current Phase: 1</h5>
      <div className="card-body">
        <h5 className="card-title"></h5>
        <button
          href="#"
          className="readyBtn btn btn-primary mb-3"
          onClick={handleReadyClick}
        >
          Ready
        </button>
        <br />
        <button
          href="#"
          className="startBtn btn btn-primary"
          onClick={handleStartClick}
          disabled={!state.CanStart}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default PhaseDisplay;
