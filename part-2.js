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

    getFormattedCoordinates() {
        return this.coordinates.map(coord => {
            const [x, y] = coord;
            const letter = String.fromCharCode('A'.charCodeAt(0) + x);
            const number = y + 1;
            return `${letter}${number}`;
        });
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

function placeRandomShips(gridSize) {
    const ships = [
        new Ship("Ship1", 2),
        new Ship("Ship2", 3),
        new Ship("Ship3", 3),
        new Ship("Ship4", 4),
        new Ship("Ship5", 5)
    ];

    for (const ship of ships) {
        do {
            ship.placeRandomly(gridSize);
        } while (ships.some(existingShip => existingShip !== ship && existingShip.coordinates.some(coord => {
            return ship.coordinates.some(newCoord => newCoord[0] === coord[0] && newCoord[1] === coord[1]);
        })));
    }

    return ships;
}

function printShipsLocations(ships) {
    ships.forEach(ship => {
        console.log(`${ship.name} is located at: ${ship.getFormattedCoordinates().map(coord => {
            const [letter, number] = coord.match(/[A-J]|10|[1-9]/g);
            return `${letter}${number}`;
        }).join(', ')}`);
    });
}

function playGame(ships) {
    let remainingShips = ships.length;

    do {
        function strikeShip() {
            const shotsFired = [];
        
            while (remainingShips > 0) {
                let currentShot = readlineSync.question("Enter a location to strike (e.g., A1): ").toUpperCase();
        
                const validInput = /^[A-J]([1-9]|10)$/.test(currentShot);
                if (!validInput) {
                    console.log("Invalid input format. Please enter a valid location (e.g., A1).");
                    continue;
                }
        
                if (shotsFired.includes(currentShot)) {
                    console.log("You have already picked this location. Miss!");
                } else {
                    let hitShip = false;
        
                    for (const ship of ships) {
                        if (ship.getFormattedCoordinates().includes(currentShot)) {
                            console.log("Hit!");
        
                            const hitIndex = ship.getFormattedCoordinates().indexOf(currentShot);
                            ship.hits[hitIndex] = true;
        
                            if (ship.isSunk()) {
                                console.log("Sunk! You have sunk a battleship.");
                                remainingShips--;
                            }
        
                            hitShip = true;
                            break;
                        }
                    }
        
                    if (!hitShip) {
                        console.log("You have missed!");
                    }
        
                    shotsFired.push(currentShot);
                }
            }
        
            remainingShips = remainingShips - 1;
        }
            
        strikeShip();

    } while (remainingShips > 0);

    const playAgain = readlineSync.keyInYNStrict("You have sunk all battleships. Would you like to play again?");
    return playAgain;
}

let playAgain = true;

do {
    const mapGrid = makeGrid(10);
    const ships = placeRandomShips(mapGrid.length);

    printShipsLocations(ships);

    console.table(mapGrid);

    playAgain = playGame(ships);

} while (playAgain);

console.log("gg no re");
