const UsePhraseCard = ({ phrase }) => {
  return (
    <div className="card text-center">
      <div className="card-body">
        <h5 className="card-title phrase1" value={phrase || ""}>
          {phrase}
        </h5>
        <button href="#" className="phraseCard btn btn-primary">
          Use Now!
        </button>
      </div>
    </div>
  );
};

export default UsePhraseCard;
