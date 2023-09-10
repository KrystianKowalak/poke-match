//{"id": 0, "name": "null", "type1": "null", "type2" : "null", "flavor_text": "null" "habitat": "null", "stats": {}, "abilities": {}, "sprites": {}}
let pokeData = [];

let pokemonByTypes = [];

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + 1);
}

//------------------------------API CALLS------------------------------
//----------POKEAPI----------
function fetchNameIdData() {
    return fetch("https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=110")
        .then(function (response) {
            if (!(response.status == 200)) {

                throw new Error("Not 2xx response", { cause: response });
            }
            return response.json();
        })
        .then(function (data) {
            for (let i = 0; i < 110; i++) {
                let dataObject = { "id": 0, "name": "null", "type1": "null", "type2": "null", "flavor_text": "null", "habitat": "null", "stats": {}, "abilities": {}, "sprites": {} };
                dataObject.id = i + 1;
                dataObject.name = data.results[i].name;
                pokeData.push(dataObject);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function fetchInfoData() {
    for (let i = 0; i < 110; i++) {
        await fetch("https://pokeapi.co/api/v2/pokemon/" + (i + 1))
            .then(function (response) {
                if (!(response.status == 200)) {
                    throw new Error("Not 2xx response", { cause: response });
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
    }
}

async function fetchInfoData2() {
    for (let i = 0; i < 110; i++) {
        await fetch("https://pokeapi.co/api/v2/pokemon-species/" + (i + 1))
            .then(function (response) {
                if (!(response.status == 200)) {
                    throw new Error("Not 2xx response", { cause: response });
                }
                return response.json();
            })
            .then(function (data) {
                pokeData[i].habitat = data.habitat.name;
                for (let index = 0; index < data.flavor_text_entries.length; index++) {
                    if (data.flavor_text_entries[index].language.name == "en") {
                        pokeData[i].flavor_text = data.flavor_text_entries[index].flavor_text
                        pokeData[i].flavor_text = pokeData[i].flavor_text.replaceAt(pokeData[i].flavor_text.search("é"), "e")
                        pokeData[i].flavor_text = pokeData[i].flavor_text.replaceAt(pokeData[i].flavor_text.search("\f"), "")
                        break;
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
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
        titles: `${pokeName.toLowerCase()}_(Pokémon)`
    }
    // Builds the request url from the keys and parameters provided
    Object.keys(params).forEach(function (key) { apiURL += "&" + key + "=" + params[key]; });

    // Sends request to bulbapedia via mediawiki api
    fetch(apiURL)
        .then(function (response) {
            // Throws error if server doesnt respond with a 200 code
            if (!(response.status == 200)) {

                throw new Error("Not 2xx response", { cause: response });
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
    for (i = 0; i < types.length; i++) {
        let typeIcon = document.createElement("img");
        getTypeIcon(types[i], typeIcon);
        typeIcon.title = types[i];
        typeIcon.id = types[i];
        typeIcon.onclick = function () {
            for (let i = 0; i < pokeData.length; i++) {
                if ((pokeData[i].type1.toLowerCase() == this.id) || (pokeData[i].type2.toLowerCase() == this.id)) {
                    pokemonByTypes.push(pokeData[i]);
                }
            }
            console.log(pokemonByTypes);
        };
        iconContainer.append(typeIcon);
    }
    document.getElementById("pokedex-aside").append(iconContainer);
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

function typeButtons(type, location) {
    if (type == "N/A") {
        return;
    }
    type = type.toLowerCase();
    let typeButton = document.createElement("button");
    typeButton.textContent = type;
    typeButton.id = type + "-button";
    typeButton.style.setProperty("min-width", "66px")
    typeButton.style.setProperty("border-radius", "5px")
    typeButton.style.setProperty("background-color", types[type]);
    typeButton.style.setProperty("color", "white");
    typeButton.onclick = function () {
        console.log(typeButton.textContent);
    };
    location.append(typeButton);
}

// work in progress
function setPokedexInfo() {
    getPokeImage(pokeData[0].name, document.getElementById("pokedex-image"));
    assignIcons(Object.keys(types));
    document.getElementById("flavor-text").textContent = pokeData[0].flavor_text;
    document.getElementById("Pokemon-id").textContent += pokeData[0].id;
    document.getElementById("Pokemon-name").textContent += pokeData[0].name;
    document.getElementById("Pokemon-type1").textContent += pokeData[0].type1;
    typeButtons(pokeData[0].type1, document.getElementById("Pokemon-type1"));
    document.getElementById("Pokemon-type2").textContent += pokeData[0].type2;
    typeButtons(pokeData[0].type2, document.getElementById("Pokemon-type2"));
    document.getElementById("Pokemon-habitat").textContent += pokeData[0].habitat;
    for (let i = 0; i < pokeData[0].abilities.length; i++) {
        document.getElementById("Pokemon-abilities").textContent += pokeData[0].abilities[i].ability.name
        if (i != 0) {
            document.getElementById("Pokemon-abilities").textContent += ", " + pokeData[0].abilities[1].ability.name;
        }
    }


    for (let i = 0; i < 8; i++) {
        let sprite = document.createElement("img");
        switch (i) {
            case 0:
                if (pokeData[0].sprites.front_default == null) {
                    sprite.id = "null";
                }
                sprite.src = pokeData[0].sprites.front_default
                break;
            case 1:
                if (pokeData[0].sprites.back_default == null) {
                    sprite.id = "null";
                }
                sprite.src = pokeData[0].sprites.back_default
                break;
            case 2:
                if (pokeData[0].sprites.front_female == null) {
                    sprite.id = "null";
                }
                sprite.src = pokeData[0].sprites.front_female
                break;
            case 3:
                if (pokeData[0].sprites.back_female == null) {
                    sprite.id = "null";
                }
                sprite.src = pokeData[0].sprites.back_female
                break;
            case 4:
                if (pokeData[0].sprites.front_shiny == null) {
                    sprite.id = "null";
                }
                sprite.src = pokeData[0].sprites.front_shiny
                break;
            case 5:
                if (pokeData[0].sprites.back_shiny == null) {
                    sprite.id = "null";
                }
                sprite.src = pokeData[0].sprites.back_shiny
                break;
            case 6:
                if (pokeData[0].sprites.front_shiny_female == null) {
                    sprite.id = "null";
                }
                sprite.src = pokeData[0].sprites.front_shiny_female
                break;
            case 7:
                if (pokeData[0].sprites.back_shiny_female == null) {
                    sprite.id = "null";
                }
                sprite.src = pokeData[0].sprites.back_shiny_female
                break;
            default:
                console.log("Switch Error");
                return;
        }
        if (!(sprite.id == "null")) {
            document.getElementById("pokemon-sprites").append(sprite);
        }
    }
    document.getElementById("pokemon-link").href = `https://bulbapedia.bulbagarden.net/wiki/${pokeData[0].name.toLowerCase()}_(Pok%C3%A9mon)`
    document.getElementById("pokemon-link").target = "_blank";
}

//------------------------------Executable Code------------------------------
// Runs on site load to load functions
document.addEventListener('DOMContentLoaded', async function () {
    await fetchNameIdData();
    await fetchInfoData();
    await fetchInfoData2();
    console.log(pokeData);
    setPokedexInfo();
});