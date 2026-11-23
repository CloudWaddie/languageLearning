export function speak(text: string, lang: string) {
  try {
    window.speechSynthesis?.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis?.speak(utterance);
  } catch {
    // Speech synthesis unavailable — exercises still work without audio.
  }
}
