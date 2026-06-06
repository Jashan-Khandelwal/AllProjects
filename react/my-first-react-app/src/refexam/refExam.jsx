import React from "react";

const styles = `
.box {
  height: 120px;
  width: 120px;
  background-color: ghostwhite;
}

.is-animating {
  animation: inflate 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

@keyframes inflate {
  from {
    transform: scale(0.9);
  }
  to {
    transform: scale(1.07);
  }
}
`;

export const RefExample = () => {
  const boxRef = React.useRef(null);
  const [isAnimating, setIsAnimating] = React.useState(false);

  function handleStartAnimation() {
    setIsAnimating(true);
    boxRef.current.style.transform = "translateX(300px)";
    setTimeout(() => {
      setIsAnimating(false);
      boxRef.current.style.transform = "";
    }, 1000);
  }

  return (
    <>
      <style>{styles}</style>

      <div className="App">
        <div
          ref={boxRef}
          className={`box ${isAnimating ? "is-animating" : ""}`}
        >
          <p>Hello, I'm an animated box!</p>
        </div>

        <button onClick={handleStartAnimation}>Start Animation</button>
      </div>
    </>
  );
};
export default RefExample;
