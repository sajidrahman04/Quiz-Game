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
      currScore: 0
    }
    this.checkTerm = this.checkTerm.bind(this);
  }

  checkTerm(term){
    var foundAnswer = false;
    for (var i = 0; i < this.state.numItems; i++) {
      var newAnswers = this.state.foundItems;
      if(this.state.foundItems[i] === false && term.toLowerCase() === this.state.allAnswers[i].toLowerCase()){
        newAnswers[i] = true;
        foundAnswer = true;
        this.setState({
          currScore: this.state.currScore+1
        });
      }
    }
    this.setState({
      foundItems: newAnswers
    });
    return foundAnswer;
  }

  render(){
    return (
      <div className="App">
        <AnswerTable numItems = {this.state.numItems} 
          foundItems = {this.state.foundItems} answers = {this.state.allAnswers}
          numCols = {this.state.numCols}>
        </AnswerTable>
        <AnswerInput checkTerm = {this.checkTerm}></AnswerInput>
        <ScoreBoard currScore={this.state.currScore} total={this.state.numItems}></ScoreBoard>
      </div>
    );
  }
  
}

export default App;
