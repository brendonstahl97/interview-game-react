import { useState } from "react";
import UsePhraseCard from "../UsePhraseCard/UsePhraseCard";
import EndTurnCard from "../EndTurnCard/EndTurnCard";
import { useAppContext } from "../context/AppContext";

const PhraseCardDisplay = () => {
  const { state } = useAppContext();
  const [cardsPlayedCount, setCardsPlayedCount] = useState(0);

  const incrementCardsPlayedCount = () => {
    setCardsPlayedCount(cardsPlayedCount + 1);
  };

  if (state.PlayerData.interviewee) {
    return (
      <>
        <div className="cards col-md-12 mb-3 mt-3">
          <div className="row d-flex justify-content-center">
            <div className="col-md-4">
              <UsePhraseCard
                phrase={state.PlayerData.phraseCards[0]}
                increaseCardsPlayed={incrementCardsPlayedCount}
              />
            </div>
            <div className="col-md-4">
              <UsePhraseCard
                phrase={state.PlayerData.phraseCards[1]}
                increaseCardsPlayed={incrementCardsPlayedCount}
              />
            </div>
            <div className="col-md-4">
              <UsePhraseCard
                phrase={state.PlayerData.phraseCards[2]}
                increaseCardsPlayed={incrementCardsPlayedCount}
              />
            </div>

            <div className="row mt-3 d-flex justify-content-center">
              <div className="col-md-4">
                <UsePhraseCard
                  phrase={state.PlayerData.phraseCards[3]}
                  increaseCardsPlayed={incrementCardsPlayedCount}
                />
              </div>
              <div className="col-md-4">
                <UsePhraseCard
                  phrase={state.PlayerData.phraseCards[4]}
                  increaseCardsPlayed={incrementCardsPlayedCount}
                />
              </div>
            </div>
          </div>
        </div>
        {cardsPlayedCount.current >= state.PlayerData.phraseCards.length && (
          <div className="row d-flex justify-content-center">
            <div className="col-md-3 col-sm-6">
              <EndTurnCard />
            </div>
          </div>
        )}
      </>
    );
  }

  return <></>;
};

export default PhraseCardDisplay;
