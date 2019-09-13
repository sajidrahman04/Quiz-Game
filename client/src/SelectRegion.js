import React from "react";

export default class SelectRegion extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    const allRegions = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova', 'kalos', 'alola'];
    return (
        <div>
            {allRegions.map((region) => {
                return (<button onClick={() => this.props.toggleRegion(region)}>{region}</button>)
            })}
        </div>
    );
  }
}