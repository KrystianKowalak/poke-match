// TODO: Use api to retrieve pokemon type icons
// TODO: Build object to hold type matchup data for the battle gamemode
// TODO: Function to determine if the user selected the correct choice in the battle gamemode

//{"id": 0, "name": "null", "type1": "null", "type2" : "null", "flavor_text": "null" "habitat": "null", "stats": {}, "abilities": {}, "sprites": {}}
let pokeData = [];
let pokemonByTypes = [];

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + 1);
}

//------------------------------API CALLS------------------------------
//----------POKEAPI----------
function fetchAllData() {
    fetch("https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=110")
        .then(function (response) {
            if (!(response.status == 200)) {

                throw new Error("Not 2xx response", {cause: response});
            }
            return response.json();
        })
        .then(function (data) {
            for (let i = 0; i < data.count; i++) {
                const dataObject = {"id": 0, "name": "null", "type1": "null", "type2" : "null", "flavor_text": "null", "habitat": "null", "stats": {}, "abilities": {}, "sprites": {}};
                dataObject.id = i + 1;
                dataObject.name = data.results[i].name;
                pokeData.push(dataObject);

                fetch("https://pokeapi.co/api/v2/pokemon/" + (i + 1))
                    .then(function (response) {
                        if (!(response.status == 200)) {
    
                            throw new Error("Not 2xx response", {cause: response});
                        }
                        return response.json();
                    })
                    .then(function (data) {
                        pokeData[i].type1 = data.types[0].type.name.toUpperCase().slice(0, 1) + data.types[0].type.name.slice(1);
                        if (data.types.length == 2) {
                            pokeData[i].type2 = data.types[1].type.name.toUpperCase().slice(0, 1) + data.types[1].type.name.slice(1);
                        }
                        else {
                            pokeData[i].type2 = "N/A"
                        }
                        pokeData[i].stats = data.stats;
                        pokeData[i].abilities = data.abilities;
                        pokeData[i].sprites = data.sprites;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                
                fetch("https://pokeapi.co/api/v2/pokemon-species/" + (i + 1))
                    .then(function (response) {
                        if (!(response.status == 200)) {
    
                            throw new Error("Not 2xx response", {cause: response});
                        }
                        return response.json();
                    })
                    .then(function (data) {
                        pokeData[i].habitat = data.habitat.name;
                        for (let index = 0; index < data.flavor_text_entries.length; index++) {
                            if(data.flavor_text_entries[index].language.name == "en") {
                                pokeData[i].flavor_text = data.flavor_text_entries[index].flavor_text
                                pokeData[i].flavor_text = pokeData[i].flavor_text.replaceAt(pokeData[i].flavor_text.search("é"), "e")
                                break;
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
           }
        })
        .catch(function (error) {
            console.log(error);
        });
    console.log(pokeData);
}
//----------MEDIAWIKIAPI----------
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
//------------------------------ICON BUTTONS------------------------------
function assignIcons(types) {
    let iconContainer = document.createElement("div");
    for (i = 0; i < types.length; i++) {
        let typeIcon = document.createElement("img");
        getTypeIcon(types[i], typeIcon);
        typeIcon.title = types[i];
        typeIcon.id = types[i];
        typeIcon.onclick = function() {
            for (let i = 0; i < pokeData.length; i++) {
                if((pokeData[i].type1.toLowerCase() == this.id) || (pokeData[i].type2.toLowerCase() == this.id)) {
                    pokemonByTypes.push(pokeData[i]);
                }
            }
            for (let i = 0; i < pokemonByTypes.length; i++) {
                console.log(pokemonByTypes[i]);
            }
        };
        iconContainer.append(typeIcon);
    }
    document.getElementById("pokedex-aside").append(iconContainer);
}

function getTypeIcon(type, targetEl) {
    // Base url to build request url from
    let apiURL = "http://bulbapedia.bulbagarden.net/w/api.php?origin=*";
    // Object that holds the keys and parameters to build the request url from
    let params = {
        action: "query",
        format: "json",
        prop: "pageimages",
        indexpageids: 1,
        imlimit: "max",
        imdir: "ascending",
        titles: `File:${type}_icon_HOME3.png`
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

function typeButtons(types, location) {
    let buttonContainer = document.createElement("div");
    let typesArray = Object.keys(types);
    let hexArray = Object.values(types);
    // buttonContainer.style.setProperty("display", "flex");
    // buttonContainer.style.setProperty("width", "250px");
    // buttonContainer.style.setProperty("flex-wrap", "wrap");
    // buttonContainer.style.setProperty("justify-content", "center");
    // buttonContainer.style.setProperty("border-style", "solid");
    // buttonContainer.style.setProperty("border-width", "3px");
    // buttonContainer.style.setProperty("padding", "10px");
    // buttonContainer.style.setProperty("gap", "10px");

    for (i = 0; i < typesArray.length; i++) {
        let typeButton = document.createElement("button");
        typeButton.textContent = typesArray[i];
        typeButton.id = typesArray[i] + "-button";
        // typeButton.style.setProperty("background-color", hexArray[i]);
        // typeButton.style.setProperty("color", "white");
        // typeButton.style.setProperty("min-width","66px")
        // typeButton.style.setProperty("border-radius","5px")
        typeButton.onclick = function() {
            console.log(typeButton.textContent);
        };
        // buttonContainer.append(typeButton);
    }
    location.append(buttonContainer);
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
            document.querySelector(".facts").append(document.getElementById(`${data.types[0].type.name}-button`))
            if (data.types.length == 2) {
                document.querySelector(".facts").append(document.getElementById(`${data.types[1].type.name}-button`))
            }
            document.getElementById("pokemon-link").href = `https://bulbapedia.bulbagarden.net/wiki/${data.name}_(Pok%C3%A9mon)`;
        document.getElementById("pokemon-link").textContent = `Bulbapedia-${data.name}`;
        })
        .catch(function (error) {
            console.log(error);
        });
}

//------------------------------Executable Code------------------------------

// Runs on site load to load functions
document.addEventListener('DOMContentLoaded', function() {
    fetchAllData()
    //setPokedexInfo();
    assignIcons(Object.keys(types));
});
