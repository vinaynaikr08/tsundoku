import React from "react";

export const DATA = () => {
  const [youngAdultFiction, setYoungAdultFiction] = React.useState(false);
  const [fiction, setFiction] = React.useState(false);
  const [juvenileFiction, setJuvenileFiction] = React.useState(false);
  const [antiques, setAntiques] = React.useState(false);
  const [architecture, setArchitecture] = React.useState(false);
  const [art, setArt] = React.useState(false);
  const [bibles, setBibles] = React.useState(false);
  const [biography, setBiography] = React.useState(false);
  const [bodyMindSpirit, setBodyMindSpirit] = React.useState(false);
  const [business, setBusiness] = React.useState(false);
  const [comics, setComics] = React.useState(false);
  const [computers, setComputers] = React.useState(false);
  const [cooking, setCooking] = React.useState(false);
  const [crafts, setCrafts] = React.useState(false);
  const [design, setDesign] = React.useState(false);
  const [drama, setDrama] = React.useState(false);
  const [education, setEducation] = React.useState(false);
  const [family, setFamily] = React.useState(false);
  const [foreignLanguage, setForeignLanguage] = React.useState(false);
  const [games, setGames] = React.useState(false);
  const [gardening, setGardening] = React.useState(false);
  const [health, setHealth] = React.useState(false);
  const [history, setHistory] = React.useState(false);
  const [house, setHouse] = React.useState(false);
  const [humor, setHumor] = React.useState(false);
  const [juvenileNonniction, setJuvenileNonfiction] = React.useState(false);
  const [languageArts, setLanguageArts] = React.useState(false);

  const [law, setLaw] = React.useState(false);
  const [literaryCollections, setLiteraryCollections] = React.useState(false);
  const [literaryCriticism, setLiteraryCriticism] = React.useState(false);
  const [mathematics, setMathematics] = React.useState(false);
  const [medical, setMedical] = React.useState(false);
  const [music, setMusic] = React.useState(false);
  const [nature, setNature] = React.useState(false);
  const [performingArts, setPerformingArts] = React.useState(false);
  const [pets, setPets] = React.useState(false);
  const [philosophy, setPhilosophy] = React.useState(false);
  const [photography, setPhotography] = React.useState(false);
  const [poetry, setPoetry] = React.useState(false);
  const [politicalScience, setPoliticalScience] = React.useState(false);
  const [psychology, setPsychology] = React.useState(false);
  const [reference, setReference] = React.useState(false);
  const [religion, setReligion] = React.useState(false);
  const [science, setScience] = React.useState(false);
  const [selfHelp, setSelfHelp] = React.useState(false);
  const [socialScience, setSocialScience] = React.useState(false);
  const [sportsRecreation, setSportsRecreation] = React.useState(false);
  const [studyAids, setStudyAids] = React.useState(false);
  const [technologyEngineering, setTechnologyEngineering] = React.useState(false);
  const [transportation, setTransportation] = React.useState(false);
  const [travel, setTravel] = React.useState(false);
  const [trueCrime, setTrueCrime] = React.useState(false);
  const [youngAdultNonfiction, setYoungAdultNonfiction] = React.useState(false);

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
