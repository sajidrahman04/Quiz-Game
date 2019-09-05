import React from "react";

export default class Timer extends React.Component {

  constructor(props){
    super(props);

  }

  render() {
    return (
        <div className="timer">
          {this.props.currTime}
        </div>
      );
  }
}