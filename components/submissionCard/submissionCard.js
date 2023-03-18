const SubmissionCard = ({ phrase = false }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{phrase ? "Add a Phrase:" : "Add a Job"}</h5>
        <form>
          <input
            type="text"
            className="jobInput form-control mb-2"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-default"
          />
          <button type="submit" href="#" className="addJobBtn btn btn-primary">
            {phrase ? "Add Phrase" : "Add Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmissionCard;
