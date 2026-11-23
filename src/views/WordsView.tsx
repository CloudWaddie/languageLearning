import { useMemo, useState } from "react";
import { Brain, Check, RotateCcw, Search, Sparkles, Star, Volume2, X } from "lucide-react";
import type { Course, Word } from "../data/courses";
import { allLessons } from "../data/courses";
import { speak } from "../lib/speech";
import { ProgressStore, isLessonDone } from "../state/progress";

type WordsViewProps = {
  course: Course;
  store: ProgressStore;
  onToggleWord: (key: string) => void;
  onStartLesson: () => void;
};

export function wordKey(courseId: string, word: Word): string {
  return `${courseId}:${word.target}`;
}

export function WordsView({ course, store, onToggleWord, onStartLesson }: WordsViewProps) {
  const [search, setSearch] = useState("");
  const [quizOn, setQuizOn] = useState(false);

  const learnedWords = useMemo(
    () => allLessons(course).filter((lesson) => isLessonDone(store, course.id, lesson.id)).flatMap((lesson) => lesson.words),
    [course, store],
  );

  const visible = learnedWords.filter((word) => `${word.target} ${word.base}`.toLowerCase().includes(search.toLowerCase()));

  if (quizOn) {
    return <RecallQuiz words={learnedWords} course={course} onClose={() => setQuizOn(false)} />;
  }

  return (
    <div className="product-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><span className="live-dot" /> WORD GARDEN</div>
          <h1>Words that stick</h1>
          <p>Every word you meet in a lesson lands here. Star the ones you want to keep close.</p>
        </div>
        <div className="garden-count"><Sparkles size={15} /> {learnedWords.length} words learned</div>
      </div>

      <div className="garden-feature panel">
        <div className="garden-feature-icon"><Brain size={25} /></div>
        <div>
          <span className="overline">READY FOR A RECALL GAME?</span>
          <h2>Make today's words sparkle.</h2>
          <p>{learnedWords.length >= 4 ? "Five quick questions — trust your first instinct." : "Finish a lesson to unlock the recall game."}</p>
        </div>
        <button className="primary-action" disabled={learnedWords.length < 4} onClick={() => setQuizOn(true)}>
          <RotateCcw size={15} /> Start recall
        </button>
      </div>

      {learnedWords.length === 0 ? (
        <div className="empty-state panel">
          <h3>Your garden is waiting</h3>
          <p>Complete your first lesson and the words you meet will grow here.</p>
          <button className="primary-action" onClick={onStartLesson}>Start learning</button>
        </div>
      ) : (
        <>
          <div className="section-heading">
            <div><span className="overline">YOUR COLLECTION</span><h2>{course.nativeName} so far</h2></div>
            <label className="search-field"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a word" /></label>
          </div>
          <div className="word-grid">
            {visible.map((word, index) => {
              const key = wordKey(course.id, word);
              const saved = store.savedWords.includes(key);
              const tones = ["yellow", "mint", "peach", "blue"];
              return (
                <div className="word-card panel" key={key}>
                  <div className={`word-card-top ${tones[index % tones.length]}`}>
                    <span>{course.name}</span>
                    <button onClick={() => onToggleWord(key)} aria-label={`${saved ? "Unsave" : "Save"} ${word.target}`}>
                      <Star size={16} fill={saved ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <div className="word-card-body">
                    <h3>{word.target}</h3>
                    <p>{word.base}</p>
                    <button className="listen-link" onClick={() => speak(word.target, course.ttsLang)}><Volume2 size={13} /> Listen</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function RecallQuiz({ words, course, onClose }: { words: Word[]; course: Course; onClose: () => void }) {
  const [questions] = useState(() => {
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, 5);
    return shuffled.map((word) => {
      const distractors = words.filter((item) => item.target !== word.target).sort(() => Math.random() - 0.5).slice(0, 3).map((item) => item.base);
      const options = [...distractors, word.base].sort(() => Math.random() - 0.5);
      return { word, options, answer: options.indexOf(word.base) };
    });
  });
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  if (index >= questions.length) {
    return (
      <div className="lesson-screen">
        <div className="lesson-end-card">
          <div className="end-icon trophy"><Brain size={38} /></div>
          <h1>Recall done!</h1>
          <p>You remembered {score} of {questions.length} words.</p>
          <button className="primary-action end-action" onClick={onClose}>Back to the garden</button>
        </div>
      </div>
    );
  }

  const question = questions[index];

  function pick(optionIndex: number) {
    if (picked !== null) return;
    setPicked(optionIndex);
    if (optionIndex === question.answer) setScore((value) => value + 1);
    else speak(question.word.target, course.ttsLang);
    setTimeout(() => {
      setPicked(null);
      setIndex((value) => value + 1);
    }, 900);
  }

  return (
    <div className="lesson-screen">
      <div className="lesson-topbar">
        <button className="icon-button" aria-label="Close quiz" onClick={onClose}><X size={20} /></button>
        <div className="lesson-progress"><span style={{ width: `${(index / questions.length) * 100}%` }} /></div>
        <div className="quiz-score"><Sparkles size={14} /> {score}</div>
      </div>
      <div className="exercise-stage">
        <div className="exercise-heading">
          <span className="exercise-label">WHAT DOES IT MEAN?</span>
          <div className="exercise-prompt-row">
            <h2 className="exercise-prompt">«{question.word.target}»</h2>
            <button type="button" className="speak-prompt" aria-label="Listen" onClick={() => speak(question.word.target, course.ttsLang)}><Volume2 size={18} /></button>
          </div>
        </div>
        <div className="option-list">
          {question.options.map((option, optionIndex) => {
            let state = "";
            if (picked !== null) {
              if (optionIndex === question.answer) state = "correct";
              else if (optionIndex === picked) state = "incorrect";
            }
            return (
              <button key={optionIndex} type="button" className={`option-button ${state}`} onClick={() => pick(optionIndex)}>
                <span className="option-index">{optionIndex === question.answer && picked !== null ? <Check size={14} /> : optionIndex + 1}</span>
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
