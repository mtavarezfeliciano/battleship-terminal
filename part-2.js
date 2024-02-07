const required = require("readline-sync");

const letters = 'abcdefghij'.toUpperCase().split('');

let fleet = [];

const grid = letters.map((letter) => {
    return letters.map((_, index) => {
      return `${letter}${index +1}`
    })
  })


  //stuff for ship generation.
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}


 // the actual generation function
const placeShips = (letters, units, fleet) => {
    const letterIndex = getRandomInt(letters.length);
    const number = getRandomInt(letters.length);
    const direction = getRandomInt(2); 
    const coordsArr = [];

    
    if (direction === 0) { //horizontal
        if (number + units <= letters.length) {
            for (let i = 0; i < units; i++) {
                coordsArr.push(`${letters[letterIndex]}${number + 1 + i}`);
            }
        } else {
            return placeShips(letters, units, fleet);
        }
    } else {  //vertical
        if (letterIndex + units <= letters.length) {
            for (let i = 0; i < units; i++) {
                coordsArr.push(`${letters[letterIndex + i]}${number + 1}`);
            }
        } else {
            return placeShips(letters, units, fleet);
        }
    } //collision 
    if (checkCollision(fleet, coordsArr)) {
        return placeShips(letters, units, fleet); 
    }
    return coordsArr;
}


function resetGame() {
    fleet = [];

    for (let index = 0; index < [2, 3, 3, 4, 5].length; index++) {
        const unitsNumber = [2, 3, 3, 4, 5][index];
        fleet.push(placeShips(letters, unitsNumber, fleet.slice(0, index)));
    }

    return fleet;
}


const checkCollision = (fleet, newCoords) => {
    // console.log(fleet);
    for (const shipCoords of fleet) {
        for (const coord of newCoords) {
            if (shipCoords.includes(coord)) {
                return true; 
            }
        }
    }
    return false;
}



//okay now the actual game
function startGame() {
    console.log("Press any key to start the game.");
    required.keyInPause();
    let fleet = resetGame();
    console.log('For the sake of testing, this is the fleet location:');
    // console.log(fleet);    
}
startGame();




function playGame() {
    console.log(fleet);    

    let remainingShips = fleet.length;
    // console.log(remainingShips) //prints 5
    let newRemainder;
    for (let index = 0; index < fleet.length; index++) {
        newRemainder = fleet[index].length;
        // console.log(newRemainder); // prints 2, 3, 3, 4, 5
    }

    do {

        function strikeShip() {
            const shotsFired = [];

            while ( remainingShips > 0 ) {
                let currentShot = required.question('Enter a location to strike (i.e A1): ').toUpperCase();

                const validInput = /^[A-J]([1-9]|10)$/.test(currentShot);
                if(!validInput) {
                    console.log('Invalid coordinate. Please enter a valid location (i.e B5): ');
                    continue;
                }

                if (shotsFired.includes(currentShot)) {
                    console.log('You have already picked this location! Miss! ');
                } else {
                    let hitShip = false;

                    for (let i = 0; i < fleet.length; i++) {
                        const ship = fleet[i];
                        const indexOfShot = ship.indexOf(currentShot);
        
                        if (indexOfShot !== -1) {
                            console.log('Hit!');
                            ship.splice(indexOfShot, 1);

                            if (ship.length === 0) {
                                console.log('Sunk! You have sunk a battleship.');
                                remainingShips--;
                            }

                            hitShip = true;
                            break;
                        }
                    }

                    if (!hitShip) {
                        console.log('You have missed!');
                    }

                    shotsFired.push(currentShot);
                }
            }
        }
        strikeShip();
        
    } while (remainingShips > 0);

    const playAgain = required.keyInYNStrict('You have sunk all battleships. Would you like to play again? ');
    if (playAgain) {
        fleet = resetGame();  // Reset the fleet for a new game
        return true;
    } else {
        return false;
    }
}



let playAgain = true;

do {
    playAgain = playGame();
} while (playAgain);

console.log('gg no re.');