import React from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

const HandStyle = styled.div`
  position: absolute;
  bottom: 50%;
  width: 2px;
  height: 50%;
  background: black;
  transform-origin: bottom;
  transform: ${(props) => `rotate(${props.angle}deg)`};
`;

function Hand({ type, angle, handleDrag }) {
  return (
    <Draggable onDrag={handleDrag.bind(null, type)}>
      <HandStyle angle={angle} />
    </Draggable>
  );
}

export default Hand;
