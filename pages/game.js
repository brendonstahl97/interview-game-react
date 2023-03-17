import SocketWrapper from "@/components/socket-wrapper";
import style from "@/styles/Game.module.scss";

const Game = () => {
  return (
    <SocketWrapper>
      <div className="roombg_image col-12">
        <div className="jumbotron jumbotron-fluid text-center pt-3 pb-2">
          <div className="container">
            <h1 className="display-4">The Interview Game</h1>
            <div className="container">
              <div className="row">
                <div className="col-sm">
                  <h4 className={`${style.jumbo_h4} roomDisp`}>Room Number: 1234 </h4>
                </div>
                <div className="col-sm">
                  <h4 className={`${style.jumbo_h4} jobCard`}>Job Name: </h4>
                </div>
                <div className="col-sm">
                  <h4 className={`${style.jumbo_h4} displayName`}>Display Name: </h4>
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                <div className="col-md-4 mt-2">
                  <h4 className={`${style.jumbo_h4} currentInterviewer`}>Interviewer: </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row d-flex justify-content-center text-center">
          <div className="col-md-2 col-sm-6 pt-4">
            <div className="card mb-3">
              <h5 className={`${style.phaseDisp} card-header`}>Your Points</h5>
              <div className="card-body">
                <h5 className="scoreDisp card-title">0</h5>
              </div>
            </div>
          </div>

          <div className="gameStarterDiv col-md-3 col-sm-6 pt-4">
            <div className="card mb-3 text-center">
              <h5 className="phaseDisp card-header">Current Phase: 1</h5>
              <div className="card-body">
                <h5 className="card-title"></h5>
                <button href="#" className="readyBtn btn btn-primary mb-3">
                  Ready
                </button>
                <br />
                <button href="#" className="startBtn btn btn-primary" disabled>
                  Start Game
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-2 col-sm-6 pt-4">
            <div className="card mb-3">
              <h5 className="card-header">Current Interviewee</h5>
              <div className="card-body">
                <h5 className="currentPlayer card-title"></h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row d-flex justify-content-center">
        <div className="col-md-5 col-sm-8 left-side">
          <div className="col-md-12 mt-3 mb-3 text-center playerListCard">
            <div className="card mb-3">
              <h3 className="phaseDisp card-header">Players:</h3>
              <div className="card-body playerList"></div>
            </div>
          </div>

          <div className="col-md-12 mt-3 mb-3 text-center winnerCard">
            <div className="card mb-3">
              <h3 className="phaseDisp card-header">Winner:</h3>
              <br />
              <h1 className="winnerNameText">Some guy!</h1>
              <br />

              <button href="#" className="replaySameCardsBtn btn btn-primary m-3">
                New Game with Same Cards
              </button>
              <button href="#" className="replayReuseCardsBtn btn btn-primary m-3">
                New Game with New Cards
              </button>
            </div>
          </div>

          <div className="submissions col-md-12 hld mt-3">
            <div className="row">
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Add a Job:</h5>
                    <form>
                      <input
                        type="text"
                        className="jobInput form-control mb-2"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                      />
                      <button
                        type="submit"
                        href="#"
                        className="addJobBtn btn btn-primary"
                      >
                        Add Job
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Add a Phrase:</h5>
                    <form>
                      <input
                        type="text"
                        className="phraseInput form-control mb-2"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                      />
                      <button
                        type="submit"
                        href="#"
                        className="addPhraseBtn btn btn-primary"
                      >
                        Add Phrase
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="currentCard col-md-12 mt-3 mb-3 text-center">
            <div className="card">
              <div className="card-header">
                <h3>Phrase in Use</h3>
              </div>
              <p className="currentCardDisplay mt-3" value="">
                Phrase 1
              </p>
            </div>
          </div>
          <div className="hiringList"></div>
          <div className="cards col-md-12 mb-3 mt-3">
            <div className="row d-flex justify-content-center">
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title phrase1" value="Phrase 1">
                      Phrase 1
                    </h5>
                    <button href="#" className="phraseCard btn btn-primary">
                      Use Now!
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title phrase2" value="Phrase 2">
                      Phrase 2
                    </h5>
                    <button href="#" className="phraseCard btn btn-primary">
                      Use Now!
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center">
                  <div className="card-body">
                    <h5 className="card-title phrase3" value="Phrase 3">
                      Phrase 3
                    </h5>
                    <button href="#" className="phraseCard btn btn-primary">
                      Use Now!
                    </button>
                  </div>
                </div>
              </div>

              <div className="row mt-3 d-flex justify-content-center">
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title phrase4" value="Phrase 4">
                        Phrase 4
                      </h5>
                      <button href="#" className="phraseCard btn btn-primary">
                        Use Now!
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <h5 className="card-title phrase5" value="Phrase 5">
                        Phrase 5
                      </h5>
                      <button href="#" className="phraseCard btn btn-primary">
                        Use Now!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="col-md-3 col-sm-6">
            <div className="card endTurnDiv text-center mb-3">
              <div className="card-body">
                <button href="#" className="endTurn btn btn-primary">
                  End Turn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
    </SocketWrapper>
  );
};

export default Game;