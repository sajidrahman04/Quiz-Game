import React from 'react';
import './App.css';
import AnswerTable from './AnswerTable';
import AnswerInput from './AnswerInput';
import ScoreBoard from './ScoreBoard';

class QuizForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      answerText: "",
      answerList: [
          {text: "Pikachu", reveal: false, found: false},
          {text: "Bulbasaur", reveal: false, found: false},
          {text: "Squirtle", reveal: false, found: false},
          {text: "Charmander", reveal: false, found: false}
        ],
      numItems: 4,
      numCols: 2,
      currScore: 0,
      gameStart: false
    }
    this.checkTerm = this.checkTerm.bind(this);
    this.gameStart = this.gameStart.bind(this);
    this.fillEmptyAnswers = this.fillEmptyAnswers.bind(this);
  }

  checkTerm(term){
    var foundAnswer = false;
    var newScore = this.state.currScore;
    var foundIndex = -1;
    for (var i = 0; i < this.state.numItems; i++) {
      if(this.state.answerList[i].found === false && term.toLowerCase() === this.state.answerList[i].text.toLowerCase()){
        foundAnswer = true;
        newScore += 1;
        this.setState({
          currScore: newScore
        });
        foundIndex = i;
      }
    }
    if(foundAnswer){
        var newAnswerList = this.state.answerList;
        newAnswerList[foundIndex].found = true;
        newAnswerList[foundIndex].reveal = true;
        this.setState({
            answerList: newAnswerList
        })
    }
    if(newScore === this.state.numItems){
      this.setState({
        gameStart: false
      })
    }
    return foundAnswer;
  }

  fillEmptyAnswers(){
      var newAnswerList = this.state.answerList;
      newAnswerList.forEach((answer) => {
        if(answer.found === false){
            answer.reveal = true;
        }
      })
      this.setState({
          answerList: newAnswerList,
          currScore: this.state.numItems,
          gameStart: false,
      })
  }

  gameStart(){
    var newAnswerList = this.state.answerList;
    newAnswerList.forEach((answer) => {
        answer.found = false;
        answer.reveal = false;
    })

    this.setState({
      currScore: 0,
      gameStart: true,
      answerList: newAnswerList
    })
  }

  render(){
    return (
      <div className="App">
        <button onClick={this.gameStart}>START GAME</button>
          <div>
          <AnswerTable numItems = {this.state.numItems} 
            answerList = {this.state.answerList}
            numCols = {this.state.numCols}>
          </AnswerTable>
          <AnswerInput checkTerm = {this.checkTerm} gameStart={this.state.gameStart}></AnswerInput>
          <ScoreBoard currScore={this.state.currScore} total={this.state.numItems}></ScoreBoard>
          <button onClick={this.fillEmptyAnswers}>GIVE UP</button>
        </div>
        
      </div>
    );
  }
  
}

export default QuizForm;