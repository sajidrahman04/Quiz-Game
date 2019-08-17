import React from "react";
import AnswerBox from './AnswerBox';

import './AnswerRow.css';

export default class AnswerRow extends React.Component {

  render() {
    return (
      <div className="component-answer-row">
        <AnswerBox></AnswerBox>
        <AnswerBox></AnswerBox>
        <AnswerBox></AnswerBox>
      </div>
    );
  }
}