import React from 'react';
import Square from '../Square/Square.js';

function Board(props) {
    function renderSquare(i, highlight) {
        return <Square value={props.squares[i]} highlight={highlight}
            onClick={() => props.onClick(i)}></Square>;
    };
    const board = [];
    const isWin = props.isWin;

    let items = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (isWin) {
                let [a, b, c] = isWin;
                if (a === 3 * i + j || b === 3 * i + j || c === 3 * i + j) {
                    items.push(renderSquare(3 * i + j, true));
                }
                else {
                    items.push(renderSquare(3 * i + j, false));
                }
            }
            else {
                items.push(renderSquare(3 * i + j, false));
            }
        }
        board.push(<div className="board-row">{items}</div>);
        items = [];
    }
    return (
        <div>
            {board}
        </div>
    );
}

export default Board;