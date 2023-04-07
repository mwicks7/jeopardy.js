import './styles.scss'
import logo from './images/logo.png'
import React from 'react';
import Clues from './Clues'
import Scoreboard from './Scoreboard'
import Question from './Question'

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
  
  fetchClues() {
    const maxCategoryID = 28000
    const categoryOffset = Math.random() * (maxCategoryID - 1) + 1

    fetch(`https://jservice.io/api/categories?count=1&offset=${categoryOffset}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(categories => {
      fetch(`https://jservice.io/api/category?id=${categories[0].id}`, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(category => {
        let categoryData = { 
          id: categories[0].id,
          title: categories[0].title
        }
        let cluesData = []

        for (let j=0; j < 5 && j < category.clues.length; j++) {
          cluesData.push({
            id: category.clues[j].id,
            question: category.clues[j].question,
            answer: this.sanatizeClueAnswer(category.clues[j].answer),
            points: this.sanatizePoints(category.clues[j].value, j),
            asked: false
          })
        }

        cluesData.sort((a, b) => {
          return a.points > b.points ? 1 : -1
        })
        
        this.setState((state) => {
          return {
            isLoaded: true,
            category: categoryData,
            clues: cluesData
          }
        });
      }, (error) => this.handleError(error))
    }, (error) => this.handleError(error))
  }

  sanatizePoints(points, j) {
    // Data from api sometimes returns null or values that are not multiples of 100
    let sanatizedPoints = points === null ? j + 1 * 100 : points
    sanatizedPoints = Math.round(sanatizedPoints / 100) * 100
    return sanatizedPoints
  }

  sanatizeClueAnswer(answer) {
    // Data from api sometimes includes undesirable characters
    return answer.replace('\\', '').replace('<i>', '').replace('</i>', '')
  }

  handleError(error) {
    this.setState({
      isLoaded: true,
      error
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
    // To Do: Allow for more leniancy instead of exact match
    // Remove the,a,an,',",.,-,spaces,(,)
    return answer
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
