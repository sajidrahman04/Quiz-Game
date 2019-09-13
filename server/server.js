const express = require('express');
const bodyParser = require('body-parser');
const pokemon = require('pokemon');

const app = express();
const port = process.env.PORT || 5000;

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
    // var regionId = parseInt(req.params.regionId);
    // if(regionId < 1 || regionId > 7){
    //     res.status(404).send(`regionId of ${regionId} does not exist`);
    // }
    // else{
    //     res.send(getPokemonByRegion(regionId));
    // }
});


app.listen(port, () => console.log(`Listening on port ${port}`));