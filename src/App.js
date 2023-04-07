import './styles.scss'
import logo from './images/logo.png'
import React from 'react'
import Clues from './Clues'
import Scoreboard from './Scoreboard'
import Question from './Question'
import backupData from './backupData'

const defaultState = {
  error: null,
  isLoaded: false,
  category: '',
  clues: [],
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
    super(props);
    this.handleLoadQuestion = this.handleLoadQuestion.bind(this)
    this.handleAnswerQuestion = this.handleAnswerQuestion.bind(this)
    this.handleSkipQuestion = this.handleSkipQuestion.bind(this)
    this.handleKeepPlaying = this.handleKeepPlaying.bind(this)
    this.state = defaultState
  }

  componentDidMount() {
    this.fetchClues()
  }
  
  async fetchClues() {
    const controller = new AbortController()
    const categoryCount = 28000
    const categoryId = Math.random() * (categoryCount - 1) + 1
    const response = await fetch(`https://jservice.io/api/category?id=${categoryId}`, { method: 'GET' })

    if (!response.ok) {
      this.handleError()
      controller.abort()
    }

    const category = await response.json()
    let clues = []

    for (let i=0; i < 5 && i < category.clues.length; i++) {
      clues.push({
        id: category.clues[i].id,
        question: category.clues[i].question,
        answer: this.sanatizeClueAnswer(category.clues[i].answer),
        points: this.sanatizePoints(category.clues[i].value, i),
        asked: false
      })
    }

    clues.sort((a, b) => {
      return a.points > b.points ? 1 : -1
    })
    
    this.setState((state) => {
      return {
        isLoaded: true,
        category: { 
          id: category.id,
          title: category.title
        },
        clues
      }
    });
  }

  sanatizePoints(points, i) {
    // Data from api sometimes returns null or values that are not multiples of 100
    let sanatizedPoints = points === null ? i + 1 * 100 : points
    sanatizedPoints = Math.round(sanatizedPoints / 100) * 100
    return sanatizedPoints
  }

  sanatizeClueAnswer(answer) {
    // Data from api sometimes includes undesirable characters
    const regex = /\\|<i>|<\/i>|(|)/g
    return answer.replace(regex, '')
  }

  handleError() {
    const index = Math.random() * (backupData.length - 1) + 1
    const errorBackup = backupData[index]

    this.setState({
      isLoaded: true,
      category: errorBackup.category,
      clues: errorBackup.clues
    });
  }

  handleLoadQuestion(e) {
    this.setState({
      activeClue: {
        id: e.target.dataset.id,
        question: e.target.dataset.question,
        answer: e.target.dataset.answer,
        points: e.target.dataset.points
      },
      displayMessage: {
        answer: false,
        correct: false,
        keepPlaying: false
      }
    })
  }

  stripAnswer(answer) {
    const regex1 = /the |a |an |and |_|\W/gi
    return answer.replace(regex1, '')
  }

  handleAnswerQuestion(e) {
    const userAnswer = document.getElementById('answerInput').value.toLowerCase()
    const clueAnswer = this.state.activeClue.answer.toLowerCase()
    const clueID = Number(this.state.activeClue.id)
    const cluePoints = Number(this.state.activeClue.points)
    const isCorrect = this.stripAnswer(userAnswer) === this.stripAnswer(clueAnswer)
    const score = isCorrect ?
      this.state.score + cluePoints :
      this.state.score - cluePoints 
    const answeredClues = [...this.state.answeredClues, clueID]

    this.setState(state => {
      return {
        answeredClues: answeredClues,
        displayMessage: {
          answer: true,
          correct: isCorrect,
          keepPlaying: state.clues.length === answeredClues
        },
        score: score
      }
    })
  }

  handleSkipQuestion() {
    const clueID = Number(this.state.activeClue.id)
    const answeredClues = [...this.state.answeredClues, clueID]

    this.setState(state => {
      return {
        answeredClues: answeredClues,
        displayMessage: {
          answer: true,
          correct: false,
          keepPlaying: state.clues.length === answeredClues.length
        },
      }
    })
  }

  handleKeepPlaying() {
    const resetState = defaultState
    resetState.score = this.state.score 
    this.setState(resetState)
    this.fetchClues()
  }

  render() {
    const { error, isLoaded, category, clues, answeredClues, activeClue, displayMessage, score } = this.state

    if (error) {
      return <div>An error occurred: {error.message}. Please refresh your browser to play.</div>
    } else {
      return (
        <div className="app">
          <header className="app__header">
            <img className="app__logo" src={logo} alt="Jeopardy!js" />
          </header>
          <main>
            <div className="gameboard">
              {!isLoaded && <div className="gameboard__loader">Loading...</div>}
              {isLoaded && 
                <Clues 
                  category={category} 
                  clues={clues} 
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
          </footer>
        </div>
      );
    }
  }
}

export default App;
