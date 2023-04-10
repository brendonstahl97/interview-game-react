import { useState } from "react";
import { useRouter } from "next/router";
import style from "../styles/Landing.module.scss";
import Head from "next/head";
import Link from "next/link";
import { socket } from "@/components/context/socket-wrapper";
import { useAppContext } from "@/components/context/AppContext";

const Landing = (props) => {
  const { state, dispatch } = useAppContext();
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();

  const handleNewGame = (e) => {
    e.preventDefault();
    dispatch({ type: "SET_DISPLAY_NAME", value: displayName });

    socket.emit("newUser", {
      DisplayName: displayName,
      RoomNum: "",
    });
  };

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
              onChange={(e) => setDisplayName(e.target.value)}
              value={displayName}
            />

            <p className="option m-3 mx-auto">1. Start a new game!</p>
            <a
              href="#"
              className="hostBtn btn btn-primary mt-2"
              onClick={handleNewGame}
            >
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
