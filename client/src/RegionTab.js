import React from "react";

export default class RegionTab extends React.Component {

  constructor(props){
    super(props);
  }

  render() {
    return (
        <div>
            {this.props.selectRegions.map((region) => {
                return (<button onClick={() => this.props.changePokemonShown(region)}>{region}</button>)
            })}
        </div>
    );
  }
}