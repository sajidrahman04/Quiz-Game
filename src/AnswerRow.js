import React from "react";
import AnswerBox from './AnswerBox';

import './AnswerRow.css';

export default class AnswerRow extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="component-answer-row">
        <AnswerBox answer = {this.props.answer}></AnswerBox>
        <AnswerBox></AnswerBox>
        <AnswerBox></AnswerBox>
      </div>
    );
  }
}