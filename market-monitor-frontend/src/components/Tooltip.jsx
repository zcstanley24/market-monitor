import React, { useState } from "react";

const Tooltip = ({ label, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}   // for keyboard accessibility
      onBlur={() => setVisible(false)}
      tabIndex={0} // make it focusable
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "125%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
            padding: "6px 10px",
            backgroundColor: "black",
            color: "white",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            zIndex: 1000,
            fontSize: "12px",
            boxShadow: "0px 0px 6px rgba(0,0,0,0.3)",
          }}
        >
          {label}
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              marginLeft: "-5px",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid black",
            }}
          />
        </div>
      )}
    </span>
  );
};

export default Tooltip;