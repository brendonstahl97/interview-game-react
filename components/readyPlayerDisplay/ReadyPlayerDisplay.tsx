import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCheck, faUserTimes } from "@fortawesome/free-solid-svg-icons";
import style from "./readyPlayerDisplay.module.scss";

type ReadyPlayerDisplayProps = {
  playerName: string;
  ready?: boolean;
};

const ReadyPlayerDisplay = ({
  playerName,
  ready = false,
}: ReadyPlayerDisplayProps) => {
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
