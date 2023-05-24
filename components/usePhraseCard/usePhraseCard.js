import { socket } from "../context/SocketWrapper";
import { useAppContext } from "../context/AppContext";

const UsePhraseCard = ({ phrase }) => {
  const { state } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("playCard", { cardText: phrase, roomNumber: state.RoomNumber });
  };

  return (
    <div className="card text-center">
      <div className="card-body">
        <h5 className="card-title phrase1" value={phrase || ""}>
          {phrase}
        </h5>
        <button
          href="#"
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
