import { useState } from "react";
import GeneralForm from "./components/GeneralForm";
import EducationalForm from "./components/EducationalForm";
import ExperienceForm from "./components/ExperienceForm";
import CVPreview from "./components/CVPreview";
import "./styles/main.css";

const emptyEducation = () => ({ school: "", degree: "", start: "", end: "" });
const emptyExperience = () => ({
  company: "",
  position: "",
  responsibilities: "",
  from: "",
  to: "",
});

function App() {
  const [generalInfo, setGeneralInfo] = useState({ name: "", email: "", phone: "" });
  const [generalSubmitted, setGeneralSubmitted] = useState(false);

  const [education, setEducation] = useState([emptyEducation()]);
  const [educationSubmitted, setEducationSubmitted] = useState(false);

  const [experience, setExperience] = useState([emptyExperience()]);
  const [experienceSubmitted, setExperienceSubmitted] = useState(false);

  const handleGeneralChange = (field, value) =>
    setGeneralInfo((prev) => ({ ...prev, [field]: value }));

  const handleEducationChange = (idx, field, value) =>
    setEducation((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });

  const addEducation = () => setEducation((prev) => [...prev, emptyEducation()]);

  const removeEducation = (idx) =>
    setEducation((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)
    );

  const handleExperienceChange = (idx, field, value) =>
    setExperience((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });

  const addExperience = () => setExperience((prev) => [...prev, emptyExperience()]);

  const removeExperience = (idx) =>
    setExperience((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== idx)
    );

  return (
    <div className="app-layout">
      <div className="forms-panel">
        <h1>CV Builder</h1>

        <GeneralForm
          data={generalInfo}
          isSubmitted={generalSubmitted}
          onChange={handleGeneralChange}
          onSubmit={() => setGeneralSubmitted(true)}
          onEdit={() => setGeneralSubmitted(false)}
        />

        <EducationalForm
          entries={education}
          isSubmitted={educationSubmitted}
          onChange={handleEducationChange}
          onAdd={addEducation}
          onRemove={removeEducation}
          onSubmit={() => setEducationSubmitted(true)}
          onEdit={() => setEducationSubmitted(false)}
        />

        <ExperienceForm
          entries={experience}
          isSubmitted={experienceSubmitted}
          onChange={handleExperienceChange}
          onAdd={addExperience}
          onRemove={removeExperience}
          onSubmit={() => setExperienceSubmitted(true)}
          onEdit={() => setExperienceSubmitted(false)}
        />
      </div>

      <div className="preview-panel">
        <CVPreview
          generalInfo={generalInfo}
          education={education}
          experience={experience}
        />
      </div>
    </div>
  );
}

export default App;
