// TODO: API get object with specific pokemon info (type(s), short description, etc) from pokeapi

// TODO: API get object with pokemon image from bulbapedia

// TODO: API get object with type icons from bulbapedia

const pokeSpecies = "ivysaur";
const dex = document.querySelector("#dex");



function getPokeInfo(pokename) {
    let apiURL = `https://pokeapi.co/api/v2/pokemon/${pokename}`
    fetch(apiURL).then(function (response) {
        response.json().then(function (data) {
            console.log(data);
            let pokeImg = document.createElement("img");
            let pokeName = document.createElement("h2");
            let pokeType1 = document.createElement("h3");
            let pokeType2 = document.createElement("h3");
            let pokeID = document.createElement("h3");

            pokeName.textContent = "Name: " + data.name;
            pokeType1.textContent = "Type 1: " + data.types[0].type.name;
            if (data.types.length == 2) {
                pokeType2.textContent = "Type 2: " + data.types[1].type.name;
            }
            else { pokeType2.textcontent = "N/A" }
            pokeID.textContent = "ID Number: " + data.id;

            dex.append(pokeName, pokeType1, pokeType2, pokeID);
        })
    })
}

function getPokeImage(pokename) {
    let apiURL = `https://cors.iamnd.eu.org/?url=https://bulbapedia.bulbagarden.net/w/api.php?action=query&format=json&prop=info%7Cimages&list=&meta=&imlimit=10`
    fetch(apiURL).then(function (response) {
        console.log(response);
    })
}

getPokeInfo(pokeSpecies);
getPokeImage(pokeSpecies);