import EndTurnCard from "@/components/endTurnCard/endTurnCard";
import GameInfoCard from "@/components/gameInfoCard/gameInfoCard";
import GameInfoDisplay from "@/components/gameInfoDisplay/gameInfoDisplay";
import PhaseDisplay from "@/components/phaseDisplay/phaseDisplay";
import PlayersDisplay from "@/components/playersDisplay/playersDisplay";
import SubmissionSection from "@/components/sumbissionSection/SubmissionSection";
import UsePhraseCard from "@/components/usePhraseCard/usePhraseCard";
import WinnerCard from "@/components/winnerCard/winnerCard";
import GamePhaseCheck from "@/components/gamePhaseCheck/gamePhaseCheck";
import { useAppContext } from "@/components/context/AppContext";

const Game = () => {
  const { state } = useAppContext();
  return (
    <>
      <div className="roombg_image col-12">
        <div className="jumbotron jumbotron-fluid text-center pt-3 pb-2">
          <div className="container">
            <h1 className="display-4">The Interview Game</h1>
            <div className="container">
              <div className="row">
                <div className="col-sm">
                  <GameInfoDisplay
                    baseText={"Room Number"}
                    value={state.RoomNumber}
                  />
                </div>
                <div className="col-sm">
                  <GameInfoDisplay baseText={"Job Name"} value={state.CurrentJob} />
                </div>
                <div className="col-sm">
                  <GameInfoDisplay
                    baseText={"Display Name"}
                    value={state.PlayerData.name}
                  />
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                <div className="col-md-4 mt-2">
                  <GameInfoDisplay baseText={"Interviewer"} value={state.CurrentInterviewer} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row d-flex justify-content-center text-center">
          <GamePhaseCheck
            allowedPhases={["Interview Phase", "Employment Phase"]}
          >
            <div className="col-md-2 col-sm-6 pt-4">
              <GameInfoCard
                headerText="Your Points"
                value={state.PlayerData.points}
              />
            </div>
          </GamePhaseCheck>
          <GamePhaseCheck allowedPhases={["Setup Phase"]}>
            <div className="gameStarterDiv col-md-3 col-sm-6 pt-4">
              <PhaseDisplay />
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck
            allowedPhases={["Interview Phase", "Employment Phase"]}
          >
            <div className="col-md-2 col-sm-6 pt-4">
              <GameInfoCard headerText="Current Interviewee" value={state.CurrentInterviewee} />
            </div>
          </GamePhaseCheck>
        </div>
      </div>

      <div className="row d-flex justify-content-center">
        <div className="col-md-5 col-sm-8 left-side">
          <GamePhaseCheck allowedPhases={["Setup Phase"]}>
            <div className="col-md-12 mt-3 mb-3 text-center playerListCard">
              <PlayersDisplay></PlayersDisplay>
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck allowedPhases={["Winner Phase"]}>
            <div className="col-md-12 mt-3 mb-3 text-center winnerCard">
              <WinnerCard winnerName="Some Guy!!!" />
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck allowedPhases={["Submission Phase"]}>
            <SubmissionSection />
          </GamePhaseCheck>

          <GamePhaseCheck allowedPhases={["Interview Phase"]}>
            <div className="currentCard col-md-12 mt-3 mb-3 text-center">
              <GameInfoCard headerText="Phrase in Use" value="Phrase 1" large />
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck allowedPhases={["Employment Phase"]}>
            <div className="hiringList">Hiring List Placeholder</div>
          </GamePhaseCheck>

          <GamePhaseCheck allowedPhases={["Interview Phase"]}>
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
          </GamePhaseCheck>
        </div>

        <GamePhaseCheck allowedPhases={["Interview Phase"]}>
          <div className="row d-flex justify-content-center">
            <div className="col-md-3 col-sm-6">
              <EndTurnCard />
            </div>
          </div>
        </GamePhaseCheck>
      </div>

      <br />
    </>
  );
};

export default Game;
