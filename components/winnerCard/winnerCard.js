import { useAppContext } from "../context/AppContext";
import { socket } from "../context/SocketWrapper";

const WinnerCard = ({ winnerName }) => {
  const { state } = useAppContext();

  const handleClick = (e, newCards = false) => {
    e.preventDefault();
    const resetData = {
      useNewCards: newCards,
      roomNumber: state.RoomNumber,
    };
    socket.emit("resetGame", resetData);
  };

  return (
    <div className="card mb-3">
      <h3 className="font-weight-bold card-header">Winner:</h3>
      <br />
      <h1>{winnerName}</h1>
      <br />

      <button
        href="#"
        className="replaySameCardsBtn btn btn-primary m-3"
        onClick={(e) => {
          handleClick(e);
        }}
      >
        New Game with Same Cards
      </button>
      <button
        href="#"
        className="replayReuseCardsBtn btn btn-primary m-3"
        onClick={(e) => {
          handleClick(e, true);
        }}
      >
        New Game with New Cards
      </button>
    </div>
  );
};

export default WinnerCard;
