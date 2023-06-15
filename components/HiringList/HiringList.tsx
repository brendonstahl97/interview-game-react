import { MouseEvent } from "react";
import { useAppContext } from "../context/AppContext";
import { socket } from "../context/SocketWrapper";

const HiringList = () => {
  const { state } = useAppContext();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    socket.emit("roundWinnerSelected", {
      roomNumber: state.RoomNumber,
      winnerSocketId: e.currentTarget.value,
    });
  };

  if (state.PlayerData.interviewer) {
    return (
      <div className="hiring-list">
        {state.HiringList.map((applicant, i) => {
          return (
            <div className="col-4" key={i}>
              <div className="card text-center">
                <div className="card-body">
                  <button
                    className="phraseCard hire btn btn-primary"
                    value={applicant.socketId}
                    onClick={(e) => {
                      handleClick(e);
                    }}
                  >
                    {applicant.name}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return <></>;
};

export default HiringList;
