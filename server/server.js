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
    socket.on('roomId', (rId) =>{
        if(rId.length != 0){
            roomId = rId;
        }
        socket.join(roomId);
    });
    socket.on('msg', (msg) => {
        console.log(msg.roomId, msg.pkmn);
        // send answer to all users except the one that sent
        socket.broadcast.to(msg.roomId).emit('m', msg.pkmn);
    })
});



// // handle incoming connections from clients
// io.sockets.on('connection', function(socket) {
//     // once a client has connected, we expect to get a ping from them saying what room they want to join
//     socket.on('room', function(room) {
//         socket.join(room);
//     });
// });

// // now, it's easy to send a message to just the clients in a given room
// room = "abc123";
// io.sockets.in(room).emit('message', 'what is going on, party people?');

// // this message will NOT go to the client defined above
// io.sockets.in('foobar').emit('message', 'anyone in this room yet?');



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
