import * as React from "react";

function PillButton({ image, text, onClick }) {
  return (
    <div onClick={onClick}>
      <img src={image} />
      {text}
    </div>
  );
}

export default PillButton;
