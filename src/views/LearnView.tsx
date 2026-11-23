import { Check, Lock, Play, Star } from "lucide-react";
import type { Course, Lesson } from "../data/courses";
import { ProgressStore, completedCount, isLessonDone, isLessonUnlocked } from "../state/progress";

const NODE_OFFSETS = [0, 52, 76, 52, 0, -52, -76, -52];

export function LearnView({ course, store, onStartLesson }: { course: Course; store: ProgressStore; onStartLesson: (lesson: Lesson) => void }) {
  const done = completedCount(store, course);
  const total = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const nextId = course.units.flatMap((unit) => unit.lessons).find((lesson) => !isLessonDone(store, course.id, lesson.id))?.id;

  return (
    <div className="learn-page">
      {course.units.map((unit, unitIndex) => (
        <section className="unit-section" key={unit.id}>
          <div className={`unit-banner ${unit.color}`}>
            <div>
              <span className="overline">UNIT {unitIndex + 1} · {course.name.toUpperCase()}</span>
              <h2>{unit.title}</h2>
              <p>{unit.blurb}</p>
            </div>
            <div className="unit-badge"><Star size={20} /></div>
          </div>
          <div className="lesson-path">
            {unit.lessons.map((lesson, lessonIndex) => {
              const complete = isLessonDone(store, course.id, lesson.id);
              const unlocked = isLessonUnlocked(store, course, lesson.id);
              const isNext = lesson.id === nextId;
              const offset = NODE_OFFSETS[lessonIndex % NODE_OFFSETS.length];
              return (
                <div className="path-node-row" key={lesson.id} style={{ transform: `translateX(${offset}px)` }}>
                  {isNext && <div className="start-bubble">Start</div>}
                  <button
                    type="button"
                    className={`path-node ${unit.color} ${complete ? "done" : unlocked ? "open" : "locked"}`}
                    disabled={!unlocked}
                    onClick={() => onStartLesson(lesson)}
                    aria-label={complete ? `Review ${lesson.title}` : unlocked ? `Start ${lesson.title}` : `${lesson.title} locked`}
                  >
                    {complete ? <Check size={24} strokeWidth={3} /> : unlocked ? <Play size={22} fill="currentColor" /> : <Lock size={20} />}
                  </button>
                  <div className="path-node-label">
                    <strong>{lesson.title}</strong>
                    <span>{lesson.words.length} words · {lesson.exercises.length} exercises</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
      <div className="path-end">
        <div className="path-end-card">
          <strong>{done === total ? "Course complete — bravo!" : `${done} of ${total} lessons done`}</strong>
          <span>{done === total ? "Keep practising in Free talk and the Word garden." : "Finish every lesson to master the basics."}</span>
        </div>
      </div>
    </div>
  );
}
