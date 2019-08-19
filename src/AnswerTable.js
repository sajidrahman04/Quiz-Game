import React from "react";
import AnswerBox from './AnswerBox';

import './AnswerRow.css';

export default class AnswerTable extends React.Component {

  constructor(props){
    super(props);

  }

  render() {
    var answerBoxes = [];
    var numItems = this.props.numItems;
    var numCols = this.props.numCols;
    var numRows = Math.ceil(numItems/numCols);
    for (var i = 0; i < numRows; i++) {
      var index = i*numCols;
      answerBoxes.push(<AnswerRow 
        numCols={numCols} 
        foundItems={this.props.foundItems.slice(index, Math.min(index+numCols, numItems))}
        answers={this.props.answers.slice(index, Math.min(index+numCols, numItems))}>          
        </AnswerRow>)
    }
    return (
      answerBoxes
    );
  }
}

function AnswerRow(props) {
  var row = [];
  for(var i = 0; i < props.numCols; i++){
    row.push(<AnswerBox found={props.foundItems[i]} answer={props.answers[i]}></AnswerBox>)
  }
  return (
    <div className="component-answer-row">
      {row}
    </div>
  );
}