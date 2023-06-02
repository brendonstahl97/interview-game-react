export type GameInfoCardProps = {
  headerText: string;
  value: string;
  isLarge?: boolean;
}

const GameInfoCard = ({ headerText, value, isLarge = false }: GameInfoCardProps) => {
  return (
    <div className="card mb-3">
      {isLarge ? (
        <h3 className="font-weight-bold card-header">{headerText}</h3>
      ) : (
        <h5 className="font-weight-bold card-header">{headerText}</h5>
      )}
      <div className="card-body">
        <h5 className="scoreDisp card-title">{value}</h5>
      </div>
    </div>
  );
};

export default GameInfoCard;
