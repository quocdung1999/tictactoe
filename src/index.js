import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class Board extends React.Component {

  renderSquare(i, highlight) {
    return <Square value={this.props.squares[i]} highlight={highlight}
      onClick={() => this.props.onClick(i)}></Square>;
  }

  render() {
    const board = [];
    const isWin = this.props.isWin;

    let items = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (isWin) {
          let [a, b, c] = isWin;
          if (a === 3 * i + j || b === 3 * i + j || c === 3 * i + j) {
            items.push(this.renderSquare(3 * i + j, true));
          }
          else {
            items.push(this.renderSquare(3 * i + j, false));
          }
        }
        else {
          items.push(this.renderSquare(3 * i + j, false));
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
}

function Square(props) {
  return (
    <button style={{ background: props.highlight === true ? '#ff8080' : 'white', cursor: "pointer", fontSize: "100%", color: "gray", }}
      className="square"
      onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        }
      ],
      moves: Array(0).fill(null),
      stepNumber: 0,
      historyIsClicked: -1,
      xIsNext: true,
      isAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    let moves = this.state.moves.slice(0, this.state.stepNumber);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    moves.push(i);
    this.setState(
      {
        history: history.concat([
          {
            squares: squares,
          }
        ]),
        moves: moves,
        stepNumber: history.length,
        historyIsClicked: -1,
        xIsNext: !this.state.xIsNext,
      }
    );
  }
  toggle() {
    this.setState(
      {
        isAscending: !this.state.isAscending,
      }
    )
  }
  jumpTo(step) {
    this.setState(
      {
        stepNumber: step,
        historyIsClicked: step,
        xIsNext: (step % 2) === 0,
      }
    );
  }
  isDraw(current) {
    for (let i = 0; i < current.squares.length; i++) {
      if (!current.squares[i]) {
        return false;
      }
    }
    return true;
  }
  render() {
    let history;
    const stepNumber = this.state.stepNumber;
    let current;
    const isAscending = this.state.isAscending;
    let desc;
    let moves;
    if (isAscending === true) {
      //console.log('true');
      history = this.state.history;
      current = history[stepNumber];
      moves = history.map((step, move) => {

        desc = move ? 'Go to move #' + move + ' - ' + '(R: ' + (Math.floor(this.state.moves[move - 1] / 3) + 1) + ', C: '
          + (this.state.moves[move - 1] % 3 + 1) + ')' : 'Go to start';
        return (
          <li key={move}>

            <button onClick={() => this.jumpTo(move)}>
              {move === this.state.historyIsClicked ? <b>{desc}</b> : desc}
            </button>
          </li>
        );
      });
    }
    else {
      history = this.state.history.reverse();
      current = history[0];
      moves = history.map((step, move) => {
        console.log(move);
        desc = (stepNumber - move) ? 'Go to move #' + (stepNumber - move) + ' - ' + '(R: ' +
          (Math.floor(this.state.moves[move - 1] / 3) + 1) + ', C: '
          + (this.state.moves[move - 1] % 3 + 1) + ')' : 'Go to start';
        return (
          <li key={move}>

            <button onClick={() => this.jumpTo(stepNumber - move)}>
              {stepNumber - move === this.state.historyIsClicked ? <b>{desc}</b> : desc}
            </button>
          </li>
        );
      });
    }
    const winChain = calculateWinner(current.squares);
    let status;
    if (this.isDraw(current) === true) {
      status = "DRAW";
    }
    else if (!winChain) {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }
    else {
      status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            isWin={winChain}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div className="toggle-button">
          <label className="switch">
            <input type="checkbox" tittle="Turn on to sort the move in descending order "
              onClick={() => this.toggle()} />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    );
  }
}
/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React 
        </a>
      </header>
    </div>
  );
}
*/

ReactDOM.render(
  <React.StrictMode>
    <Game></Game>
  </React.StrictMode>,
  document.getElementById('root')
);