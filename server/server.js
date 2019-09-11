const express = require('express');
const bodyParser = require('body-parser');
const pokemon = require('pokemon');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function getPokemonByRegion(regions){
    const pokemonList = pokemon.all();
    if(regions.length == 0){
        return pokemonList;
    }
    var pokemons = []
    if(regions.includes('kanto')){
        pokemons = pokemons.concat(pokemonList.slice(0,150));
    }
    if(regions.includes('johto')){
        pokemons = pokemons.concat(pokemonList.slice(151, 251));
    }
    if(regions.includes('hoenn')){
        pokemons = pokemons.concat(pokemonList.slice(251, 386));
    }
    if(regions.includes('sinnoh')){
        pokemons = pokemons.concat(pokemonList.slice(386, 493));
    }
    if(regions.includes('unova')){
        pokemons = pokemons.concat(pokemonList.slice(493, 649));
    }
    if(regions.includes('kalos')){
        pokemons = pokemons.concat(pokemonList.slice(649, 721));
    }
    if(regions.includes('alola')){
        pokemons = pokemons.concat(pokemonList.slice(721));
    }
    return pokemons;
}

app.get('/api/getAllPokemon', (req, res) => {
    res.send(pokemon.all());
});

app.get('/api/pokemons', (req, res) => {
    var pokemonResponse = getPokemonByRegion(req.query.regions);
    res.send(pokemonResponse);
    // var regionId = parseInt(req.params.regionId);
    // if(regionId < 1 || regionId > 7){
    //     res.status(404).send(`regionId of ${regionId} does not exist`);
    // }
    // else{
    //     res.send(getPokemonByRegion(regionId));
    // }
});


app.listen(port, () => console.log(`Listening on port ${port}`));