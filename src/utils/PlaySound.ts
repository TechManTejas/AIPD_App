
export default function playSound(filePath: string): void {
  const audio = new Audio(filePath);
  audio.play();
}
