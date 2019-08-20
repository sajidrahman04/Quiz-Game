import React from 'react';
import './App.css';
import AnswerTable from './AnswerTable';
import AnswerInput from './AnswerInput';
import ScoreBoard from './ScoreBoard';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      answerText: "",
      allAnswers: ["Pikachu", "Bulbasaur", "Squirtle", "Charmander"],
      foundItems: [false, false, false, false],
      numItems: 4,
      numCols: 2,
      currScore: 0,
      gameStart: false
    }
    this.checkTerm = this.checkTerm.bind(this);
    this.gameStart = this.gameStart.bind(this);
  }

  checkTerm(term){
    var foundAnswer = false;
    var newScore = this.state.currScore;
    for (var i = 0; i < this.state.numItems; i++) {
      var newAnswers = this.state.foundItems;
      if(this.state.foundItems[i] === false && term.toLowerCase() === this.state.allAnswers[i].toLowerCase()){
        newAnswers[i] = true;
        foundAnswer = true;
        newScore += 1;
        this.setState({
          currScore: newScore
        });
      }
    }
    this.setState({
      foundItems: newAnswers
    });
    if(newScore === this.state.numItems){
      this.setState({
        gameStart: false
      })
    }
    return foundAnswer;
  }

  gameStart(){
    this.setState({
      foundItems: [false, false, false, false],
      gameStart: true
    })
  }

  render(){
    return (
      <div className="App">
        
        {this.state.gameStart ? 
          <div>
          <AnswerTable numItems = {this.state.numItems} 
            foundItems = {this.state.foundItems} answers = {this.state.allAnswers}
            numCols = {this.state.numCols}>
          </AnswerTable>
          <AnswerInput checkTerm = {this.checkTerm}></AnswerInput>
          <ScoreBoard currScore={this.state.currScore} total={this.state.numItems}></ScoreBoard>
        </div>
        :<button onClick={this.gameStart}>START GAME</button>}
        
        
      </div>
    );
  }
  
}

export default App;
