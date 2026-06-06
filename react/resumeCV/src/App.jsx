import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import GeneralForm from "./components/GeneralForm";
import EducationalForm from "./components/EducationalForm";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <GeneralForm />
      <EducationalForm />
    </>
  );
}

export default App;
