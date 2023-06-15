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
import { GAME_PHASE } from "@/lib/enums";

const Game = () => {
  const { state } = useAppContext();
  return (
    <>
      <div className="jumbotron jumbotron-fluid text-center py-4">
        <div className="container">
          <h1 className="display-4 mb-3">The Interview Game</h1>

          <div className="container">
            <div className="row">
              <div className="col-sm">
                <GameInfoDisplay
                  baseText={"Room Number"}
                  value={state.RoomNumber}
                />
              </div>
              <GamePhaseCheck allowedPhases={[GAME_PHASE.SETUP_PHASE]} isNot>
                <div className="col-sm">
                  <GameInfoDisplay
                    baseText={"Game Mode"}
                    value={state.GameMode}
                  />
                </div>
              </GamePhaseCheck>
              <div className="col-sm">
                <GameInfoDisplay
                  baseText={"Display Name"}
                  value={state.PlayerData.name}
                />
              </div>
            </div>
            {/* <div className="row d-flex justify-content-center">
                <div className="col-md-4 mt-2">
                  <GameInfoDisplay
                    baseText={"Interviewer"}
                    value={state.CurrentInterviewer}
                  />
                </div>
              </div> */}
          </div>
        </div>
      </div>

      <section className="container-fluid d-flex flex-column justify-content-center">
        <div className="row d-flex justify-content-center text-center">
          <GamePhaseCheck
            allowedPhases={[
              GAME_PHASE.INTERVIEW_PHASE,
              GAME_PHASE.EMPLOYMENT_PHASE,
            ]}
          >
            <div className="col-8 pt-4">
              <GameInfoCard headerText="Job Title" value={state.CurrentJob} />
            </div>
          </GamePhaseCheck>
        </div>

        <div className="row d-flex justify-content-center text-center">
          <GamePhaseCheck
            allowedPhases={[
              GAME_PHASE.INTERVIEW_PHASE,
              GAME_PHASE.EMPLOYMENT_PHASE,
            ]}
          >
            <div className="col-4 pt-4">
              <GameInfoCard
                headerText="Your Points"
                value={state.PlayerData.points.toString()}
              />
            </div>
          </GamePhaseCheck>
          <GamePhaseCheck allowedPhases={[GAME_PHASE.SETUP_PHASE]}>
            <div className="gameStarterDiv col-md-3 col-sm-6 pt-4">
              <PhaseDisplay />
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck
            allowedPhases={[
              GAME_PHASE.INTERVIEW_PHASE,
              GAME_PHASE.EMPLOYMENT_PHASE,
            ]}
          >
            <div className="col-4 pt-4">
              <GameInfoCard
                headerText="Current Interviewee"
                value={state.CurrentInterviewee}
              />
            </div>
          </GamePhaseCheck>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-8 left-side">
            <GamePhaseCheck allowedPhases={[GAME_PHASE.SETUP_PHASE]}>
              <div className="col-md-12 mt-3 mb-3 text-center playerListCard">
                <PlayersDisplay></PlayersDisplay>
              </div>
            </GamePhaseCheck>

            <GamePhaseCheck allowedPhases={[GAME_PHASE.WINNER_PHASE]}>
              <div className="col-md-12 mt-3 mb-3 text-center winnerCard">
                <WinnerCard winnerName={state.GameWinner} />
              </div>
            </GamePhaseCheck>

            <GamePhaseCheck allowedPhases={[GAME_PHASE.SUBMISSION_PHASE]}>
              <SubmissionSection />
            </GamePhaseCheck>

            <GamePhaseCheck allowedPhases={[GAME_PHASE.INTERVIEW_PHASE]}>
              <div className="currentCard col-md-12 my-5 text-center">
                <GameInfoCard
                  headerText="Phrase in Use"
                  value={state.CurrentPhrase}
                  isLarge
                />
              </div>
            </GamePhaseCheck>

            <GamePhaseCheck allowedPhases={[GAME_PHASE.EMPLOYMENT_PHASE]}>
              <HiringList />
            </GamePhaseCheck>

            <GamePhaseCheck allowedPhases={[GAME_PHASE.INTERVIEW_PHASE]}>
              <PhraseCardDisplay />
            </GamePhaseCheck>
          </div>
        </div>
      </section>
    </>
  );
};

export default Game;
