import React from 'react'

const Scoreboard = ({ score }) => {
  let dollarAmount
  if (score < 0) {
    dollarAmount = '-$' + score * -1
  } else {
    dollarAmount = '$' + score
  }

  return (
    <div className="scoreboard">
      SCORE: {dollarAmount}
    </div>
  )
}

export default Scoreboard