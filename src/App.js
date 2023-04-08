import './styles.scss'
import logo from './images/logo.png'
import React from 'react'
import Category from './Category'
import Scoreboard from './Scoreboard'
import Question from './Question'

const errorData = require('./backupData.js')
const defaultState = {
  isLoaded: false,
  category: '',
  activeClue: {
    id: '',
    question: '',
    answer: '',
    points: ''
  },
  answeredClues: [],
  score: 0,
  displayMessage: {
    answer: false,
    correct: false
  }
}

class App extends React.Component {
  constructor (props) {
    super(props)
    this.handleLoadQuestion = this.handleLoadQuestion.bind(this)
    this.handleAnswerQuestion = this.handleAnswerQuestion.bind(this)
    this.handleSkipQuestion = this.handleSkipQuestion.bind(this)
    this.handleKeepPlaying = this.handleKeepPlaying.bind(this)
    this.state = defaultState
  }

  componentDidMount() {
    this.fetchCategory()
  }

  // DATA ACCESS

  async fetchCategory() {
    const categoryId = this.getRandomId(2800)
    const response = await fetch(`https://jservice.io/api/category?id=${categoryId}`, { method: 'GET' })
    
    if (!response.ok) {
      this.fetchError()
      return
    }
    
    const category = await response.json()
    
    this.setState((state) => {
      return {
        isLoaded: true,
        category: { 
          id: category.id,
          title: category.title,
          clues: this.sanatizeClues(category.clues)
        }
      }
    })
  }
  
  fetchError() {
    const index = this.getRandomId(errorData.backupData.length)
    this.setState({
      isLoaded: true,
      category: errorData.backupData[index]
    })
  }

  // DATA MANIPULATION

  getRandomId(max) {
    return Math.floor(Math.random() * (max - 1) + 1)
  }
  
  sanatizeClues(clues) {
    let cleanClues = []
    
    clues.sort((a, b) => {
      return a.id > b.id ? 1 : -1
    })

    for (let i=0; i < 5 && i < clues.length; i++) {
      cleanClues.push({
        id: clues[i].id,
        question: clues[i].question,
        answer: this.sanatizeAnswer(clues[i].answer),
        points: this.sanatizePoints(clues[i].value, i)
      })
    }

    cleanClues.sort((a, b) => {
      return a.points > b.points ? 1 : -1
    })
    
    return cleanClues
  }

  sanatizeAnswer(answer) {
    const regex = /\\|<i>|<\/i>|\(|\)/g
    return answer.replace(regex, '')
  }

  sanatizePoints(points, i) {
    let cleanPoints = points === null ? (i + 1) * 100 : points
    cleanPoints = Math.round(cleanPoints / 100) * 100
    return cleanPoints
  }

  stripAnswer(answer) {
    const regex1 = /the |a |an |and |_|\W/gi
    return answer.toLowerCase().replace(regex1, '')
  }

  // EVENT HANDLERS

  handleLoadQuestion(e) {
    this.setState({
      activeClue: {
        id: Number(e.target.dataset.id),
        question: e.target.dataset.question,
        answer: e.target.dataset.answer,
        points: Number(e.target.dataset.points)
      },
      displayMessage: {
        answer: false,
        correct: false,
        keepPlaying: false
      }
    })
  }

  handleAnswerQuestion(e) {
    const userAnswer = document.getElementById('answerInput').value
    const clueAnswer = this.state.activeClue.answer
    const cluePoints = this.state.activeClue.points
    const isCorrect = this.stripAnswer(userAnswer) === this.stripAnswer(clueAnswer)
    const newScore = isCorrect ?
      this.state.score + cluePoints :
      this.state.score - cluePoints 
    const answeredClues = [...this.state.answeredClues, this.state.activeClue.id]

    this.setState(state => {
      return {
        answeredClues: answeredClues,
        displayMessage: {
          answer: true,
          correct: isCorrect,
          keepPlaying: state.category.clues.length === answeredClues.length
        },
        score: newScore
      }
    })
  }

  handleSkipQuestion() {
    const clueID = this.state.activeClue.id
    const answeredClues = [...this.state.answeredClues, clueID]

    this.setState(state => {
      return {
        answeredClues: answeredClues,
        displayMessage: {
          answer: true,
          correct: null,
          keepPlaying: state.category.clues.length === answeredClues.length
        },
      }
    })
  }

  handleKeepPlaying() {
    const newState = Object.assign(defaultState, { score: this.state.score })
    this.setState(newState)
    this.fetchCategory()
  }

  // COMPONENT RENDER

  render() {
    const { isLoaded, category, answeredClues, activeClue, displayMessage, score } = this.state
    
    return (
      <div className="app">
        <header className="app__header">
          <img className="app__logo" src={logo} alt="Jeopardy!js" />
        </header>

        <main>
          <div className="gameboard">
            {!isLoaded && 
              <div className="gameboard__loader">Loading...</div>
            }

            {isLoaded && 
              <Category 
                category={category} 
                answeredClues={answeredClues} 
                handleLoadQuestion={this.handleLoadQuestion}   
              />
            }

            {isLoaded &&
              <Question 
                activeClue={activeClue} 
                displayMessage={displayMessage}  
                handleAnswerQuestion={this.handleAnswerQuestion} 
                handleSkipQuestion={this.handleSkipQuestion}
                handleKeepPlaying={this.handleKeepPlaying} 
              />
            }
          </div>

          <Scoreboard score={score} />
        </main>

        <footer className='app__footer'>
            <p>This app was built by <a href="https://mwicks7.github.io/resume" target="_blank" rel="noreferrer">Matthew Wicks</a>, and is not affiliated with the show.</p>
            <p>Big thanks to <a href="https://jservice.io/" target="_blank" rel="noreferrer">jservice.io</a> for providing the API endpoint.</p>
        </footer>
      </div>
    )
  }
}

export default App
