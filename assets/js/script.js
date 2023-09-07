// TODO: Use api to retrieve pokemon type icons
// TODO: Build object to hold type matchup data for the battle gamemode
// TODO: Function to determine if the user selected the correct choice in the battle gamemode

// DEBUG: forces functions to use the pokemon name defined by pokeSpecies
const pokeSpecies = "pikachu";
// Object holding all pokemon types with keys
let types = {
    1: "Normal",
    2: "Fighting",
    3: "Flying",
    4: "Poison",
    5: "Ground",
    6: "Rock",
    7: "Bug",
    8: "Ghost",
    9: "Steel",
    10: "Fire",
    11: "Water",
    12: "Grass",
    13: "Electric",
    14: "Psychic",
    15: "Ice",
    16: "Dragon",
    17: "Dark",
    18: "Fairy"
}

function getTypeIcons(type) {

}


// Function that retrieves pokemon information and creates elements to hold the contents
function getPokeInfo(pokeName) {
    // Request url includes a pokemon name that is passed into the function (POKEAPI REQUIRES LOWERCASE POKEMON NAMES)
    let apiURL = `https://pokeapi.co/api/v2/pokemon/${pokeName.toLowerCase()}`
    
    // Sends request to pokeapi
    fetch(apiURL)
        .then(function (response) {
            // Formats the response into a JSON object
            return response.json();
        })
        .then(function (data) {
            // Dynamically creates each of the elements to display a pokemon's info
            let pokeImg = document.createElement("img");
            let pokeName = document.createElement("h2");
            let pokeType1 = document.createElement("h3");
            let pokeType2 = document.createElement("h3");
            let pokeID = document.createElement("h3");

            // Sets the contents of each element according to JSON data
            getPokeImage(pokeSpecies, pokeImg); // retrieves the bulbapedia img corresponding to the pokemon and assigns it as the src of pokeImg
            pokeName.textContent = "Name: " + data.name.toUpperCase().slice(0, 1) + data.name.slice(1);
            pokeType1.textContent = "Type 1: " + data.types[0].type.name.toUpperCase().slice(0, 1) + data.types[0].type.name.slice(1);
            if (data.types.length == 2) {
                pokeType2.textContent = "Type 2: " + data.types[1].type.name.toUpperCase().slice(0, 1) + data.types[1].type.name.slice(1);
            }
            // Sets contents to 'N/A' for the pokeType2 element if the pokemon only has one type
            else { pokeType2.textContent = "Type 2: N/A" }
            pokeID.textContent = "ID Number: " + data.id;
            // Appends the created elements onto the body of the document
            document.body.append(pokeImg, pokeName, pokeType1, pokeType2, pokeID);
        })
}

// This function retrieves a pokemon image from bulbapedia and assigns it as the source of the image element provided to the function
function getPokeImage(pokeName, targetEl) {
    // Base url to build request url from
    let apiURL = "https://bulbapedia.bulbagarden.net/w/api.php?origin=*"; 
    // Object that holds the keys and parameters to build the request url from
    let params = {
        action: "query",
        format: "json",
        prop: "pageimages",
        indexpageids: 1,
        piprop: "original",
        titles: `${pokeName}_(Pokémon)`
    }
    // Builds the request url from the keys and parameters provided
    Object.keys(params).forEach(function (key) { apiURL += "&" + key + "=" + params[key]; });
    
    // Sends request to bulbapedia via mediawiki api
        fetch(apiURL)
        .then(function (response) {
            // Formats the response into a JSON object
            return response.json();
        })
        .then(function (data) {
            let pid = data.query.pageids[0];
            targetEl.src = data.query.pages[pid].original.source;
        })
        .catch(function (error) { console.log(error);
        });
}

getPokeInfo(pokeSpecies); // Requests api information for the pokemon name passed in to the function