const prompt = require("prompt-sync")();

const ROLS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}

const SYMBOLS_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}

function deposit() {
    while (true) {
        const depositeAmount = prompt("Enter your deposite amount: ")
        const numberDepositAmount = parseFloat(depositeAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invaild deposite amount, Try again")
        } else {
            return numberDepositAmount;
        }
    }
}

function getNumberOfLines() {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ")
        const numberOfLines = parseFloat(lines);

        if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invaild number of lines, Must be between 1-3")
        } else {
            return numberOfLines;
        }
    }
}

function getBet(balance, lines) {
    while (true) {
        const bet = prompt("Enter the bet per line: ")
        const betAmount = parseFloat(bet);

        if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance / lines) {
            console.log("Invalid bet, try again")
        } else {
            return betAmount;
        }
    }
}

function spin() {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([])
        const reelSymbols = [...symbols]
        for (let j = 0; j < ROLS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length)
            const selectedSymbols = reelSymbols[randomIndex];
            reels[i].push(selectedSymbols)
            reelSymbols.splice(randomIndex, 1)
        }
    }
    return reels;
}

function transpose(reels) {
    const rows = []

    for (let i = 0; i < ROLS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

function printRows(rows) {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString);
    }
}

function getWinner(rows, bet, lines) {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row]
        let sameAll = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                sameAll = false;
                break;
            }
        }

        if (sameAll) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }       
    }
    return winnings
}

function game() {
    let balance = deposit();

    while (true) {
        console.log(`your balance is $${balance}`)
        const lines = getNumberOfLines();
        const bet = getBet(balance, lines);
        balance -= bet * lines
        const reels = spin();
        const rows = transpose(reels)
        printRows(rows)
        const winnings = getWinner(rows, bet, lines)
        balance += winnings;
            console.log(`you won , $${winnings.toString()}`)

        if (balance <= 0) {
            console.log('You ran out of money!')
            break;
        }

        const playAgain = prompt("Do you want to play again?. (y/n)")

        if (playAgain != "y") break; 
    }
}

game();