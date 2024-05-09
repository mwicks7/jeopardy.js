import React from "react"

const AnswerForm = ({ handleAnswerQuestion, handleSkipQuestion }) => {
  return (
    <form className="question__form" onSubmit={(e) => handleAnswerQuestion()}>
      <input
        type="text"
        placeholder="What is..."
        name="answer"
        id="answerInput"
        className="question__input"
      />
      <button className="question__submit" type="submit">
        Submit Response
      </button>
      <button
        onClick={handleSkipQuestion}
        type="button"
        className="question__submit question__submit--skip"
      >
        Skip
      </button>
    </form>
  )
}

const Answer = ({ displayMessage, answer, handleKeepPlaying }) => {
  return (
    <div className="question__result">
      <div className="question__correct">
        {displayMessage.correct === true && "CORRECT!"}
        {displayMessage.correct === false && "INCORRECT!"}{" "}
      </div>
      <div className="question__answer">What is {answer}?</div>
      {displayMessage.keepPlaying && (
        <button onClick={handleKeepPlaying} className="question__keep-playing">
          Keep Playing
        </button>
      )}
    </div>
  )
}

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
        <div className="question__spacer" />
        <div className="question__clue">{activeClue.question}</div>
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
    )
  } else {
    return <div className="question">Select a clue</div>
  }
}

export default Question
