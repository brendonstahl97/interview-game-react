const PhaseDisplay = () => {
  return (
    <div className="card mb-3 text-center">
      <h5 className="font-weight-bold card-header">Current Phase: 1</h5>
      <div className="card-body">
        <h5 className="card-title"></h5>
        <button href="#" className="readyBtn btn btn-primary mb-3">
          Ready
        </button>
        <br />
        <button href="#" className="startBtn btn btn-primary" disabled>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default PhaseDisplay;
