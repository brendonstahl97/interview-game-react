import { useState } from "react";
import { useRouter } from "next/router";
import style from "../styles/Landing.module.scss";
import Head from "next/head";
import { socket } from "@/components/context/socket-wrapper";

const Landing = (props) => {
  const [inputState, setInputState] = useState({
    displayName: "",
    roomNumToJoin: "",
  });

  const router = useRouter();

  const handleEnterGame = (e, isHost) => {
    e.preventDefault();

    // Temp Error Handling
    if (inputState.displayName.length == 0) {
      if (isHost) {
        alert("Please Enter a Display Name");
        return;
      } else if (inputState.roomNumToJoin.length == 0) {
        alert("Please enter a Display Name and a Room Number to join");
        return;
      }
    }

    const room = isHost ? "" : inputState.roomNumToJoin;

    socket.emit("newUser", {
      DisplayName: inputState.displayName,
      RoomNum: room,
    });

    router.push("/game");
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
              onChange={(e) =>
                setInputState({
                  ...inputState,
                  displayName: e.target.value,
                })
              }
              value={inputState.displayName}
            />

            <p className="option m-3 mx-auto">1. Start a new game!</p>
            <a
              href="#"
              className="hostBtn btn btn-primary mt-2"
              onClick={(e) => handleEnterGame(e, true)}
            >
              Host Room
            </a>
            <br />
            <br />
            <p>or</p>

            <p className="option m-3 mx-auto">
              2. Enter a room number to join an existing game!
            </p>
            <input
              type="text"
              className="roomNumInput form-control mx-auto text-center m-2"
              placeholder="Room Number"
              style={{ width: 10 + "rem" }}
              onChange={(e) => {
                setInputState({
                  ...inputState,
                  roomNumToJoin: e.target.value,
                });
              }}
              value={inputState.roomNumToJoin}
            />
            <a
              href="#"
              className="joinBtn btn btn-primary"
              onClick={(e) => handleEnterGame(e, false)}
            >
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
