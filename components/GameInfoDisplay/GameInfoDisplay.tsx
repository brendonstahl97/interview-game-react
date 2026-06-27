import style from "./gameInfoDisplay.module.scss";

interface IGameInfoDisplayProps {
  baseText: string;
  value: string;
}

const GameInfoDisplay = ({ baseText, value }: IGameInfoDisplayProps) => {
  return <h4 className={style.gameInfoDisplay}>{`${baseText}: ${value}`}</h4>;
};

export default GameInfoDisplay;
