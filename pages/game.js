import EndTurnCard from "@/components/EndTurnCard/EndTurnCard";
import GameInfoCard from "@/components/GameInfoCard/GameInfoCard";
import GameInfoDisplay from "@/components/GameInfoDisplay/GameInfoDisplay";
import PhaseDisplay from "@/components/PhaseDisplay/PhaseDisplay";
import PlayersDisplay from "@/components/PlayersDisplay/PlayersDisplay";
import SubmissionSection from "@/components/SumbissionSection/SubmissionSection";
import WinnerCard from "@/components/WinnerCard/WinnerCard";
import GamePhaseCheck from "@/components/GamePhaseCheck/GamePhaseCheck";
import { useAppContext } from "@/components/context/AppContext";
import PhraseCardDisplay from "@/components/PhraseCardDisplay/PhraseCardDisplay";
import HiringList from "@/components/HiringList/HiringList";

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
                  <GameInfoDisplay
                    baseText={"Job Name"}
                    value={state.CurrentJob}
                  />
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
                  <GameInfoDisplay
                    baseText={"Interviewer"}
                    value={state.CurrentInterviewer}
                  />
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
              <GameInfoCard
                headerText="Current Interviewee"
                value={state.CurrentInterviewee}
              />
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
              <WinnerCard winnerName={state.GameWinner} />
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck allowedPhases={["Submission Phase"]}>
            <SubmissionSection />
          </GamePhaseCheck>

          <GamePhaseCheck allowedPhases={["Interview Phase"]}>
            <div className="currentCard col-md-12 mt-3 mb-3 text-center">
              <GameInfoCard
                headerText="Phrase in Use"
                value={state.CurrentPhrase}
                large
              />
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck allowedPhases={["Employment Phase"]}>
            <HiringList />
          </GamePhaseCheck>

          <GamePhaseCheck allowedPhases={["Interview Phase"]}>
            <PhraseCardDisplay />
          </GamePhaseCheck>
        </div>
      </div>

      <br />
    </>
  );
};

export default Game;
