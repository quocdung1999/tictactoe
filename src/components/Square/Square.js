import React from 'react';

function Square(props) {
    return (
      <button style={{ background: props.highlight === true ? '#ff8080' : 'white', cursor: "pointer", fontSize: "100%", color: "gray", }}
        className="square"
        onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

  export default Square;