//--------------------------------------------------GLOBAL VARIABLES--------------------------------------------------
//Example of pokeData
//{"id": 0, "name": "null", "type1": "null", "type2" : "null", "flavor_text": "null" "habitat": "null", "stats": {}, "abilities": {}, "sprites": {}}
let pokeData = [];
let pokemonByTypes = [];
//Example of pokeData
//{"name": "null", "damage_relations": {}}
let typeMatchUps = []

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

//--------------------------------------------------FUNCTION PROTOTYPES--------------------------------------------------
//Function to replace a character at a specific string index
//Input: index = location of string to replace, replacement = What to replace character or string to replace it with
//Output: Converted string with replacement
String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + 1);
}

//Function to a specific pokemon in the array
//Input: array = the object array of pokemong, pokemonName = the name of the pokemon to find.
//Output: index of the pokmeon in the array, -1 if not found
function findPokemonIndex(array, pokemonName) {
    return array.findIndex(({ name }) => name === pokemonName);
}

//Function to a specific pokemon in the array
//Input: array = the object array of pokemong, pokemonName = the name of the pokemon to find.
//Output: the found pokemon object, undefinded if not found
function findPokemonObject(array, pokemonName) {
    return array.find(({ name }) => name === pokemonName);
}

//------------------------------API CALLS------------------------------
//----------POKEAPI----------
//Initial fetch call to pokieapi for pokeData that also initzilizes the array with objects
function fetchNameIdData() {
    //Sends request to pokeapi
    return fetch("https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=110")
        .then(function (response) {
            //Error throwing if server doesnt respons with 200 status
            if (!(response.status == 200)) {
                throw new Error("Not 2xx response", { cause: response });
            }
            //Formats the response into a JSON object
            return response.json();
        })
        .then(function (data) {
            //Creates an object with the required keys and values for every pokemon in recieved data and assigns them a name and id before pushing them into the pokeData array
            for (let i = 0; i < 110; i++) {
                let dataObject = { "id": 0, "name": "null", "type1": "null", "type2": "null", "flavor_text": "null", "habitat": "null", "stats": {}, "abilities": {}, "sprites": {} };
                dataObject.id = i + 1;
                dataObject.name = data.results[i].name;
                pokeData.push(dataObject);
            }
        })
        //Catches any error throw from bad server response
        .catch(function (error) {
            console.log(error);
        });
}

//Fetch call to pokieapi that retrieves more info for pokeData array
async function fetchInfoData() {
    //For every object in the pokeData array the code runs a fetch call
    for (let i = 0; i < 110; i++) {
        //Sends request to pokeapi
        await fetch("https://pokeapi.co/api/v2/pokemon/" + (i + 1))
            .then(function (response) {
                //Error throwing if server doesnt respons with 200 status
                if (!(response.status == 200)) {
                    throw new Error("Not 2xx response", { cause: response });
                }
                //Formats the response into a JSON object
                return response.json();
            })
            .then(function (data) {
                //Sets the pokeData types, stats, abilities, and sprites for this current index of pokeData
                pokeData[i].stats = data.stats;
                pokeData[i].abilities = data.abilities;
                pokeData[i].sprites = data.sprites;
                pokeData[i].type1 = data.types[0].type.name.toUpperCase().slice(0, 1) + data.types[0].type.name.slice(1);
                //Conditional statment, where if the pokemon has only one type. The second type gets set to N/A
                if (data.types.length == 2) {
                    pokeData[i].type2 = data.types[1].type.name.toUpperCase().slice(0, 1) + data.types[1].type.name.slice(1);
                }
                else {
                    pokeData[i].type2 = "N/A"
                }
            })
            //Catches any error throw from bad server response
            .catch(function (error) {
                console.log(error);
            });
    }
}

//Fetch call to pokieapi that retrieves more info for pokeData array
async function fetchMoreInfoData() {
    //For every object in the pokeData array the code runs a fetch call
    for (let i = 0; i < 110; i++) {
        //Sends request to pokeapi
        await fetch("https://pokeapi.co/api/v2/pokemon-species/" + (i + 1))
            .then(function (response) {
                //Error throwing if server doesnt respons with 200 status
                if (!(response.status == 200)) {
                    throw new Error("Not 2xx response", { cause: response });
                }
                //Formats the response into a JSON object
                return response.json();
            })
            .then(function (data) {
                //Sets the pokeData habitat and flavor text for this current index of pokeData
                pokeData[i].habitat = data.habitat.name;
                //Searches through the flav text of the api to find an english varient
                for (let index = 0; index < data.flavor_text_entries.length; index++) {
                    if (data.flavor_text_entries[index].language.name == "en") {
                        //Sets flavor text of pokeData and replaces any illigal characters
                        pokeData[i].flavor_text = data.flavor_text_entries[index].flavor_text
                        pokeData[i].flavor_text = pokeData[i].flavor_text.replaceAt(pokeData[i].flavor_text.search("é"), "e")
                        pokeData[i].flavor_text = pokeData[i].flavor_text.replaceAt(pokeData[i].flavor_text.search("\f"), "")
                        break;
                    }
                }
            })
            //Catches any error throw from bad server response
            .catch(function (error) {
                console.log(error);
            });
    }
}

//Fetch call to pokieapi that initzilizes the typeMatchUps array with objects and assigns them type damage relations
async function fetchTypeMatchUpsData() {
    for (let i = 0; i < 18; i++) {
        //Sends request to pokeapi
        await fetch("https://pokeapi.co/api/v2/type/" + (i + 1))
            .then(function (response) {
                //Error throwing if server doesnt respons with 200 status
                if (!(response.status == 200)) {
                    throw new Error("Not 2xx response", { cause: response });
                }
                //Formats the response into a JSON object
                return response.json();
            })
            .then(function (data) {
                //Creates an object with the required keys and values for every type in recieved data and assigns value before pushing them into the typeMatchUp array
                let dataObject = { "name": "null", "damage_relations": {} };
                dataObject.name = data.name;
                dataObject.damage_relations = data.damage_relations;
                typeMatchUps.push(dataObject);
            })
            //Catches any error throw from bad server response
            .catch(function (error) {
                console.log(error);
            });
    }
}

//----------MEDIAWIKIAPI----------
//This function retrieves a pokemon image from bulbapedia and assigns it as the source of the image element provided to the function
//Input: pokeName = the name of the pokemon you are finding the image off, targetEl = the location of where to set that image
function getPokeImage(pokeName, targetEl) {
    //Base url to build request url from
    let apiURL = "https://bulbapedia.bulbagarden.net/w/api.php?origin=*";
    //Object that holds the keys and parameters to build the request url from
    let params = {
        action: "query",
        format: "json",
        prop: "pageimages",
        indexpageids: 1,
        piprop: "original",
        titles: `${pokeName.toLowerCase()}_(Pokémon)`
    }
    //Builds the request url from the keys and parameters provided
    Object.keys(params).forEach(function (key) { apiURL += "&" + key + "=" + params[key]; });
    //Sends request to bulbapedia via mediawiki api
    fetch(apiURL)
        .then(function (response) {
            //Throws error if server doesnt respond with a 200 code
            if (!(response.status == 200)) {
                throw new Error("Not 2xx response", { cause: response });
            }
            //Formats the response into a JSON object
            return response.json();
        })
        .then(function (data) {
            let pid = data.query.pageids[0];
            //Assigns the target element with the provided image from mediawiki api
            targetEl.src = data.query.pages[pid].original.source;
        })
        //Catches any error response from the server
        .catch(function (error) {
            console.log(error);
        });
}

//This function retrieves pokemon type icons from bulbapedia and assigns it as the source of the image element provided to the function
//Input: type = a string of the type of button to fetch, targetEl = the location of where to set that image
function getTypeIcon(type, targetEl) {
    //Base url to build request url from
    let apiURL = "https://bulbapedia.bulbagarden.net/w/api.php?origin=*";
    //Object that holds the keys and parameters to build the request url from
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
            //Throws error if server doesnt respond with a 200 code
            if (!(response.status == 200)) {
                throw new Error("Not 2xx response", { cause: response });
            }
            //Formats the response into a JSON object
            return response.json();
        })
        .then(function (data) {
            let pid = data.query.pageids[0];
            //Assigns the target element with the provided image from mediawiki api
            targetEl.src = data.query.pages[pid].thumbnail.source;
        })
        //Catches any error response from the server
        .catch(function (error) {
            console.log(error);
        });
}

//------------------------------BUTTONS------------------------------
//This function creates the sorting buttons of the pokedex
//Input: types = an array holding all the types as strings
function assignIcons(types) {
    //Creates a div container for the buttons
    let iconContainer = document.createElement("div");
    //Creates an icon for every type in in the global types array
    for (i = 0; i < types.length; i++) {
        //Creates a new image element
        let typeIcon = document.createElement("img");
        //Gets the image icon source from mediawiki api
        getTypeIcon(types[i], typeIcon);
        //Assigns the buttons properties and functionality
        typeIcon.title = types[i];
        typeIcon.id = types[i];
        typeIcon.onclick = function () {
            //Clears the pokemonByTypes array
            pokemonByTypes = [];
            //Fills the array based on the type of pokemon that match the buttons type
            for (let i = 0; i < pokeData.length; i++) {
                if ((pokeData[i].type1.toLowerCase() == this.id) || (pokeData[i].type2.toLowerCase() == this.id)) {
                    pokemonByTypes.push(pokeData[i]);
                }
            }
        };
        //Appeneds the button to the div container
        iconContainer.append(typeIcon);
    }
    //Appeneds the div container to the pokedex
    document.getElementById("pokedex-aside").append(iconContainer);
}

//Functionality of the pokedex next traversal button
function pokedexNext() {
    //If the current displayed pokemon is not found in the array, I.E. type buttons sorted it or is at the end of the array. The next pokemon to be displayed is the begining of the array
    if (((findPokemonIndex(pokemonByTypes, document.getElementById("Pokemon-name").textContent.split(" ")[1])) == -1) || ((findPokemonIndex(pokemonByTypes, document.getElementById("Pokemon-name").textContent.split(" ")[1])) == (pokemonByTypes.length - 1))) {
        setPokedexInfo(pokemonByTypes, 0);
    }
    //If the current displayed pokemon is found in the array. The next pokemon to be displayed is the current loaction plus 1
    else {
        setPokedexInfo(pokemonByTypes, ((findPokemonIndex(pokemonByTypes, document.getElementById("Pokemon-name").textContent.split(" ")[1])) + 1));
    }
}

//Functionality of the pokedex back traversal button
function pokedexBack() {
    //If the current displayed pokemon is not found in the array, I.E. type buttons sorted it. The next pokemon to be displayed is the begining of the array
    if ((findPokemonIndex(pokemonByTypes, document.getElementById("Pokemon-name").textContent.split(" ")[1])) == -1) {
        setPokedexInfo(pokemonByTypes, 0);
    }
    //If the current displayed pokemon is found in the array, but the index is 0th. The next pokemon to be displayed is the end of the array
    else if ((findPokemonIndex(pokemonByTypes, document.getElementById("Pokemon-name").textContent.split(" ")[1])) == 0) {
        setPokedexInfo(pokemonByTypes, (pokemonByTypes.length - 1));
    }
    //If the current displayed pokemon is found in the array. The next pokemon to be displayed is the current loaction minus 1
    else {
        setPokedexInfo(pokemonByTypes, ((findPokemonIndex(pokemonByTypes, document.getElementById("Pokemon-name").textContent.split(" ")[1])) - 1));
    }
}

//Function to create buttons of that type for the pokdex
//Input: type = the type of button to create, targetEl = the location of where to set that button
function typeButtons(type, targetEl) {
    //Function doesnt run if N/A is passed as a type
    if (type == "N/A") {
        return;
    }
    //Creates a button element
    let typeButton = document.createElement("button");
    //Assigns the buttons properties and functionality
    typeButton.textContent = type;
    typeButton.id = type + "-button";
    typeButton.style.setProperty("min-width", "66px")
    typeButton.style.setProperty("margin-left", "15px")
    typeButton.style.setProperty("border-radius", "5px")
    typeButton.style.setProperty("background-color", types[type.toLowerCase()]);
    typeButton.style.setProperty("color", "white");
    typeButton.onclick = function () {
        console.log(typeButton.textContent);
    };
    //Appends the button to the location passed to it
    targetEl.append(typeButton);
}

//Function that sets all the info of the pokedex.html
//Input: dataArray = the array to pull the info from, index = the location of the object in the array
function setPokedexInfo(dataArray, index) {
    //Calls getPokeImage function to set the image of the pokemon to the pokedex
    getPokeImage(dataArray[index].name, document.getElementById("pokedex-image"));
    //Sets the flavor text, id, name, types, and habitat of the pokemon to the pokedex
    document.getElementById("flavor-text").textContent = dataArray[index].flavor_text;
    document.getElementById("Pokemon-id").textContent = "ID: " + dataArray[index].id;
    document.getElementById("Pokemon-name").textContent = "Name: " + dataArray[index].name;
    document.getElementById("Pokemon-type1").textContent = "Type: " + dataArray[index].type1;
    document.getElementById("stats-HP").textContent = "HP: " + dataArray[index].stats[0].base_stat;
    document.getElementById("stats-attack").textContent = "Attack: " + dataArray[index].stats[1].base_stat;
    document.getElementById("stats-defense").textContent = "Defense: " + dataArray[index].stats[2].base_stat;
    document.getElementById("stats-special-attack").textContent = "Special Attack: " + dataArray[index].stats[3].base_stat;
    document.getElementById("stats-special-defense").textContent = "Special Defense: " + dataArray[index].stats[4].base_stat;
    document.getElementById("stats-speed").textContent = "Speed: " + dataArray[index].stats[5].base_stat;

    //Calls the typeButtons function to append a type button next to its type
    typeButtons(dataArray[index].type1, document.getElementById("Pokemon-type1"));
    document.getElementById("Pokemon-type2").textContent = "Type: " + dataArray[index].type2;
    //Calls the typeButtons function to append a type button next to its type
    typeButtons(dataArray[index].type2, document.getElementById("Pokemon-type2"));
    document.getElementById("Pokemon-habitat").textContent = "Habitat: " + dataArray[index].habitat;
    //Sets the abilities of the pokemon to the pokedex and sets how to display it properly
    for (let i = 0; i < dataArray[index].abilities.length; i++) {
        if (i == 0) {
            document.getElementById("Pokemon-abilities").textContent = "Abilities: " + dataArray[index].abilities[i].ability.name
        }
        if (i != 0) {
            document.getElementById("Pokemon-abilities").textContent += ", " + dataArray[index].abilities[1].ability.name;
        }
    }
    //Sets the pokemon sprites of the pokemon to the pokedex and sets how to display it properly
    //Clears all sprites from the pokedex
    document.getElementById("pokemon-sprites").textContent = "";
    for (let i = 0; i < 8; i++) {
        //Creates a image element
        let sprite = document.createElement("img");
        //For every sprite it assigns a source to the image or an id of null
        switch (i) {
            case 0:
                if (dataArray[index].sprites.front_default == null) {
                    sprite.id = "null";
                }
                sprite.src = dataArray[index].sprites.front_default
                break;
            case 1:
                if (dataArray[index].sprites.back_default == null) {
                    sprite.id = "null";
                }
                sprite.src = dataArray[index].sprites.back_default
                break;
            case 2:
                if (dataArray[index].sprites.front_female == null) {
                    sprite.id = "null";
                }
                sprite.src = dataArray[index].sprites.front_female
                break;
            case 3:
                if (dataArray[index].sprites.back_female == null) {
                    sprite.id = "null";
                }
                sprite.src = dataArray[index].sprites.back_female
                break;
            case 4:
                if (dataArray[index].sprites.front_shiny == null) {
                    sprite.id = "null";
                }
                sprite.src = dataArray[index].sprites.front_shiny
                break;
            case 5:
                if (dataArray[index].sprites.back_shiny == null) {
                    sprite.id = "null";
                }
                sprite.src = dataArray[index].sprites.back_shiny
                break;
            case 6:
                if (dataArray[index].sprites.front_shiny_female == null) {
                    sprite.id = "null";
                }
                sprite.src = dataArray[index].sprites.front_shiny_female
                break;
            case 7:
                if (dataArray[index].sprites.back_shiny_female == null) {
                    sprite.id = "null";
                }
                sprite.src = dataArray[index].sprites.back_shiny_female
                break;
            default:
                console.log("Switch Error");
                return;
        }
        //If the id of the sprite isnt null it appends it to the page
        if (!(sprite.id == "null")) {
            document.getElementById("pokemon-sprites").append(sprite);
        }
    }
    //Sets the more info link of the pokemon to the correct location of bulbapedia if the users wants more information
    document.getElementById("pokemon-link").href = `https://bulbapedia.bulbagarden.net/wiki/${dataArray[index].name.toLowerCase()}_(Pok%C3%A9mon)`
    document.getElementById("pokemon-link").target = "_blank";
}

//--------------------------------------------------EXECUTABLE CODE--------------------------------------------------
// Runs on site load to load functions
document.addEventListener('DOMContentLoaded', async function () {
    await fetchNameIdData();
    await fetchInfoData();
    await fetchMoreInfoData();
    await fetchTypeMatchUpsData();
    //Only runs this code on pokedex.html load
    if (this.location.href.split("/poke-match/")[1] == "pokedex.html") {
        pokemonByTypes = pokeData;
        setPokedexInfo(pokeData, 0);
        assignIcons(Object.keys(types));
        console.log(pokeData);
    }
});







