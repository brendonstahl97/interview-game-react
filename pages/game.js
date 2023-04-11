import EndTurnCard from "@/components/endTurnCard/endTurnCard";
import GameInfoCard from "@/components/gameInfoCard/gameInfoCard";
import GameInfoDisplay from "@/components/gameInfoDisplay/gameInfoDisplay";
import PhaseDisplay from "@/components/phaseDisplay/phaseDisplay";
import PlayersDisplay from "@/components/phaseDisplay/playersDisplay";
import SubmissionCard from "@/components/submissionCard/submissionCard";
import UsePhraseCard from "@/components/usePhraseCard/usePhraseCard";
import WinnerCard from "@/components/winnerCard/winnerCard";
import GamePhaseCheck from "@/components/gamePhaseCheck/gamePhaseCheck";
import { useState } from "react";
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
                  <GameInfoDisplay baseText={"Room Number"} value={state.RoomNumber} />
                </div>
                <div className="col-sm">
                  <GameInfoDisplay baseText={"Job Name"} value={""} />
                </div>
                <div className="col-sm">
                  <GameInfoDisplay baseText={"Display Name"} value={state.PlayerData.name} />
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                <div className="col-md-4 mt-2">
                  <GameInfoDisplay baseText={"Interviewer"} value={""} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row d-flex justify-content-center text-center">
          <div className="col-md-2 col-sm-6 pt-4">
            <GameInfoCard headerText="Your Points" value={state.PlayerData.points} />
          </div>
          <GamePhaseCheck
            currentPhase={state.CurrentPhase}
            allowedPhases={["Setup Phase"]}
          >
            <div className="gameStarterDiv col-md-3 col-sm-6 pt-4">
              <PhaseDisplay />
            </div>
          </GamePhaseCheck>

          <div className="col-md-2 col-sm-6 pt-4">
            <GameInfoCard headerText="Current Interviewee" value="" />
          </div>
        </div>
      </div>

      <div className="row d-flex justify-content-center">
        <div className="col-md-5 col-sm-8 left-side">
          <GamePhaseCheck
            currentPhase={state.CurrentPhase}
            allowedPhases={["Setup Phase"]}
          >
            <div className="col-md-12 mt-3 mb-3 text-center playerListCard">
              <PlayersDisplay></PlayersDisplay>
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck
            currentPhase={state.CurrentPhase}
            allowedPhases={["Winner Phase"]}
          >
            <div className="col-md-12 mt-3 mb-3 text-center winnerCard">
              <WinnerCard winnerName="Some Guy!!!" />
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck
            currentPhase={state.CurrentPhase}
            allowedPhases={["Submission Phase"]}
          >
            <div className="submissions col-md-12 hld mt-3">
              <div className="row">
                <div className="col-sm-6">
                  <SubmissionCard phrase />
                </div>
                <div className="col-sm-6">
                  <SubmissionCard />
                </div>
              </div>
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck
            currentPhase={state.CurrentPhase}
            allowedPhases={["Interview Phase"]}
          >
            <div className="currentCard col-md-12 mt-3 mb-3 text-center">
              <GameInfoCard headerText="Phrase in Use" value="Phrase 1" large />
            </div>
          </GamePhaseCheck>

          <GamePhaseCheck
            currentPhase={state.CurrentPhase}
            allowedPhases={["Employment Phase"]}
          >
            <div className="hiringList">Hiring List Placeholder</div>
          </GamePhaseCheck>

          <GamePhaseCheck
            currentPhase={state.CurrentPhase}
            allowedPhases={["Interview Phase"]}
          >
            <div className="cards col-md-12 mb-3 mt-3">
              <div className="row d-flex justify-content-center">
                <div className="col-md-4">
                  <UsePhraseCard phrase="Phrase 1" />
                </div>
                <div className="col-md-4">
                  <UsePhraseCard phrase="Phrase 2" />
                </div>
                <div className="col-md-4">
                  <UsePhraseCard phrase="Phrase 3" />
                </div>

                <div className="row mt-3 d-flex justify-content-center">
                  <div className="col-md-4">
                    <UsePhraseCard phrase="Phrase 4" />
                  </div>
                  <div className="col-md-4">
                    <UsePhraseCard phrase="Phrase 5" />
                  </div>
                </div>
              </div>
            </div>
          </GamePhaseCheck>
        </div>

        <GamePhaseCheck
          currentPhase={state.CurrentPhase}
          allowedPhases={["Interview Phase"]}
        >
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
