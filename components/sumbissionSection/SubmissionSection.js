import { useEffect, useRef } from "react";
import { socket } from "../context/SocketWrapper";
import { useAppContext } from "../context/AppContext";
import SubmissionCard from "../SubmissionCard/SubmissionCard";

const SubmissionSection = () => {
  const { state, dispatch } = useAppContext();

  const requiredCards = useRef({
    job: state.ReadyPlayerData.length,
    phrase: state.ReadyPlayerData.length * 2,
  });

  useEffect(() => {
    if (
      state.SubmittedCards.job == requiredCards.current.job &&
      state.SubmittedCards.phrase == requiredCards.current.phrase
    ) {
      const data = {
        socketId: socket.id,
        roomNumber: state.RoomNumber,
        jobs: JSON.parse(sessionStorage.getItem("jobCards")),
        phrases: JSON.parse(sessionStorage.getItem("phraseCards")),
      };
      socket.emit("submitPlayerCards", data);
    }
  }, [state.SubmittedCards, state.RoomNumber]);

  const SubmitCard = (value, isPhraseCard) => {
    let cards;
    const storageItem = isPhraseCard ? "phraseCards" : "jobCards";

    cards = JSON.parse(sessionStorage.getItem(storageItem)) || [];
    cards.push(value);
    sessionStorage.setItem(storageItem, JSON.stringify(cards));

    if (isPhraseCard) {
      dispatch({ type: "INCREASE_SUBMITTED_PHRASE_CARDS" });
      return;
    }
    dispatch({ type: "INCREASE_SUBMITTED_JOB_CARDS" });
  };

  return (
    <div className="submissions col-md-12 hld mt-3">
      <div className="row">
        <div className="col-sm-6">
          <SubmissionCard
            SubmitCard={SubmitCard}
            submitQuotaMet={
              requiredCards.current.phrase == state.SubmittedCards.phrase
            }
            phrase
          />
        </div>
        <div className="col-sm-6">
          <SubmissionCard
            SubmitCard={SubmitCard}
            submitQuotaMet={
              requiredCards.current.job == state.SubmittedCards.job
            }
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionSection;
