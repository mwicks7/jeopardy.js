import './styles.scss'
import logo from './images/jeopardy_logo.png'
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

    fetch(`http://jservice.io/api/categories?count=1&offset=${categoryOffset}`, {
      method: 'GET'
    })
    .then(response => response.json())
    .then(categories => {
      fetch(`http://jservice.io/api/category?id=${categories[0].id}`, {
        method: 'GET'
      })
      .then(response => response.json())
      .then(category => {
        let categoryData = { 
          id: categories[0].id,
          title: categories[0].title ,
        }
        let cluesData = []

        for (let j=0; j < 5 && j < category.clues.length; j++) {
          cluesData.push({
            id: category.clues[j].id,
            question: category.clues[j].question,
            answer: this.sanatizeAnswer(category.clues[j].answer),
            points: category.clues[j].value === null ? j + 1 * 100 : category.clues[j].value,
            asked: false
          })
        }
        
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

  sanatizeAnswer(answer) {
    return answer.replace('\\', '').replace('\<i\>', '').replace('\</i\>', '')
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

  determineCorrectness(userAnswer, clueAnswer) {
    // To Do: Allow for more leniancy instead of exact match
    return userAnswer === clueAnswer
  }

  handleAnswerQuestion(e) {
    const userAnswer = document.getElementById('answerInput').value.toLowerCase()
    const clueAnswer = this.state.activeClue.answer.toLowerCase()
    const clueID = Number(this.state.activeClue.id)
    const cluePoints = Number(this.state.activeClue.points)
    const isCorrect = this.determineCorrectness(userAnswer, clueAnswer)
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
    
    this.state.clues.map(clue => {
      console.log(clue.answer)
    })

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div className="app">
          <header className="header">
            <img className="header__logo" src={logo} alt="Jeopardy!js" />
          </header>
          <main>
            <div className="gameboard">
              <Clues 
                category={category} 
                clues={clues} 
                answeredClues={answeredClues} 
                handleLoadQuestion={this.handleLoadQuestion}   
              />
              <Question 
                activeClue={activeClue} 
                displayMessage={displayMessage}  
                handleAnswerQuestion={this.handleAnswerQuestion} 
                handleSkipQuestion={this.handleSkipQuestion}
                handleKeepPlaying={this.handleKeepPlaying} 
              />
            </div>
            <Scoreboard score={score} />
          </main>
          <footer>

          </footer>
        </div>
      );
    }
  }
}

export default App;
