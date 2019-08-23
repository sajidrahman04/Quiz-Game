import React from "react";

import './AnswerBox.css';

export default class AnswerBox extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className={this.props.answer.found ? "component-answer-box found": "component-answer-box not-found"}>
        {this.props.answer.reveal ? this.props.answer.text : ""}
      </div>
    );
  }
}