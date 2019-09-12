import React from 'react';
import './App.css';
import AnswerTable from './AnswerTable';
import AnswerInput from './AnswerInput';
import ScoreBoard from './ScoreBoard';
import Timer from './Timer';

class QuizForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      answerText: "",
      numItems: 0,
      numCols: 0,
      currScore: 0,
      maxScore: 0,
      gameStart: false,
      answerList: [],
      selectedRegion: 'sinnoh',
      selectedPokemons: [],
      timer: {isOn: false, currTime: 100, maxTime: 100},
      maxTime: 100,
      regions: ['sinnoh', 'johto']
    }
    this.checkTerm = this.checkTerm.bind(this);
    this.gameStart = this.gameStart.bind(this);
    this.tickTime = this.tickTime.bind(this);
    this.fillEmptyAnswers = this.fillEmptyAnswers.bind(this);
    this.changePokemonShown = this.changePokemonShown.bind(this);
  }

  componentDidMount() {
    this.selectRegions();
  }

  selectRegions(){
    this.callApi()
      .then((res) => {
        var totalPokemon = 0;
        res.forEach(po =>{
          totalPokemon += po.pokemons.length;
          this.setState({ 
            answerList: this.state.answerList.concat({region: po.region, pokemons: po.pokemons.map(name => ({text: name, reveal: false, found: false}))})
          })
        })
        this.setState({
          maxScore: totalPokemon
        })
        this.changePokemonShown();
      })
      .catch(err => console.log(err));
  }
  
  callApi = async () => {
    var urlQuery;
    if(this.state.regions.length === 0){
      urlQuery = "";
    }
    else{
      urlQuery = "?" + this.state.regions.map(r => "regions[]="+r).join("&");
    }
    const response = await fetch(`/api/pokemons${urlQuery}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  };

  getSelectedPokemon(changedRegion, newAnswerList){
    const pokemonsfromRegion = newAnswerList.find((elem) => {return elem.region == changedRegion});
    if(pokemonsfromRegion == undefined){
      return [];
    }
    return pokemonsfromRegion.pokemons;
  }

  changePokemonShown(){
    var selectedRegionPokemon = this.getSelectedPokemon(this.state.selectedRegion, this.state.answerList);
    this.setState({
      selectedPokemons: selectedRegionPokemon,
      numItems: selectedRegionPokemon.length,
      numCols: selectedRegionPokemon.length
    })
  }
  

  checkTerm(term){
    var foundAnswer = false;
    var newScore = this.state.currScore;
    var foundIndex = -1;
    var changedRegion;
    this.state.answerList.forEach((regionPokemon) => {
      for (var i = 0; i < regionPokemon.pokemons.length; i++) {
        if(regionPokemon.pokemons[i].found === false && term.toLowerCase() === regionPokemon.pokemons[i].text.toLowerCase()){
          foundAnswer = true;
          newScore += 1;
          this.setState({
            currScore: newScore
          });
          foundIndex = i;
          changedRegion = regionPokemon.region;
        }
      }
    })
    
    if(foundAnswer){
        var newPokemonList = this.getSelectedPokemon(changedRegion, this.state.answerList);
        newPokemonList[foundIndex].found = true;
        newPokemonList[foundIndex].reveal = true;
        var newAnswerList = this.state.answerList.map((elem) =>
            (elem.region == changedRegion) ? {region: elem.region, pokemons: newPokemonList} : elem
        )
        this.setState({
            answerList: newAnswerList,
            selectedPokemons: this.getSelectedPokemon(this.state.selectedRegion, newAnswerList)
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

      var newAnswerList = this.state.answerList.map((elem) =>
      ({region: elem.region, 
        pokemons: elem.pokemons.map(p => ({text: p.text, found: p.found, reveal: true}))
      }));
      this.setState({
          answerList: newAnswerList,
          gameStart: false,
          timer: {isOn: false, currTime: this.maxTime , maxTime: 60},
          selectedPokemons: this.getSelectedPokemon(this.state.selectedRegion, newAnswerList)
      })
      clearInterval(this.timer);
  }

  

  gameStart(){
    var newAnswerList = this.state.answerList.map((elem) =>
    ({region: elem.region, 
      pokemons: elem.pokemons.map(p => ({text: p.text, found: false, reveal: false}))
    }));

    this.setState({
      currScore: 0,
      gameStart: true,
      answerList: newAnswerList,
      selectedPokemons: this.getSelectedPokemon(this.state.selectedRegion, newAnswerList)
    })
    this.tickTime()
  }

  tickTime(){
    // change this with this.setState
    this.state.timer.maxTime = Date.now() - this.state.timer.maxTime;
    this.timer = setInterval(() => { 
        var newTimer = {isOn: true, currTime: this.state.maxTime - Math.ceil((Date.now() - this.state.timer.maxTime)/1000), maxTime: this.state.timer.maxTime}
        this.setState({
            timer: newTimer
        })
        if(this.state.timer.currTime == 0){
          this.fillEmptyAnswers();
        }
    }, 1);
  }

  render(){
    return (
      <div className="App">
        <button onClick={this.gameStart}>START GAME</button>
          <div>
          <Timer currTime = {this.state.timer.currTime}></Timer>
          <AnswerInput checkTerm = {this.checkTerm} gameStart={this.state.gameStart}></AnswerInput>
          <ScoreBoard currScore={this.state.currScore} total={this.state.maxScore}></ScoreBoard>
          <button onClick={this.fillEmptyAnswers}>GIVE UP</button>
          <AnswerTable numItems = {this.state.numItems} 
            answerList = {this.state.selectedPokemons}
            numCols = {this.state.numCols}>
          </AnswerTable>
        </div>
        
      </div>
    );
  }
  
}

export default QuizForm;
