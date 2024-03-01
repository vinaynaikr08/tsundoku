import React from "react";
import { useState } from "react";

type ItemData = {
  title: string[];
  state: boolean[];
  setter: React.Dispatch<React.SetStateAction<boolean>>[];
};

export const DATA = () => {
  const [youngAdultFiction, setYoungAdultFiction] = useState(false);
  const [fiction, setFiction] = useState(false);
  const [juvenileFiction, setJuvenileFiction] = useState(false);
  const [antiques, setAntiques] = useState(false);
  const [architecture, setArchitecture] = useState(false);
  const [art, setArt] = useState(false);
  const [bibles, setBibles] = useState(false);
  const [biography, setBiography] = useState(false);
  const [bodyMindSpirit, setBodyMindSpirit] = useState(false);
  const [business, setBusiness] = useState(false);
  const [comics, setComics] = useState(false);
  const [computers, setComputers] = useState(false);
  const [cooking, setCooking] = useState(false);
  const [crafts, setCrafts] = useState(false);
  const [design, setDesign] = useState(false);
  const [drama, setDrama] = useState(false);
  const [education, setEducation] = useState(false);
  const [family, setFamily] = useState(false);
  const [foreignLanguage, setForeignLanguage] = useState(false);
  const [games, setGames] = useState(false);
  const [gardening, setGardening] = useState(false);
  const [health, setHealth] = useState(false);
  const [history, setHistory] = useState(false);
  const [house, setHouse] = useState(false);
  const [humor, setHumor] = useState(false);
  const [juvenileNonniction, setJuvenileNonfiction] = useState(false);
  const [languageArts, setLanguageArts] = useState(false);

  const [law, setLaw] = useState(false);
  const [literaryCollections, setLiteraryCollections] = useState(false);
  const [literaryCriticism, setLiteraryCriticism] = useState(false);
  const [mathematics, setMathematics] = useState(false);
  const [medical, setMedical] = useState(false);
  const [music, setMusic] = useState(false);
  const [nature, setNature] = useState(false);
  const [performingArts, setPerformingArts] = useState(false);
  const [pets, setPets] = useState(false);
  const [philosophy, setPhilosophy] = useState(false);
  const [photography, setPhotography] = useState(false);
  const [poetry, setPoetry] = useState(false);
  const [politicalScience, setPoliticalScience] = useState(false);
  const [psychology, setPsychology] = useState(false);
  const [reference, setReference] = useState(false);
  const [religion, setReligion] = useState(false);
  const [science, setScience] = useState(false);
  const [selfHelp, setSelfHelp] = useState(false);
  const [socialScience, setSocialScience] = useState(false);
  const [sportsRecreation, setSportsRecreation] = useState(false);
  const [studyAids, setStudyAids] = useState(false);
  const [technologyEngineering, setTechnologyEngineering] = useState(false);
  const [transportation, setTransportation] = useState(false);
  const [travel, setTravel] = useState(false);
  const [trueCrime, setTrueCrime] = useState(false);
  const [youngAdultNonfiction, setYoungAdultNonfiction] = useState(false);

  const GENRES = [
    {
      title: ["Young Adult Fiction", "Law"],
      state: [youngAdultFiction, law],
      setter: [setYoungAdultFiction, setLaw],
    },
    {
      title: ["Fiction", "Literary Collections"],
      state: [fiction, literaryCollections],
      setter: [setFiction, setLiteraryCollections],
    },
    {
      title: ["Juvenile Fiction", "Literary Criticism"],
      state: [juvenileFiction, literaryCriticism],
      setter: [setJuvenileFiction, setLiteraryCriticism],
    },
    {
      title: ["Antiques/Collectibles", "Mathematics"],
      state: [antiques, mathematics],
      setter: [setAntiques, setMathematics],
    },
    {
      title: ["Architecture", "Medical"],
      state: [architecture, medical],
      setter: [setArchitecture, setMedical],
    },
    {
      title: ["Art", "Music"],
      state: [art, music],
      setter: [setArt, setMusic],
    },
    {
      title: ["Bibles", "Nature"],
      state: [bibles, nature],
      setter: [setBibles, setNature],
    },
    {
      title: ["Autobiographies & Biographies", "Performing Arts"],
      state: [biography, performingArts],
      setter: [setBiography, setPerformingArts],
    },
    {
      title: ["Body, Mind, and Spirit", "Pets"],
      state: [bodyMindSpirit, pets],
      setter: [setBodyMindSpirit, setPets],
    },
    {
      title: ["Business & Economics", "Philosophy"],
      state: [business, philosophy],
      setter: [setBusiness, setPhilosophy],
    },
    {
      title: ["Comics & Graphic Novels", "Photography"],
      state: [comics, photography],
      setter: [setComics, setPhotography],
    },
    {
      title: ["Computers", "Poetry"],
      state: [computers, poetry],
      setter: [setComputers, setPoetry],
    },
    {
      title: ["Cooking", "Poltiical Science"],
      state: [cooking, politicalScience],
      setter: [setCooking, setPoliticalScience],
    },
    {
      title: ["Crafts & Hobbies", "Psychology"],
      state: [crafts, psychology],
      setter: [setCrafts, setPsychology],
    },
    {
      title: ["Design", "Reference"],
      state: [design, reference],
      setter: [setDesign, setReference],
    },
    {
      title: ["Drama", "Religion"],
      state: [drama, religion],
      setter: [setDrama, setReligion],
    },
    {
      title: ["Education", "Science"],
      state: [education, science],
      setter: [setEducation, setScience],
    },
    {
      title: ["Family & Relationships", "Self-Help"],
      state: [family, selfHelp],
      setter: [setFamily, setSelfHelp],
    },
    {
      title: ["Foreign Language Study", "Social Science"],
      state: [foreignLanguage, socialScience],
      setter: [setForeignLanguage, setSocialScience],
    },
    {
      title: ["Games & Acitivites", "Sports & Recreation"],
      state: [games, sportsRecreation],
      setter: [setGames, setSportsRecreation],
    },
    {
      title: ["Gardening", "Study Aids"],
      state: [gardening, studyAids],
      setter: [setGardening, setStudyAids],
    },
    {
      title: ["Health & Fitness", "Technology & Engineering"],
      state: [health, technologyEngineering],
      setter: [setHealth, setTechnologyEngineering],
    },
    {
      title: ["History", "Transportation"],
      state: [history, transportation],
      setter: [setHistory, setTransportation],
    },
    {
      title: ["House & Home", "Travel"],
      state: [house, travel],
      setter: [setHouse, setTravel],
    },
    {
      title: ["Humor", "True Crime"],
      state: [humor, trueCrime],
      setter: [setHumor, setTrueCrime],
    },
    {
      title: ["Juvenile Nonfiction", "Young Adult Nonfiction"],
      state: [juvenileNonniction, youngAdultNonfiction],
      setter: [setJuvenileNonfiction, setYoungAdultNonfiction],
    },
    {
      title: ["Language Arts & Disciplines", ""],
      state: [languageArts, languageArts],
      setter: [setLanguageArts, setLanguageArts],
    },
  ];
  return GENRES;
};
