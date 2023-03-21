import './styles.scss'
import logo from './images/jeopardy_logo.png'
import React from 'react';
import Clues from './Clues'
import Score from './Score'
// import Answer from './Answer'

const maxCategoryID = 28001
const categoryCount = 1
const stateData = []

/*
categories: [{
  title: XXXX,
  clues: [
    question: xxxx,
    answer: xxx,
    value: xxx
  ]
}]
*/
class App extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      error: null,
      isLoaded: false,
      categories: [],
      score: 0
    };
  }

  componentDidMount() {
    if (stateData.length !== 0) {
      return false
    }
    const categoryOffset = Math.random() * (maxCategoryID - 1) + 1
    
    fetch(`http://jservice.io/api/categories?count=${categoryCount}&offset=${categoryOffset}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(categories => {
        for(let i=0; i < categories.length; i++) {
          fetch(`http://jservice.io/api/category?id=${categories[i].id}`, {
            method: 'GET'
          })
          .then(response => response.json())
          .then(category => {
            let categoryData = { 
              id: categories[i].id,
              title: categories[i].title ,
              clues: []
            }

            for (let j=0; j < 5; j++) {
              categoryData.clues.push({
                question: category.clues[j].question,
                answer: category.clues[j].answer,
                value: category.clues[j].value,
                asked: false
              })
            }
            

            this.setState((state) => {
              return {
                isLoaded: true,
                categories: [...state.categories, categoryData]
              }
            });
          })
        }
      })

      //   // Note: it's important to handle errors here
      //   // instead of a catch() block so that we don't swallow
      //   // exceptions from actual bugs in components.
      //   (error) => {
      //     this.setState({
      //       isLoaded: true,
      //       error
      //     });
      //   }
      // )
  }

  render() {
    const { error, isLoaded, categories, score } = this.state

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
            <div className="app">
              <Clues categories={categories}/>
              <Score score={score} />
              {/* <Answer /> */}
            </div>
          </main>
          <footer>

          </footer>
        </div>
      );
    }
  }
}

export default App;
