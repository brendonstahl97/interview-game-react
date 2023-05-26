import { useAppContext } from "../context/AppContext";

const HiringList = () => {
  const { state } = useAppContext();

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
