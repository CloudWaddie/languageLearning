import { useMemo, useState } from "react";
import { Check, Heart, HeartCrack, PartyPopper, Trophy, X } from "lucide-react";
import type { Course, Lesson } from "../data/courses";
import {
  Answer,
  ExerciseHeading,
  ListenChoice,
  MatchBoard,
  SelectOptions,
  TypeAnswer,
  WordBank,
  answerReady,
  correctAnswerText,
  gradeAnswer,
} from "./exercises";

const MAX_HEARTS = 5;

type LessonSessionProps = {
  course: Course;
  lesson: Lesson;
  onExit: () => void;
  onFinished: (xp: number, correct: number, total: number) => void;
};

export function LessonSession({ course, lesson, onExit, onFinished }: LessonSessionProps) {
  const [queue, setQueue] = useState<number[]>(() => lesson.exercises.map((_, index) => index));
  const [position, setPosition] = useState(0);
  const [hearts, setHearts] = useState(MAX_HEARTS);
  const [answer, setAnswer] = useState<Answer>(null);
  const [phase, setPhase] = useState<"answering" | "feedback" | "done" | "failed">("answering");
  const [wasCorrect, setWasCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [retried, setRetried] = useState<number[]>([]);
  const [missed, setMissed] = useState<number[]>([]);

  const exercise = lesson.exercises[queue[position]];
  const progress = queue.length ? Math.round((position / queue.length) * 100) : 0;
  const xpEarned = useMemo(() => correctCount * 2 + 5, [correctCount]);

  function loseHeart() {
    setHearts((current) => current - 1);
  }

  function handleMatchSolved() {
    setCorrectCount((count) => count + 1);
    setWasCorrect(true);
    setPhase("feedback");
  }

  function handleMatchMistake() {
    loseHeart();
    setMissed((list) => (list.includes(queue[position]) ? list : [...list, queue[position]]));
  }

  function check() {
    if (hearts <= 0) return;
    const correct = gradeAnswer(exercise, answer);
    setWasCorrect(correct);
    if (correct) {
      setCorrectCount((count) => count + 1);
    } else {
      loseHeart();
      setMissed((list) => (list.includes(queue[position]) ? list : [...list, queue[position]]));
      // Re-queue a missed exercise once, Duolingo-style.
      if (!retried.includes(queue[position])) {
        setRetried((list) => [...list, queue[position]]);
        setQueue((list) => [...list, queue[position]]);
      }
    }
    setPhase("feedback");
  }

  function advance() {
    if (hearts <= 0) {
      setPhase("failed");
      return;
    }
    if (position + 1 >= queue.length) {
      setPhase("done");
      return;
    }
    setPosition((value) => value + 1);
    setAnswer(null);
    setPhase("answering");
  }

  function retry() {
    setQueue(lesson.exercises.map((_, index) => index));
    setPosition(0);
    setHearts(MAX_HEARTS);
    setAnswer(null);
    setWasCorrect(false);
    setCorrectCount(0);
    setRetried([]);
    setMissed([]);
    setPhase("answering");
  }

  if (phase === "done") {
    const total = lesson.exercises.length;
    const firstTry = total - missed.length;
    return (
      <div className="lesson-screen">
        <div className="lesson-end-card">
          <div className="end-icon trophy"><Trophy size={38} /></div>
          <h1>Lesson complete!</h1>
          <p>You practised {lesson.title.toLowerCase()} in {course.name}.</p>
          <div className="end-stats">
            <div><span className="end-stat-icon xp"><PartyPopper size={15} /></span><strong>+{xpEarned} XP</strong><small>earned</small></div>
            <div><span className="end-stat-icon acc"><Check size={15} /></span><strong>{firstTry}/{total}</strong><small>first try</small></div>
            <div><span className="end-stat-icon hearts"><Heart size={15} fill="currentColor" /></span><strong>{hearts}</strong><small>hearts left</small></div>
          </div>
          <button className="primary-action end-action" onClick={() => onFinished(xpEarned, firstTry, total)}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (phase === "failed") {
    return (
      <div className="lesson-screen">
        <div className="lesson-end-card">
          <div className="end-icon broken"><HeartCrack size={38} /></div>
          <h1>Out of hearts</h1>
          <p>No worries — every mistake is part of learning. Try the lesson again.</p>
          <div className="end-actions-row">
            <button className="subtle-action" onClick={onExit}>Back to path</button>
            <button className="primary-action" onClick={retry}>Try again</button>
          </div>
        </div>
      </div>
    );
  }

  const revealed = phase === "feedback";
  const isMatch = exercise.kind === "match";

  return (
    <div className="lesson-screen">
      <div className="lesson-topbar">
        <button className="icon-button" aria-label="Quit lesson" onClick={onExit}><X size={20} /></button>
        <div className="lesson-progress"><span style={{ width: `${Math.min(100, Math.max(4, progress))}%` }} /></div>
        <div className="lesson-hearts" aria-label={`${hearts} hearts left`}>
          {Array.from({ length: MAX_HEARTS }).map((_, index) => (
            <Heart key={index} size={16} fill={index < hearts ? "currentColor" : "none"} className={index < hearts ? "heart-full" : "heart-empty"} />
          ))}
        </div>
      </div>

      <div className="exercise-stage">
        {exercise.kind === "select" && (
          <>
            <ExerciseHeading label="PICK THE RIGHT TRANSLATION" prompt={exercise.prompt} speakText={exercise.speak} ttsLang={course.ttsLang} />
            <SelectOptions exercise={exercise} value={typeof answer === "number" ? answer : null} onChange={setAnswer} revealed={revealed} />
          </>
        )}
        {exercise.kind === "bank" && (
          <>
            <ExerciseHeading label="BUILD THE PHRASE" prompt={exercise.prompt} ttsLang={course.ttsLang} />
            <WordBank exercise={exercise} value={Array.isArray(answer) ? answer : []} onChange={setAnswer} revealed={revealed} />
          </>
        )}
        {exercise.kind === "type" && (
          <>
            <ExerciseHeading label="TYPE IT OUT" prompt={exercise.prompt} speakText={exercise.speak} ttsLang={course.ttsLang} />
            <TypeAnswer exercise={exercise} value={typeof answer === "string" ? answer : ""} onChange={setAnswer} revealed={revealed} onEnter={() => answerReady(exercise, answer) && check()} />
          </>
        )}
        {exercise.kind === "match" && (
          <>
            <ExerciseHeading label="MATCH THE PAIRS" prompt="Tap a phrase and its translation" ttsLang={course.ttsLang} />
            <MatchBoard exercise={exercise} ttsLang={course.ttsLang} onMistake={handleMatchMistake} onSolved={handleMatchSolved} />
          </>
        )}
        {exercise.kind === "listen" && (
          <>
            <ExerciseHeading label="WHAT DID YOU HEAR?" prompt="Listen, then pick the phrase" ttsLang={course.ttsLang} />
            <ListenChoice exercise={exercise} ttsLang={course.ttsLang} value={typeof answer === "number" ? answer : null} onChange={setAnswer} revealed={revealed} />
          </>
        )}
      </div>

      <div className={`lesson-footer ${revealed ? (wasCorrect ? "good" : "bad") : ""}`}>
        {!revealed && !isMatch && (
          <button className="check-button" disabled={!answerReady(exercise, answer)} onClick={check}>Check</button>
        )}
        {revealed && (
          <div className="feedback-row">
            <div className="feedback-copy">
              <strong>{wasCorrect ? "Correct!" : "Not quite"}</strong>
              {!wasCorrect && correctAnswerText(exercise) && (
                <span>Correct answer: <em>{correctAnswerText(exercise)}</em></span>
              )}
            </div>
            <button className={`check-button ${wasCorrect ? "good" : "bad"}`} onClick={advance}>
              {position + 1 >= queue.length ? "Finish" : "Continue"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
