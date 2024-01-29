const readlineSync = require("readline-sync");

function makeGrid(size) {
    const gameGrid = [];
    for (let i = 0; i < size; i++) {
        const rows = [];
        for (let x = 0; x < size; x++) {
            rows.push(' ');
        }
        gameGrid.push(rows);
    }
    return gameGrid;
}

class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.coordinates = [];
        this.hits = new Array(length).fill(false);
    }

    placeRandomly(gridSize) {
        const isVertical = Math.random() < 0.5;
        const startingCoordinate = [
            Math.floor(Math.random() * gridSize),
            Math.floor(Math.random() * gridSize)
        ];

        this.placeShip(startingCoordinate, isVertical);
    }

    placeShip(startingCoordinate, isVertical) {
        this.coordinates = [];

        for (let i = 0; i < this.length; i++) {
            const [x, y] = isVertical
                ? [startingCoordinate[0] + i, startingCoordinate[1]]
                : [startingCoordinate[0], startingCoordinate[1] + i];
            this.coordinates.push([x, y]);
        }
    }

    receiveHit(attackCoordinate) {
        for (let i = 0; i < this.length; i++) {
            const [x, y] = this.coordinates[i];
            if (x === attackCoordinate[0] && y === attackCoordinate[1]) {
                this.hits[i] = true;
                return true;
            }
        }
        return false;
    }

    isSunk() {
        return this.hits.every(hit => hit);
    }
}

function placeRandomShips(gridSize, shipCount) {
    const ships = [];

    for (let i = 0; i < shipCount; i++) {
        const ship = new Ship(`Ship${i + 1}`, 3);
        ship.placeRandomly(gridSize);

        const overlaps = ships.some(existingShip => {
            return existingShip.coordinates.some(coord => {
                return ship.coordinates.some(newCoord => newCoord[0] === coord[0] && newCoord[1] === coord[1]);
            });
        });

        if (overlaps) {
            i--;
        } else {
            ships.push(ship);
        }
    }

    return ships;
}

const mapGrid = makeGrid(10);
const ships = placeRandomShips(mapGrid.length, 5);

ships.forEach(ship => {
    console.log(`${ship.name} is located at: ${ship.coordinates.map(coord => coord.join('')).join(', ')}`);
});

console.table(mapGrid);

let remainingShips = ships.length;

do {
    function strikeShip() {
        const shotsFired = [];

        while (remainingShips > 0) {
            let currentShot = readlineSync.question("Enter a location to strike (e.g., A1): ").toUpperCase();

            if (shotsFired.includes(currentShot)) {
                console.log("You have already picked this location. Miss!");
            } else if (ships.some(ship => ship.coordinates.some(coord => coord.join('') === currentShot))) {
                console.log("Hit. You have sunk a battleship.");
                remainingShips--;
            } else {
                console.log("You have missed!");
            }

            shotsFired.push(currentShot);
        }

        remainingShips = remainingShips - 1;
        if (remainingShips === 1) {
            while (remainingShips > 0) {
                let currentShot = readlineSync.question("Enter a location to strike (e.g., A1): ").toUpperCase();

                if (shotsFired.includes(currentShot)) {
                    console.log("You have already picked this location. Miss!");
                } else if (ships.some(ship => ship.coordinates.some(coord => coord.join('') === currentShot))) {
                    console.log("Hit. You have sunk a battleship.");
                    remainingShips--;
                } else {
                    console.log("You have missed!");
                }

                shotsFired.push(currentShot);
            }
        }
        remainingShips = remainingShips - 1;
    }
    strikeShip();

    const restart = readlineSync.keyInYNStrict(
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
console.log(placeShip);