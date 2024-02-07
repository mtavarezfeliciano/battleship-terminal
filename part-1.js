const required = require("readline-sync");

// new dynamic grid

const letters = 'abc'.toUpperCase().split('');

const grid = letters.map((letter) => {
  return letters.map((_, index) => {
    return `${letter}${index +1}`
  })
})

let ships;
let remainingShips;
const shotsFired = [];


//random ship thingy (my brain hurts)

function createRandomShips() {
  const randomRow1 = Math.floor(Math.random() * grid.length);
  const randomColumn1 = Math.floor(Math.random() * grid[randomRow1].length);

  const ship1 = grid[randomRow1][randomColumn1];

  let randomRow2, randomColumn2;
  do {
    randomRow2 = Math.floor(Math.random() * grid.length);
    randomColumn2 = Math.floor(Math.random() * grid[randomRow2].length);
  } while (randomRow1 === randomRow2 && randomColumn1 === randomColumn2);

  const ship2 = grid[randomRow2][randomColumn2];

  return [ship1, ship2];
}



function startGame() {
  console.log("Press any key to start the game.");
  required.keyInPause();
  ships = createRandomShips();
  remainingShips = ships.length;
  console.log(
    `The answers are ${ships[0]} and ${ships[1]} just for the sake of testing.`
  );  
  handleGame();
}


//restart game function

function restartGame() {
  startGame();
  return { ships: [], remainingShips: 2 };
}


function strikeShip() {
  while (remainingShips > 0) {
    let currentShot = required.question("Enter a location to strike: ", {
      limit: grid,
    }).toUpperCase();

    if (shotsFired.includes(currentShot)) {
      console.log("You have already picked this location. Miss!");
    } else if (ships.includes(currentShot)) {
      console.log("Hit. You have sunk a battleship.");
      remainingShips--;
    } else {
      console.log("You have missed!");
    }

    shotsFired.push(currentShot);
  }
}


const restartNewGame = () => {

  const restart = required.keyInYNStrict(
    "You have destroyed all battleships. Would you like to play again?"
  );
  
  if (restart) {
    ({ ships, remainingShips } = restartGame());
    console.log("Aight lets rock.");
    return true;
  } else {
    console.log("gg no re.");
    return false;
  }
}

function handleGame() {
  do {
    strikeShip();
    if (!restartNewGame()) break; 
    
  
  } while (true);
  
}

startGame();
