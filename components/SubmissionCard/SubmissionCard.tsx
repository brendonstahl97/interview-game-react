import { ChangeEvent, useState } from "react";
import { MouseEvent } from "react";

type SubmissionCardProps = {
  phrase?: boolean;
  SubmitCard: (inputValue: string, phrase: boolean) => void;
  submitQuotaMet?: boolean;
};

const SubmissionCard = ({
  phrase = false,
  SubmitCard,
  submitQuotaMet = false,
}: SubmissionCardProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputValue == "") return;

    SubmitCard(inputValue, phrase);
    setInputValue("");
  };

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
            value={inputValue}
            onChange={handleInputChange}
            disabled={submitQuotaMet}
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="addJobBtn btn btn-primary"
            disabled={submitQuotaMet}
          >
            {phrase ? "Add Phrase" : "Add Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmissionCard;
