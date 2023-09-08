// TODO: Use api to retrieve pokemon type icons
// TODO: Build object to hold type matchup data for the battle gamemode
// TODO: Function to determine if the user selected the correct choice in the battle gamemode

// DEBUG: forces functions to use the pokemon name defined by pokeSpecies
const pokeSpecies = "torchic";

// Object holding all pokemon types and their background colors
const types = {
    "normal": "#A8A77A",
    "fighting": "#C22E28",
    "flying": "#A98FF3",
    "poison": "#A33EA1",
    "ground": "#E2BF65",
    "rock": "#B6A136",
    "bug": "#A6B91A",
    "ghost": "#735797",
    "steel": "#B7B7CE",
    "fire": "#EE8130",
    "water": "#6390F0",
    "grass": "#7AC74C",
    "electric": "#F7D02C",
    "psychic": "#F95587",
    "ice": "#96D9D6",
    "dragon": "#6F35FC",
    "dark": "#705746",
    "fairy": "#D685AD"
};

function assignIcons(types) {
    let iconContainer = document.createElement("div");
    iconContainer.style.setProperty("display", "flex");
    iconContainer.style.setProperty("max-width", "250px");
    iconContainer.style.setProperty("flex-wrap", "wrap");
    for (i = 0; i < types.length; i++) {
        let typeIcon = document.createElement("img");
        getTypeIcon(types[i], typeIcon);
        iconContainer.append(typeIcon);
    }
    document.getElementById("pokedex-aside").append(iconContainer);
}

function typeButtons(types, location) {
    let buttonContainer = document.createElement("div");
    let typesArray = Object.keys(types);
    let hexArray = Object.values(types);
    buttonContainer.style.setProperty("display", "flex");
    buttonContainer.style.setProperty("width", "325px");
    buttonContainer.style.setProperty("flex-wrap", "wrap");
    buttonContainer.style.setProperty("justify-content", "center");
    buttonContainer.style.setProperty("border-style", "solid");
    buttonContainer.style.setProperty("border-width", "3px");
    buttonContainer.style.setProperty("padding", "10px");
    buttonContainer.style.setProperty("gap", "10px");

    for (i = 0; i < typesArray.length; i++) {
        let typeButton = document.createElement("button");
        typeButton.textContent = typesArray[i];
        typeButton.style.setProperty("background-color", hexArray[i]);
        typeButton.style.setProperty("color", "white");
        typeButton.style.setProperty("min-width","66px")
        typeButton.style.setProperty("border-radius","5px")
        typeButton.onclick = function() {
            console.log(typeButton.textContent);
        };
        buttonContainer.append(typeButton);
    }
    location.append(buttonContainer);
}

function getTypeIcon(type, targetEl) {
    // Base url to build request url from
    let apiURL = "https://bulbapedia.bulbagarden.net/w/api.php?origin=*";
    // Object that holds the keys and parameters to build the request url from
    let params = {
        action: "query",
        format: "json",
        prop: "pageimages",
        indexpageids: 1,
        imlimit: "max",
        imdir: "ascending",
        titles: "File:${type}_icon_HOME3.png"
    }
    // Builds the request url from the keys and parameters provided
    Object.keys(params).forEach(function (key) { apiURL += "&" + key + "=" + params[key]; });
    //Sends requestto bulbapedia via mediawiki api
    fetch(apiURL)
        .then(function (response) {
            // Formats the response into a JSON object
            return response.json();
        })
        .then(function (data) {
            let pid = data.query.pageids[0];
            targetEl.src = data.query.pages[pid].thumbnail.source;
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Function that retrieves pokemon information and creates elements to hold the contents
function getPokeInfo(pokeName, nameEl, type1El, type2El, idEl) {
    // Request url includes a pokemon name that is passed into the function (POKEAPI REQUIRES LOWERCASE POKEMON NAMES)
    let apiURL = `https://pokeapi.co/api/v2/pokemon/${pokeName.toLowerCase()}`

    // Sends request to pokeapi
    fetch(apiURL)
        .then(function (response) {
            // Throws error if server doesnt respond with a 200 code
            if (!(response.status == 200)) {

                throw new Error("Not 2xx response", {cause: response});
            }
            // Formats the response into a JSON object
            return response.json();
        })
        .then(function (data) {
            // Sets the contents of each target element according to JSON data
            nameEl.textContent = "Name: " + data.name.toUpperCase().slice(0, 1) + data.name.slice(1);
            type1El.textContent = "Type 1: " + data.types[0].type.name.toUpperCase().slice(0, 1) + data.types[0].type.name.slice(1);
            if (data.types.length == 2) {
                type2El.textContent = "Type 2: " + data.types[1].type.name.toUpperCase().slice(0, 1) + data.types[1].type.name.slice(1);
            }
            // Sets contents to 'N/A' for the pokeType2 element if the pokemon only has one type
            else {
                type2El.textContent = "Type 2: N/A" 
            }
            idEl.textContent = "ID Number: " + data.id;
        })
        // Catches any error response from the server
        .catch(function (error) {
            console.log(error);
        });
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
            // Throws error if server doesnt respond with a 200 code
            if (!(response.status == 200)) {

                throw new Error("Not 2xx response", {cause: response});
            }
            // Formats the response into a JSON object
            return response.json();
        })
        .then(function (data) {
            let pid = data.query.pageids[0];
            // Assigns the target element with the provided image from mediawiki api
            targetEl.src = data.query.pages[pid].original.source;
        })
        // Catches any error response from the server
        .catch(function (error) {
            console.log(error);
        });
}

// This function retrieves a pokemon's description by the pokemons id number from pokeAPI and assigns it as text to the target element provided to the function
function getPokemonFlavor_text(id, targetEl) {
    // Sends request to pokeapi
    fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
        .then(function (response) {
            // Throws error if server doesnt respond with a 200 code
            if (!(response.status == 200)) {
                throw new Error("Not 2xx response", {cause: response});
            }
            // Formats the response into a JSON object
            return response.json();
        })
        .then(function (data) {
            // Assigns the target element with the provided text from pokeAPI
            targetEl.textContent = data.flavor_text_entries[0].flavor_text;
        })
        // Catches any error response from the server
        .catch(function (error) {
            console.log(error);
        });
}


// work in progress
function setPokedexInfo() {
    typeButtons(types, document.querySelector(".types"));
    getPokeImage(pokeSpecies, document.getElementById("pokedex-image"));
    getPokeInfo(pokeSpecies, document.getElementById("Pokemon-name"), document.getElementById("Pokemon-type1"), document.getElementById("Pokemon-type2"), document.getElementById("Pokemon-id"));

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokeSpecies.toLowerCase()}`)
        .then(function (response) {
            if (!(response.status == 200)) {

                throw new Error("Not 2xx response", {cause: response});
            }
            return response.json();
        })
        .then(function (data) {
            getPokemonFlavor_text(data.id, document.getElementById("flavor-text"));
        })
        .catch(function (error) {
            console.log(error);
        });
}

//------------------------------Executable Code------------------------------

// Runs on site load to load functions
document.addEventListener('DOMContentLoaded', function() {
    setPokedexInfo();
    assignIcons(Object.keys(types));
});
