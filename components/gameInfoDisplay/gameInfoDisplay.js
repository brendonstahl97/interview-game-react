import style from "./gameInfoDisplay.module.scss";

const GameInfoDisplay = ({ baseText, value }) => {
  return <h4 className={style.gameInfoDisplay}>{`${baseText}: ${value}`}</h4>;
};

export default GameInfoDisplay;
