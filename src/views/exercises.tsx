import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import type { BankExercise, Exercise, ListenExercise, MatchExercise, SelectExercise, TypeExercise } from "../data/courses";
import { speak } from "../lib/speech";

export type Answer = number | string[] | string | null;

export function normalizeAnswer(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC`]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/^[¿¡?!.,;:'"«»\s]+|[?!.,;:'"«»\s]+$/g, "");
}

export function answerReady(exercise: Exercise, answer: Answer): boolean {
  switch (exercise.kind) {
    case "select":
    case "listen":
      return typeof answer === "number";
    case "bank":
      return Array.isArray(answer) && answer.length > 0;
    case "type":
      return typeof answer === "string" && normalizeAnswer(answer).length > 0;
    case "match":
      return true;
  }
}

export function gradeAnswer(exercise: Exercise, answer: Answer): boolean {
  switch (exercise.kind) {
    case "select":
    case "listen":
      return answer === exercise.answer;
    case "bank":
      return Array.isArray(answer) && answer.length === exercise.answer.length && answer.every((tile, index) => tile === exercise.answer[index]);
    case "type":
      return typeof answer === "string" && exercise.accept.some((accepted) => normalizeAnswer(accepted) === normalizeAnswer(answer));
    case "match":
      return true;
  }
}

export function correctAnswerText(exercise: Exercise): string {
  switch (exercise.kind) {
    case "select":
    case "listen":
      return exercise.options[exercise.answer];
    case "bank":
      return exercise.answer.join(" ");
    case "type":
      return exercise.accept[0];
    case "match":
      return "";
  }
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function ExerciseHeading({ label, prompt, speakText, ttsLang }: { label: string; prompt: string; speakText?: string; ttsLang: string }) {
  return (
    <div className="exercise-heading">
      <span className="exercise-label">{label}</span>
      <div className="exercise-prompt-row">
        <h2 className="exercise-prompt">{prompt}</h2>
        {speakText && (
          <button type="button" className="speak-prompt" aria-label="Listen" onClick={() => speak(speakText, ttsLang)}>
            <Volume2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

type CommonProps = {
  revealed: boolean;
};

export function SelectOptions({ exercise, value, onChange, revealed }: CommonProps & { exercise: SelectExercise; value: number | null; onChange: (value: number) => void }) {
  return (
    <div className="option-list">
      {exercise.options.map((option, index) => {
        let state = "";
        if (revealed) {
          if (index === exercise.answer) state = "correct";
          else if (index === value) state = "incorrect";
        } else if (index === value) {
          state = "selected";
        }
        return (
          <button key={index} type="button" className={`option-button ${state}`} onClick={() => !revealed && onChange(index)} disabled={revealed}>
            <span className="option-index">{index + 1}</span>
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function WordBank({ exercise, value, onChange, revealed }: CommonProps & { exercise: BankExercise; value: string[]; onChange: (value: string[]) => void }) {
  const chosen = value;
  const remaining = useMemo(() => {
    const pool = [...exercise.tiles];
    for (const tile of chosen) pool.splice(pool.indexOf(tile), 1);
    return pool;
  }, [exercise.tiles, chosen]);

  function pickTile(tile: string) {
    if (revealed) return;
    onChange([...chosen, tile]);
  }

  function unpickTile(index: number) {
    if (revealed) return;
    onChange(chosen.filter((_, i) => i !== index));
  }

  return (
    <div className="word-bank">
      <div className={`bank-answer ${chosen.length ? "has-tiles" : ""}`}>
        {chosen.length === 0 && <span className="bank-placeholder">Tap the tiles to build the phrase</span>}
        {chosen.map((tile, index) => (
          <button key={`${tile}-${index}`} type="button" className="bank-tile chosen" onClick={() => unpickTile(index)}>
            {tile}
          </button>
        ))}
      </div>
      <div className="bank-tiles">
        {remaining.map((tile, index) => (
          <button key={`${tile}-${index}`} type="button" className="bank-tile" onClick={() => pickTile(tile)}>
            {tile}
          </button>
        ))}
      </div>
    </div>
  );
}

export function TypeAnswer({ exercise, value, onChange, revealed, onEnter }: CommonProps & { exercise: TypeExercise; value: string; onChange: (value: string) => void; onEnter: () => void }) {
  return (
    <div className="type-answer">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") onEnter();
        }}
        placeholder="Type your answer…"
        aria-label="Type your answer"
        disabled={revealed}
        autoFocus
      />
    </div>
  );
}

export function ListenChoice({ exercise, ttsLang, value, onChange, revealed }: CommonProps & { exercise: ListenExercise; ttsLang: string; value: number | null; onChange: (value: number) => void }) {
  const [ttsAvailable] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);

  useEffect(() => {
    if (ttsAvailable) speak(exercise.speak, ttsLang);
    // Play once per exercise mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.speak]);

  return (
    <div className="listen-choice">
      {ttsAvailable ? (
        <button type="button" className="listen-play" onClick={() => speak(exercise.speak, ttsLang)} aria-label="Play again">
          <Volume2 size={30} />
        </button>
      ) : (
        <p className="listen-fallback">No audio on this device — the phrase is: <strong>{exercise.speak}</strong></p>
      )}
      <SelectOptions exercise={{ kind: "select", prompt: exercise.speak, options: exercise.options, answer: exercise.answer }} value={value} onChange={onChange} revealed={revealed} />
    </div>
  );
}

export function MatchBoard({ exercise, ttsLang, onMistake, onSolved }: { exercise: MatchExercise; ttsLang: string; onMistake: () => void; onSolved: () => void }) {
  const [left] = useState(() => shuffle(exercise.pairs.map((pair) => pair[0])));
  const [right] = useState(() => shuffle(exercise.pairs.map((pair) => pair[1])));
  const [pickedLeft, setPickedLeft] = useState<string | null>(null);
  const [pickedRight, setPickedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [flash, setFlash] = useState<"wrong" | null>(null);

  // Parent callbacks get new identities every render (heart loss re-renders the
  // lesson); read them through refs so they never re-run or cancel the reset effect.
  const onMistakeRef = useRef(onMistake);
  const onSolvedRef = useRef(onSolved);
  useEffect(() => {
    onMistakeRef.current = onMistake;
    onSolvedRef.current = onSolved;
  });

  useEffect(() => {
    if (pickedLeft && pickedRight && !flash) {
      const isMatch = exercise.pairs.some(([target, base]) => target === pickedLeft && base === pickedRight);
      if (isMatch) {
        const next = [...matched, pickedLeft];
        setMatched(next);
        setPickedLeft(null);
        setPickedRight(null);
        if (next.length === exercise.pairs.length) {
          setTimeout(() => onSolvedRef.current(), 450);
        }
      } else {
        setFlash("wrong");
        onMistakeRef.current();
        const timer = setTimeout(() => {
          setFlash(null);
          setPickedLeft(null);
          setPickedRight(null);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [pickedLeft, pickedRight, exercise.pairs, matched, flash]);

  return (
    <div className="match-board">
      <div className="match-column">
        {left.map((tile) => {
          const done = matched.includes(tile);
          const state = done ? "matched" : pickedLeft === tile ? (flash === "wrong" ? "wrong" : "picked") : "";
          return (
            <button key={tile} type="button" className={`match-tile ${state}`} disabled={done || flash === "wrong"} onClick={() => { setPickedLeft(tile); speak(tile, ttsLang); }}>
              {tile}
            </button>
          );
        })}
      </div>
      <div className="match-column">
        {right.map((tile) => {
          const partner = exercise.pairs.find(([, base]) => base === tile)?.[0];
          const done = partner ? matched.includes(partner) : false;
          const state = done ? "matched" : pickedRight === tile ? (flash === "wrong" ? "wrong" : "picked") : "";
          return (
            <button key={tile} type="button" className={`match-tile ${state}`} disabled={done || flash === "wrong"} onClick={() => setPickedRight(tile)}>
              {tile}
            </button>
          );
        })}
      </div>
    </div>
  );
}
