import style from "../styles/Landing.module.scss";
import Head from "next/head";

const Landing = (props) => {
  return (
    <>
      <Head>
        <title>Interview Game</title>
      </Head>
      <main
        className={`${style.bg_image} d-flex align-items-center justify-content-center`}
      >
        <div className="card col-md-6 text-center mx-auto mt-5 mb-5">
          <div className="card-header">Welcome</div>
          <div className="card-body">
            <h3 className="card-title">Interview Rooms</h3>
            <p className="card-text">
              To start playing, enter a display name then select an option
              below:
            </p>

            <p className="option m-3 mx-auto"></p>
            <input
              type="text"
              className="authorInput form-control mx-auto text-center m-2"
              placeholder="Display Name"
              aria-label="Chat Room #"
              aria-describedby="basic-addon2"
              style={{ width: 10 + "rem" }}
            />

            <p className="option m-3 mx-auto">1. Start a new game!</p>
            <a href="#" className="hostBtn btn btn-primary mt-2">
              Host Room
            </a>

            <p className="option m-3 mx-auto">
              2. Enter a room # to join an existing game!
            </p>
            <input
              type="text"
              className="roomNumInput form-control mx-auto text-center m-2"
              placeholder="Room #"
              aria-label="Chat Room #"
              aria-describedby="basic-addon2"
              style={{ width: 10 + "rem" }}
            />
            <a href="#" className="joinBtn btn btn-primary">
              Join Room
            </a>
          </div>

          <div className="card-footer text-muted">Let's Play!</div>
        </div>
      </main>
    </>
  );
};

export default Landing;
