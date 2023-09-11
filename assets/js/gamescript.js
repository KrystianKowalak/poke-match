const startButtonEl = document.querySelector("#start-button")

// counts down from 10 and updates the element referenced by timerEl to reflect it every 1000 ms
function timer() {
    const timerEl = document.querySelector("#timer")
    let timeRemaining = 10;
    let timeInterval = setInterval(function () {
        if (timeRemaining > 0) {
            timerEl.textContent = timeRemaining + " second(s) remaining";
            timeRemaining--;
        } else {
            timerEl.textContent = "";
            clearInterval(timeInterval);
            // Call function to end game
        }
    }, 1000);
};

//initializes the values for lives and score
function init() {
    const lives = document.querySelector("#lives");
    const score = document.querySelector("#score");
    lives.textContent = "Lives: 3";
    score.textContent = "Score: 0";
};

//returns a random pokemon object from pokeData
function randomPoke() {
    const max = pokeData.length;
    let index = Math.floor(Math.random() * max); //a random index value within the pokeData object
    return pokeData[index];
};

//updates card information with data from a pokemon object
function updateCards() {
    const poke1 = randomPoke(); //holds pokemon object for the left card
    const poke2 = randomPoke(); //holds pokemon object for the right card
    const pokeimg1 = document.querySelector("#poke1");
    const pokeimg2 = document.querySelector("#poke2");
    const pokeName1 = document.querySelector("#card-1-name")
    const pokeName2 = document.querySelector("#card-2-name")
    const card1Type1 = document.getElementById("card-1-type-1")
    const card1Type2 = document.getElementById("card-1-type-2")
    const card2Type1 = document.getElementById("card-2-type-1")
    const card2Type2 = document.getElementById("card-2-type-2")
    const typeContainers = document.querySelectorAll(".type-container");

    //removes the leftover buttons from the previous card
    function resetButtons(target) {
        target.forEach((element) => {
            if (element.children.length == 0) {
                console.log(`no button in type container ${element.id}}`)
            }
            else {
                console.log(`Removing children of ${element.id}`)
                element.children.item(0).remove();
            }
        })
    }

    function makeButtons() {
        typeButtons(poke1.type1, card1Type1);
        typeButtons(poke1.type2, card1Type2);
        typeButtons(poke2.type1, card2Type1);
        typeButtons(poke2.type2, card2Type2);
    }
    function retrieveImages() {
        pokeimg1.src = getPokeImage(poke1.name, pokeimg1);
        pokeName1.textContent = poke1.name;
        pokeimg2.src = getPokeImage(poke2.name, pokeimg2);
        pokeName2.textContent = poke2.name;
    }

    resetButtons(typeContainers);
    makeButtons();
    retrieveImages();
};

function checkAnswer (choice, types1, types2){
    
}

function formSubmitHandler () {
    
}





// sequence of functions to run when the game begins
function startGame() {
    console.log("You clicked the start button!");
    // timer();
    init();
    // roundStart();
    updateCards();
};

// sequence of functions to fun when a new round begins
function roundStart() {
    updateCards();
};

// Event listener to run startGame function when the start button is clicked
startButtonEl.addEventListener("click", startGame);

