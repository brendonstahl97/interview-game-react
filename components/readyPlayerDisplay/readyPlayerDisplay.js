import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck, faUserTimes } from "@fortawesome/free-solid-svg-icons";
import style from "./readyPlayerDisplay.module.scss";

const ReadyPlayerDisplay = ({ playerName, ready = false }) => {
  return (
    <div>
      <span className={style.ready_player_display}>
        {playerName}
        {ready ? (
          <FontAwesomeIcon
            className={`${style.green} ms-3`}
            id={playerName}
            icon={faUserCheck}
          />
        ) : (
          <FontAwesomeIcon
            className={`${style.red} ms-3`}
            id={playerName}
            icon={faUserTimes}
          />
        )}
      </span>
    </div>
  );
};

export default ReadyPlayerDisplay;
