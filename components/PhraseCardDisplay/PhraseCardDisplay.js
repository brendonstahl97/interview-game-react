import UsePhraseCard from "../UsePhraseCard/UsePhraseCard";
import { useAppContext } from "../context/AppContext";

const PhraseCardDisplay = () => {
  const { state } = useAppContext();

  if (state.PlayerData.interviewee) {
    return (
      <div className="cards col-md-12 mb-3 mt-3">
        <div className="row d-flex justify-content-center">
          <div className="col-md-4">
            <UsePhraseCard phrase={state.PlayerData.phraseCards[0]} />
          </div>
          <div className="col-md-4">
            <UsePhraseCard phrase={state.PlayerData.phraseCards[1]} />
          </div>
          <div className="col-md-4">
            <UsePhraseCard phrase={state.PlayerData.phraseCards[2]} />
          </div>

          <div className="row mt-3 d-flex justify-content-center">
            <div className="col-md-4">
              <UsePhraseCard phrase={state.PlayerData.phraseCards[3]} />
            </div>
            <div className="col-md-4">
              <UsePhraseCard phrase={state.PlayerData.phraseCards[4]} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (<></>);
};

export default PhraseCardDisplay;
