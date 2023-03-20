import React from 'react'

const Category = ({ category }) => {
  return (
    <div className="category">
      <div className="category-title">
        {category.title}
      </div>
      <ul className="category-clues">
        {category.clues.map( clue => 
          <li className="category-clue">
            <button>{clue.value}</button>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Category