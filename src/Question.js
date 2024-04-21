import React from "react";

const AnswerForm = ({ handleAnswerQuestion, handleSkipQuestion }) => {
  return (
    <div className="question__form">
      <input
        type="text"
        placeholder="What is..."
        name="answer"
        id="answerInput"
        className="question__input"
      />
      <button onClick={handleAnswerQuestion} className="question__submit">
        Submit Response
      </button>
      <button
        onClick={handleSkipQuestion}
        className="question__submit question__submit--skip"
      >
        Skip
      </button>
    </div>
  );
};

const Answer = ({ displayMessage, answer, handleKeepPlaying }) => {
  return (
    <div className="question__result">
      <div className="question__correct">
        {displayMessage.correct === true && "CORRECT!"}
        {displayMessage.correct === false && "INCORRECT!"}
      </div>
      <div className="question__answer">What is {answer}?</div>
      {displayMessage.keepPlaying && (
        <button onClick={handleKeepPlaying} className="question__keep-playing">
          Keep Playing
        </button>
      )}
    </div>
  );
};

const Question = ({
  activeClue,
  handleAnswerQuestion,
  handleSkipQuestion,
  displayMessage,
  handleKeepPlaying,
}) => {
  if (activeClue.question) {
    return (
      <div className="question">
        <div className="question__text">{activeClue.question}</div>
        {!displayMessage.answer && (
          <AnswerForm
            handleAnswerQuestion={handleAnswerQuestion}
            handleSkipQuestion={handleSkipQuestion}
          />
        )}
        {displayMessage.answer && (
          <Answer
            displayMessage={displayMessage}
            answer={activeClue.answer}
            handleKeepPlaying={handleKeepPlaying}
          />
        )}
      </div>
    );
  } else {
    return <div className="question">Select a clue</div>;
  }
};

export default Question;
