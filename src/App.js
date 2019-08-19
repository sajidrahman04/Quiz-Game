import React from 'react';
import logo from './logo.svg';
import './App.css';
import AnswerTable from './AnswerTable';
import AnswerInput from './AnswerInput';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      answerText: "",
      allAnswers: ["Pikachu", "Bulbasaur", "Squirtle"],
      foundItems: [false, false, false],
      numItems: 3,
      numCols: 2
    }
    this.checkTerm = this.checkTerm.bind(this);
  }

  checkTerm(term){
    var foundAnswer = false;
    for (var i = 0; i < this.state.numItems; i++) {
      var newAnswers = this.state.foundItems;
      if(term.toLowerCase() === this.state.allAnswers[i].toLowerCase()){
        newAnswers[i] = true;
        foundAnswer = true;
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
      </div>
    );
  }
  
}

export default App;
