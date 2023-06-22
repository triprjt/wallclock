import React, { useEffect, useState } from "react";
import "./Clock.css";
function Clock() {
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [dragging, setDragging] = useState(null);
  const [inputValue, setInputValue] = useState("00:00");
  const [isEditing, setIsEditing] = useState(false);
  const [previousInputValue, setPreviousInputValue] = useState("");
  const radius = 100;
  const gap = 120;

  const [hoveredLine, setHoveredLine] = useState(null);
  const [inputValid, setInputValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleMouseEnter = (type) => () => {
    setHoveredLine(type);
  };

  const handleMouseLeave = () => {
    setHoveredLine(null);
  };
  useEffect(() => {
    if (!dragging && !isEditing) {
      const timer = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime.seconds >= 59) {
            let newMinutes = prevTime.minutes + 1;
            if (newMinutes >= 60) {
              newMinutes = 0;
            }
            return { minutes: newMinutes, seconds: 0 };
          } else {
            return { ...prevTime, seconds: prevTime.seconds + 1 };
          }
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [dragging, isEditing]);

  useEffect(() => {
    setInputValue(`${leadingZero(time.minutes)}:${leadingZero(time.seconds)}`);
  }, [time]);

  const angleToTime = (angle, type) => {
    switch (type) {
      case "minutes":
      case "seconds":
        return (angle / (2 * Math.PI)) * 60;
      default:
        return;
    }
  };

  const handleMouseDown = (type) => () => {
    setDragging(type);
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left - radius;
      const y = e.clientY - rect.top - radius;
      const dist = Math.sqrt(x * x + y * y);
      if (dist <= radius) {
        let rad = Math.atan2(y, x);
        rad = rad < 0 ? rad + 2 * Math.PI : rad; // ensure rad is in the range 0 to 2pi
        const newValue = Math.round(angleToTime(rad, dragging));
        setTime((prevTime) => ({ ...prevTime, [dragging]: newValue }));
      }
    }
  };

  const leadingZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  const secondsToRadians = (seconds) => {
    return ((seconds / 60) * 360 - 90) * (Math.PI / 180);
  };

  const minutesToRadians = (minutes) => {
    return ((minutes / 60) * 360 - 90) * (Math.PI / 180);
  };

  const handleInputChange = (e) => {
    const [minutes, seconds] = e.target.value.split(":").map(Number);
    if (isNaN(minutes) || isNaN(seconds) || minutes > 60 || seconds > 60) {
      setInputValid(false);
      setErrorMessage(
        "Invalid value. Please enter a value between 0 and 60 for minutes and seconds."
      );
      return;
    }
    setInputValue(e.target.value);
    setInputValid(true);
    setErrorMessage(null);
  };

  const handleInputBlur = () => {
    const [minutes, seconds] = inputValue.split(":").map(Number);
    if (!inputValid) {
      setInputValue(previousInputValue);
      return;
    }
    setPreviousInputValue(inputValue);
    setTime({ minutes, seconds });
    if (dragging !== null) {
      setDragging(null);
    }
    setIsEditing(false); // Set isEditing to false after the input is processed
  };

  const handleInputFocus = () => {
    setPreviousInputValue(inputValue);
    setIsEditing(true);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          height: 2.2 * radius,
          width: 2.2 * radius,
          borderRadius: "50%",
          border: "3px solid blue",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Inner SVG with clock */}
        <svg
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          height={2 * radius}
          width={2 * radius}
        >
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            stroke="blue"
            strokeWidth="3"
            fill="white"
          />
          <line
            onMouseDown={handleMouseDown("seconds")}
            onMouseEnter={handleMouseEnter("minutes")}
            onMouseLeave={handleMouseLeave}
            x1={radius}
            y1={radius}
            x2={radius + radius * Math.cos(secondsToRadians(time.seconds))}
            y2={radius + radius * Math.sin(secondsToRadians(time.seconds))}
            stroke="red"
            strokeWidth="2"
            className="line"
          />
          <line
            onMouseDown={handleMouseDown("minutes")}
            onMouseEnter={handleMouseEnter("seconds")}
            onMouseLeave={handleMouseLeave}
            x1={radius}
            y1={radius}
            x2={
              radius + 0.8 * radius * Math.cos(minutesToRadians(time.minutes))
            }
            y2={
              radius + 0.8 * radius * Math.sin(minutesToRadians(time.minutes))
            }
            stroke="black"
            strokeWidth="3"
            className="line"
          />
        </svg>
      </div>
      <div style={{ color: inputValid ? "black" : "red" }}>{errorMessage}</div>
      <input
        style={
          ({ color: inputValid ? "black" : "yellow" },
          { fill: inputValid ? "none" : "red" })
        }
        className="input"
        value={inputValue}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleInputBlur();
          }
        }}
        onBlur={handleInputBlur}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
      />
    </div>
  );
}

export default Clock;
