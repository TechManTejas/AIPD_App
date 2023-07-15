

export default function playSound(filePath: string): void {
  const audio = new Audio(filePath);
  audio.play();
}

const playSoundAsync = async (filePath : string): Promise<void> => {
    const audio = new Audio(filePath);
    await audio.play();
};

export const PlayReps = async (sets : number, filePath: string): Promise<void> => {
  if (sets === 5) await playSoundAsync(filePath);
  else if (sets === 10) await playSoundAsync(filePath);
  else if (sets === 15) await playSoundAsync(filePath);
  else if (sets === 20) await playSoundAsync(filePath);
  await playSoundAsync("../sounds/Reps/sets.mp3");
};
