const CHOICES_KEY = 'trolley_choices';
const REFLECTIONS_KEY = 'trolley_reflections';

interface Choice {
  choice: string;
  timestamp: string;
}

interface Reflection {
  question: string;
  answer: string;
  timestamp: string;
}

export const saveChoice = (choice: Choice): void => {
  const choices = getChoices();
  choices.push(choice);
  localStorage.setItem(CHOICES_KEY, JSON.stringify(choices));
};

export const getChoices = (): Choice[] => {
  const choices = localStorage.getItem(CHOICES_KEY);
  return choices ? JSON.parse(choices) : [];
};

export const saveReflection = (reflection: Reflection): void => {
  const reflections = getReflections();
  reflections.push(reflection);
  localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(reflections));
};

export const getReflections = (): Reflection[] => {
  const reflections = localStorage.getItem(REFLECTIONS_KEY);
  return reflections ? JSON.parse(reflections) : [];
};

export const clearChoices = (): void => {
  localStorage.removeItem(CHOICES_KEY);
  localStorage.removeItem(REFLECTIONS_KEY);
};
