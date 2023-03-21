import React from 'react'

const Category = ({ category }) => {
  return (
    <div className="clues__category">
      <div className="clues__category-title">
        {category.title}
      </div>
      <ul className="clues__questions">
        {category.clues.map((clue, i) => 
          <li className="clues__question" key={"clue" + i + category.id}>
            <button className="clues__question-value">${clue.value}</button>
            <div className="clues__question-text">{clue.question}</div>
          </li>
        )}
      </ul>
    </div>
  )
}

const Clues = ({ categories }) => {
  return (
    <div className="clues">
      {categories.map( category => <Category category={category} key={'category' + category.id}/> )}
    </div>
  )
}

export default Clues