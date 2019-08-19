import React from "react";

import './AnswerBox.css';

export default class AnswerBox extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="component-answer-box">
        {this.props.answer ? this.props.answer : "Default"}
      </div>
    );
  }
}