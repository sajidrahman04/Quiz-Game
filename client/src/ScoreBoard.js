import React from "react";

import './AnswerBox.css';

export default function ScoreBoard(props) {
  return (
    <div className="score-board">
      {props.currScore}/{props.total}
    </div>
  );
}