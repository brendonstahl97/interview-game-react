import { useEffect, useRef, useState } from "react";
import { socket } from "../context/socket-wrapper";
import { useAppContext } from "../context/AppContext";
import SubmissionCard from "../submissionCard/submissionCard";

const SubmissionSection = () => {
  const { state } = useAppContext();

  const requiredCards = useRef({
    job: state.ReadyPlayerData.length,
    phrase: state.ReadyPlayerData.length * 2,
  });

  const [submittedCards, setSubmittedCards] = useState({
    job: 0,
    phrase: 0,
  });

  useEffect(() => {
    if (
      submittedCards.job == requiredCards.current.job &&
      submittedCards.phrase == requiredCards.current.phrase
    ) {
      const data = {
        socketId: socket.id,
        roomNumber: state.RoomNumber,
        jobs: JSON.parse(localStorage.getItem("jobCards")),
        phrases: JSON.parse(localStorage.getItem("phraseCards")),
      };
      socket.emit("submitPlayerCards", data);
    }
  }, [submittedCards]);

  const SubmitCard = (value, isPhraseCard) => {
    let cards;
    const storageItem = isPhraseCard ? "phraseCards" : "jobCards";

    cards = JSON.parse(localStorage.getItem(storageItem)) || [];
    cards.push(value);
    localStorage.setItem(storageItem, JSON.stringify(cards));

    if (isPhraseCard) {
      setSubmittedCards({
        ...submittedCards,
        phrase: submittedCards.phrase + 1,
      });
      return;
    }
    setSubmittedCards({
      ...submittedCards,
      job: submittedCards.job + 1,
    });
  };

  return (
    <div className="submissions col-md-12 hld mt-3">
      <div className="row">
        <div className="col-sm-6">
          <SubmissionCard
            SubmitCard={SubmitCard}
            submitQuotaMet={
              requiredCards.current.phrase == submittedCards.phrase
            }
            phrase
          />
        </div>
        <div className="col-sm-6">
          <SubmissionCard
            SubmitCard={SubmitCard}
            submitQuotaMet={requiredCards.current.job == submittedCards.job}
          />
        </div>
      </div>
    </div>
  );
};

export default SubmissionSection;
