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

// fetches a new match up of pokemon to show to the user
function roundStart() {
    // TODO: call rng twice funtion to generate a pokemon id to use for poulating cards with information
    const id1= null; //rng function call
    const id2= null; //rng function call

    const pokeimg1 = document.querySelector("#poke1");
    const pokeimg2 = document.querySelector("#poke2");
    pokeimg1.src = getPokeImage("pikachu", pokeimg1);
    pokeimg2.src = getPokeImage("rattata", pokeimg2);
};

//initializes the values for lives and score
function init() {
    const lives = document.querySelector("#lives");
    const score = document.querySelector("#score");
    lives.textContent += " 3";
    score.textContent += "0";
};

function randomPoke (max) {
    let idNumber = Math.floor(Math.random() * max) + 1;
    return idNumber;
}


// starts the timer, updates game window, initializes score and lives
function startGame() {
    // timer();
    // init();
    // roundStart();
    randomPoke(10);
    console.log("You clicked the start button!");
};



// Event listener to run startGame function when the start button is clicked
startButtonEl.addEventListener("click", startGame);