const PlayersDisplay = ({ children }) => {
  return (
    <div className="card mb-3">
      <h3 className="card-header">Players:</h3>
      <div className="card-body">{children}</div>
    </div>
  );
};

export default PlayersDisplay;
