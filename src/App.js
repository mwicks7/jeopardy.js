import './App.css';
import React from 'react';
import Category from './Category.js'

const maxCategoryID = 28001
const categoryCount = 2

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
      categories: []
    };
  }
// this.setState({
//           isLoaded: true,
//           items: res.results
//         });
  componentDidMount() {
    const categoryOffset = Math.random() * (maxCategoryID - 1) + 1
    
    fetch(`http://jservice.io/api/categories?count=${categoryCount}&offset=${categoryOffset}`, {
      method: 'GET'
    })
      .then(categories => categories.json())
      .then(categories => {
        for(let i=0; i < categories.length; i++) {
          fetch(`http://jservice.io/api/category?id=${categories[i].id}`, {
            method: 'GET'
          })
          .then(category => category.json())
          .then(category => {
            let categoryData = { 
              id: categories[i].id,
              title: categories[i].title 
            }
            categoryData.clues = category.clues.map(question => {
              return {
                question: question.question,
                answer: question.answer,
                value: question.value,
                asked: false
              }
            })

            this.setState({
              isLoaded: true,
              categories: [...this.state.categories, categoryData]
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
    const { error, isLoaded, categories } = this.state
    console.log(categories)

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <div>Loading...</div>
    } else {
      return (
        <div className="game">
          <div className="clues-container">
            {categories.map( category => <Category category={category} /> )}
          </div>
          <div className="answer-container">
            
          </div>
        </div>
      );
    }
  }
}

export default App;
