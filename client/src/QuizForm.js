import React from 'react';
import './App.css';
import AnswerTable from './AnswerTable';
import AnswerInput from './AnswerInput';
import ScoreBoard from './ScoreBoard';
import Timer from './Timer';
import RegionTab from './RegionTab';
import SelectRegion from './SelectRegion';
import io from 'socket.io-client';



class QuizForm extends React.Component {

  constructor(props){
    super(props);
    this.state = {
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
      regions: ['sinnoh', 'johto'],
      roomId: "",
      clientSocket: io("http://localhost:5000")
    }
    this.checkTerm = this.checkTerm.bind(this);
    this.gameStart = this.gameStart.bind(this);
    this.tickTime = this.tickTime.bind(this);
    this.fillEmptyAnswers = this.fillEmptyAnswers.bind(this);
    this.changePokemonShown = this.changePokemonShown.bind(this);
    this.toggleRegion = this.toggleRegion.bind(this);
  }

  componentWillMount(){
    this.selectRegions();
    this.setupRoom();
  }

  componentDidMount() {
    
    this.state.clientSocket.on('m',(msg) =>{
      this.checkTerm(msg);
    })
  }

  setupRoom(){
    this.callSocket()
      .then((res) => {
        console.log(res);
        this.setState({roomId: res});
      })
      .catch(err => console.log(err));
  }

  callSocket = async () => {
    let params = new URLSearchParams(window.location.search);
    if(params.get("roomId") != undefined){
      this.state.clientSocket.emit('roomId', params.get("roomId"));
      return params.get("roomId");
    }
    this.state.clientSocket.emit('roomId', '');
    const response = await fetch(`/api/roomId`);
    const body = await response.json();
    return body;
  };



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
          maxScore: totalPokemon,
          selectedRegion: res[0].region
        })
        this.changePokemonShown(this.state.selectedRegion);
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

  changePokemonShown(region){
    var selectedRegionPokemon = this.getSelectedPokemon(region, this.state.answerList);
    this.setState({
      selectedPokemons: selectedRegionPokemon,
      numItems: selectedRegionPokemon.length,
      numCols: selectedRegionPokemon.length
    })
  }

  toggleRegion(region){
    var index = this.state.regions.indexOf(region);
    var newRegionList;
    if(index > -1){
      newRegionList = this.state.regions.splice(index, 1);
    }
    else{
      newRegionList = this.state.regions.push(region);
    }
    this.setState({
      region: newRegionList
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
          this.setState({
            currScore: this.state.currScore + 1
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
        //emit right answer to all other users in room
        this.state.clientSocket.emit('msg',{roomId: this.state.roomId, pkmn: newPokemonList[foundIndex].text});
        var newAnswerList = this.state.answerList.map((elem) =>
            (elem.region == changedRegion) ? {region: elem.region, pokemons: newPokemonList} : elem
        )
        this.setState({
            answerList: newAnswerList,
        })
        this.changePokemonShown(changedRegion);
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
    this.selectRegions();
    var newAnswerList = this.state.answerList.map((elem) =>
    ({region: elem.region, 
      pokemons: elem.pokemons.map(p => ({text: p.text, found: false, reveal: false}))
    }));

    this.setState({
      currScore: 0,
      gameStart: true,
      answerList: newAnswerList,
      selectedPokemons: this.getSelectedPokemon(this.state.selectedRegion, newAnswerList),
      
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
        <h1>POKEMON QUIZ</h1>
        <a href={`http://localhost:3000/?roomId=${this.state.roomId}`} target="_blank">invite link</a> 
        {!this.state.gameStart && (
        <div>
          <h2>Choose the region(s) you want to play on</h2> 
          <SelectRegion toggleRegion={this.toggleRegion}></SelectRegion>
          <button onClick={this.gameStart}>START GAME</button>
        </div>)}
          <div>
          
          <button onClick={this.fillEmptyAnswers}>GIVE UP</button> <br></br>
          <Timer currTime = {this.state.timer.currTime}></Timer>
          <RegionTab changePokemonShown = {this.changePokemonShown} selectRegions = {this.state.regions}></RegionTab>
          <AnswerTable numItems = {this.state.numItems} 
            answerList = {this.state.selectedPokemons}
            numCols = {this.state.numCols}>
          </AnswerTable>
          <AnswerInput checkTerm = {this.checkTerm} gameStart={this.state.gameStart}></AnswerInput>
          <ScoreBoard currScore={this.state.currScore} total={this.state.maxScore}></ScoreBoard>
        </div>
        
      </div>
    );
  }
  
}

export default QuizForm;
