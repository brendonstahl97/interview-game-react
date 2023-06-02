import { socket } from "../context/SocketWrapper";
import { useAppContext } from "../context/AppContext";
import { MouseEvent } from "react";

type UsePhraseCardProps = {
  phrase: string;
  increaseCardsPlayed: () => void;
};

const UsePhraseCard = ({ phrase, increaseCardsPlayed }: UsePhraseCardProps) => {
  const { state } = useAppContext();

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    socket.emit("playCard", { cardText: phrase, roomNumber: state.RoomNumber });
    e.currentTarget.disabled = true;
    increaseCardsPlayed();
  };

  return (
    <div className="card text-center">
      <div className="card-body">
        <h5 className="card-title phrase1">{phrase}</h5>
        <button
          className="phraseCard btn btn-primary"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Use Now!
        </button>
      </div>
    </div>
  );
};

export default UsePhraseCard;
