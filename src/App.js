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
      numCols: 3
    }
    this.checkTerm = this.checkTerm.bind(this);
  }

  checkTerm(term){
    for (var i = 0; i < 3; i++) {
      var newAnswers = this.state.foundItems;
      if(term == this.state.allAnswers[i]){
        newAnswers[i] = true;
      }
    }
    this.setState({
      foundItems: newAnswers
    });
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
