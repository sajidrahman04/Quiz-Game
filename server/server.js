const express = require('express');
const bodyParser = require('body-parser');
const pokemon = require('pokemon');
const randomstring = require("randomstring");
const request = require('request');

const app = express();
const port = process.env.PORT || 5000;

var server = app.listen(port, () => console.log(`Listening on port ${port}`));

var io = require('socket.io').listen(server);

var roomId = randomstring.generate();

io.on('connection', function(socket){
    console.log("user connected");
    // generate new room id on connection so previous one does not persist
    roomId = randomstring.generate();
    // room Id handler
    socket.on('roomId', (rId) =>{
        if(rId.length != 0){
            roomId = rId;
            
        }
        socket.join(roomId);
        if(rId.length != 0){
            // get data of leader such as which regions they chose, maybe later the user names of people in the room so far etc.
            io.in(roomId).emit('give-start-data', null);
        }
    });

    // pokemon answer handler
    socket.on('pokemon-answer', (msg) => {
        console.log(msg);
        socket.broadcast.to(msg.roomId).emit('answer', msg.data);
    })
    // game start handler
    socket.on('start-game', (msg) => {
        socket.broadcast.to(msg.roomId).emit('game-start', msg.data);
    })
    // start data handler to give start data to other players from leader
    socket.on('start-data', (msg) =>{
        socket.broadcast.to(msg.roomId).emit('start-setup', msg.data);
    })
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function getPokemonByRegion(regions){
    if(regions.length == 0){
        return [];
    }
    const pokemonList = pokemon.all();
    var pokemonsByRegion = []
    if(regions.includes('kanto')){
        pokemonsByRegion.push({region: 'kanto', pokemons: pokemonList.slice(0,151)});
    }
    if(regions.includes('johto')){
        pokemonsByRegion.push({region: 'johto', pokemons: pokemonList.slice(151, 251)});
    }
    if(regions.includes('hoenn')){
        pokemonsByRegion.push({region: 'hoenn', pokemons: pokemonList.slice(251, 386)});
    }
    if(regions.includes('sinnoh')){
        pokemonsByRegion.push({region: 'sinnoh', pokemons: pokemonList.slice(386, 493)});
    }
    if(regions.includes('unova')){
        pokemonsByRegion.push({region: 'unova', pokemons: pokemonList.slice(493, 649)});
    }
    if(regions.includes('kalos')){
        pokemonsByRegion.push({region: 'kalos', pokemons: pokemonList.slice(649, 721)});
    }
    if(regions.includes('alola')){
        pokemonsByRegion.push({region: 'alola', pokemons: pokemonList.slice(721)});
    }
    return pokemonsByRegion;
}

app.get('/api/getAllPokemon', (req, res) => {
    res.send(pokemon.all());
});

app.get('/api/pokemons', (req, res) => {
    var pokemonResponse = getPokemonByRegion(req.query.regions);
    res.send(JSON.stringify(pokemonResponse));
});

app.get('/api/roomId', (req, res) => {
    res.send(JSON.stringify(roomId));
});
