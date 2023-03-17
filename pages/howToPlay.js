import Head from "next/head";
import Header from "@/components/header";
import style from "../styles/howToPlay.module.scss";

const howToPlay = (props) => {
  return (
    <>
      <Head>
        <title>Interview Game: How to Play</title>
      </Head>
      <Header></Header>
      <div className={style.playbg_image}>
        <div
          className={`${style.jumbotron} jumbotron jumbotron-fluid text-center pt-3 pb-2`}
        >
          <div>
            <h1 className="display-4">How do you play?</h1>
            <p className="lead">The Interview Game</p>
          </div>
        </div>

        <div className={`${style.card} card col-md-6 mx-auto mt-5 mb-5`}>
          <div className="card-header text-center">The Rules</div>
          <p className="paragraph m-3">
            Each round, one player is the <strong>Interviewer</strong> and will
            pick a job card at random, while every other player is an
            <strong>Interviewee</strong> and will receive 5 phrase cards. They
            must interview for the position with the Interviewer and their pitch
            must contain every phrase on each of their cards.
          </p>
          <p className="paragraph m-3">
            After all players have interviewed, the Interviewer decides who gets
            the job, receives the job card, and wins the round. The game is won
            after a player wins a predetermined number of job cards.
          </p>

          <p className="paragraph m-3">
            <u>Game Phases</u>
          </p>
          <ol className="list m-3">
            <li>Draw Phase:</li>
            <ul>
              <li>
                Interviewer draws job card and players each draw 5 phrase cards
              </li>
            </ul>
            <br />
            <li>Interview Phase:</li>
            <ul>
              <li>
                Each player is given 60 seconds to give their reasons as to why
                they deserve the job, while incorporating ALL of the phrases
                from their phrase cards.
              </li>
            </ul>
            <br />
            <li>Employment Phase:</li>
            <ul>
              <li>
                Interviewer decides who wins the round based on the quality of
                each player's pitch, and the card is assigned.
              </li>
            </ul>
          </ol>

          <p className="paragraph m-3">
            NOTE: We recommend using a VOIP service like{" "}
            <a href="https://discord.com/">Discord</a> while playing.
          </p>

          <div className="card-footer text-muted text-center">
            <a href="/">Now, Let's Play!</a>
          </div>
        </div>

        <footer className="sticky-bottom py-3 bg-dark">
          <div className="container">
            <p className="m-0 text-center text-white">
              Copyright &copy; Wonderful Jaguars 2020
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default howToPlay;
