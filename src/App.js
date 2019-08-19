import React from 'react';
import logo from './logo.svg';
import './App.css';
import AnswerRow from './AnswerRow';
import AnswerInput from './AnswerInput';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      answerText: ""
    }
    this.checkTerm = this.checkTerm.bind(this);
  }

  checkTerm(term){
    this.setState({
      answerText: term == "Answer" ? "Got it": "Nope"
    });
  }

  render(){
    return (
      <div className="App">
        <AnswerRow answer = {this.state.answerText}></AnswerRow>
        <AnswerInput checkTerm = {this.checkTerm}></AnswerInput>
      </div>
    );
  }
  
}

export default App;
