import React from "react";

const Input = React.forwardRef((props, ref) => {
  return (
    <div className="flex items-center mb-2">
      <label htmlFor={props.input.id}>{props.label}</label>
      <input ref={ref} {...props.input} />
    </div>
  );
});

export default Input;
