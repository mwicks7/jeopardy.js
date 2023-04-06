import React from 'react'

const Clue = ({ clue, answeredClues, handleLoadQuestion }) => {
  const buttonClasses = ["clues__question-value"]
  if (answeredClues.includes(clue.id)) buttonClasses.push('is--answered')

  return (
    <li className="clues__question">
      <button 
        className={buttonClasses.join(' ')}
        data-id={clue.id}
        data-question={clue.question}
        data-answer={clue.answer}
        data-points={clue.points}
        onClick={handleLoadQuestion}
      >
        ${clue.points}
      </button>
    </li>
  )
}

const Clues = ({ category, clues, answeredClues, handleLoadQuestion }) => {
  return (
    <div className="clues">
      <div className="clues__category">
        <div className="clues__category-title">
          {category.title}
        </div>
        <ul className="clues__questions">
          {clues.map((clue, i) => 
            <Clue 
              clue={clue}
              answeredClues={answeredClues}
              handleLoadQuestion={handleLoadQuestion}
              key={"clue" + clue.id}
            />
          )}
        </ul>
      </div>
    </div>
  )
}

export default Clues