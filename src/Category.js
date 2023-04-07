import React from 'react'

const Clue = ({ clue, answeredClues, handleLoadQuestion }) => {
  const buttonClasses = ["category__clue-value"]
  if (answeredClues.includes(clue.id)) buttonClasses.push('is--answered')

  return (
    <li className="category__clue">
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

const Category = ({ category, answeredClues, handleLoadQuestion }) => {
  return (
    <div className="category">
      <div className="category__title">
        {category.title}
      </div>
      <ul className="category__clues">
        {category.clues.map((clue, i) => 
          <Clue 
            clue={clue}
            answeredClues={answeredClues}
            handleLoadQuestion={handleLoadQuestion}
            key={"clue" + clue.id}
          />
        )}
      </ul>
    </div>
  )
}

export default Category