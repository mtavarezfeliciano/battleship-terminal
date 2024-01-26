const required = require("readline-sync");

//columns
const mapGrid = [
  ["A1", "A2", "A3"],
  ["B1", "B2", "B3"],
  ["C1", "C2", "C3"],
]; //rows

//random ship thingy (my brain hurts)

function createRandomShips() {
  const randomRow1 = Math.floor(Math.random() * mapGrid.length);
  const randomColumn1 = Math.floor(Math.random() * mapGrid[randomRow1].length);

  const ship1 = mapGrid[randomRow1][randomColumn1];

  let randomRow2, randomColumn2;
  do {
    randomRow2 = Math.floor(Math.random() * mapGrid.length);
    randomColumn2 = Math.floor(Math.random() * mapGrid[randomRow2].length);
  } while (randomRow1 === randomRow2 && randomColumn1 === randomColumn2);

  const ship2 = mapGrid[randomRow2][randomColumn2];

  return [ship1, ship2];
}

function startGame() {
  console.log("Press any key to start the game.");
  required.keyInPause();
}

let [ship1, ship2] = createRandomShips();
let ships = [ship1, ship2];
let remainingShips = ships.length;

//restart game function

function restartGame() {
  startGame();
  return { ship1: null, ship2: null, remainingShips: 2 };
}

startGame();

console.log(
  `The answers are ${ship1} and ${ship2} just for the sake of testing.`
);

do {
  function strikeShip() {
    const shotsFired = [];

    while (remainingShips > 0) {
      let currentShot = required.question("Enter a location to strike: ", {
        limit: mapGrid,
      });

      if (shotsFired.includes(currentShot)) {
        console.log("You have already picked this location. Miss!");
      } else if (ships.includes(currentShot)) {
        console.log("Hit. You have sunk a battleship.");
        remainingShips--;
      } else {
        console.log("You have missed!");
      }

      shotsFired.push(currentShot);

      currentShot = null;
    }

    remainingShips = remainingShips - 1;
    if (remainingShips === 1) {
      while (remainingShips > 0) {
        let currentShot = required.question("Enter a location to strike: ", {
          limit: mapGrid,
        });

        if (shotsFired.includes(currentShot)) {
          console.log("You have already picked this location. Miss!");
        } else if (ships.includes(currentShot)) {
          console.log("Hit. You have sunk a battleship.");
          remainingShips--;
        } else {
          console.log("You have missed!");
        }

        shotsFired.push(currentShot);

        currentShot = null;
      }
    }
    remainingShips = remainingShips - 1;
  }
  strikeShip();

  const restart = required.keyInYNStrict(
    "You have destroyed all battleships. Would you like to play again?"
  );

  if (restart) {
    ({ ship1, ship2, remainingShips } = restartGame());
    console.log("Aight lets rock.");
  } else {
    console.log("gg no re.");
    break;
  }
} while (true);
