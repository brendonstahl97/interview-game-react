import { MouseEvent } from "react";
import { useAppContext } from "../context/AppContext";
import { socket } from "../context/SocketWrapper";

type WinnerCardProps = {
  winnerName: string;
};

const WinnerCard = ({ winnerName }: WinnerCardProps) => {
  const { state } = useAppContext();

  const handleClick = (e: MouseEvent<HTMLButtonElement>, newCards = false) => {
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
        className="replaySameCardsBtn btn btn-primary m-3"
        onClick={(e) => {
          handleClick(e);
        }}
      >
        New Game with Same Cards
      </button>
      <button
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
