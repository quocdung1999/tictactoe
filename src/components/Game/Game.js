
import React, { useState } from 'react';
import Board from '../Board/Board.js';
import * as GameFunc from './Util.js'

function Game() {
    const [history, setHistory] = useState([
        {
            squares: Array(9).fill(null),
        }
    ]);
    const [moves, setMoves] = useState(Array(0).fill(null));
    const [stepNumber, setStepNumber] = useState(0);
    const [xIsNext, setXIsNext] = useState(true);
    const [isAscending, setIsAscending] = useState(true);
    function handleClick(i) {
        const historyConst = history.slice(0, stepNumber + 1);
        const current = history[history.length - 1];
        const squaresConst = current.squares.slice();
        let movesVar = moves.slice(0, stepNumber);
        if (GameFunc.calculateWinner(squaresConst) || squaresConst[i]) {
            return;
        }
        squaresConst[i] = xIsNext ? 'X' : 'O';
        movesVar.push(i);
        setHistory(historyConst.concat([
            {
                squares: squaresConst,
            }
        ])
        );
        setMoves(movesVar);
        setStepNumber(historyConst.length);
        setXIsNext(!xIsNext);
    }

    function toggle() {
        setIsAscending(!isAscending);
    }
    function jumpTo(step) {
        setStepNumber(step);
        setXIsNext((step % 2) === 0);
    }



    const current = history[stepNumber];
    const winChain = GameFunc.calculateWinner(current.squares);
    let desc;
    let movesVar;
    if (isAscending === true) {
        movesVar = history.map((step, move) => {

            desc = move ? 'Go to move #' + move + ' - ' + '(R: ' + (Math.floor(moves[move - 1] / 3) + 1) + ', C: '
                + (moves[move - 1] % 3 + 1) + ')' : 'Go to start';
            return (
                <li key={move}>

                    <button onClick={() => jumpTo(move)}>
                        {move === stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });
    }
    else {
        movesVar = history.map((step, move) => {
            desc = (history.length - 1 - move) ? 'Go to move #' + (history.length - 1 - move) + ' - ' + '(R: ' +
                (Math.floor(moves[history.length - 1 - move - 1] / 3) + 1) + ', C: '
                + (moves[history.length - 1 - move - 1] % 3 + 1) + ')' : 'Go to start';
            return (
                <li key={move}>

                    <button onClick={() => jumpTo(history.length - 1 - move)}>
                        {history.length - 1 - move === stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });
    }

    let status;
    if (winChain) {
        status = 'Winner: ' + (xIsNext ? 'O' : 'X');

    }
    else if (GameFunc.isDraw(current) === true) {
        status = "DRAW";
    }
    else {
        status = "Next player: " + (xIsNext ? 'X' : 'O');
    }
    return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    isWin={winChain}
                    onClick={(i) => handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{movesVar}</ol>
            </div>
            <div className="toggle-button">
                <label className="switch">
                    <input type="checkbox" tittle="Turn on to sort the move in descending order "
                        onClick={() => toggle()} />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>
    );

}

export default Game;