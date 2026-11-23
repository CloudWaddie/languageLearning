import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { Course, allLessons } from "../data/courses";

const STORAGE_KEY = "lingua-progress-v1";
export const DAILY_GOAL_XP = 40;

export type ProgressStore = {
  courseId: string | null;
  lessonsDone: Record<string, string[]>;
  xpByDate: Record<string, number>;
  savedWords: string[];
  sessionsPlayed: number;
  correctAnswers: number;
  totalAnswers: number;
};

const emptyStore: ProgressStore = {
  courseId: null,
  lessonsDone: {},
  xpByDate: {},
  savedWords: [],
  sessionsPlayed: 0,
  correctAnswers: 0,
  totalAnswers: 0,
};

export function todayKey(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - offsetDays);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadStore(): ProgressStore {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore;
    const parsed = JSON.parse(raw) as Partial<ProgressStore>;
    return { ...emptyStore, ...parsed };
  } catch {
    return emptyStore;
  }
}

type ProgressContextValue = {
  store: ProgressStore;
  selectCourse: (courseId: string) => void;
  completeLesson: (courseId: string, lessonId: string, xp: number, correct: number, total: number) => void;
  toggleWord: (wordKey: string) => void;
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<ProgressStore>(loadStore);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Storage unavailable (private mode etc.) — progress lives in memory only.
    }
  }, [store]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      store,
      selectCourse: (courseId) => setStore((current) => ({ ...current, courseId })),
      completeLesson: (courseId, lessonId, xp, correct, total) =>
        setStore((current) => {
          const done = current.lessonsDone[courseId] ?? [];
          return {
            ...current,
            lessonsDone: { ...current.lessonsDone, [courseId]: done.includes(lessonId) ? done : [...done, lessonId] },
            xpByDate: { ...current.xpByDate, [todayKey()]: (current.xpByDate[todayKey()] ?? 0) + xp },
            sessionsPlayed: current.sessionsPlayed + 1,
            correctAnswers: current.correctAnswers + correct,
            totalAnswers: current.totalAnswers + total,
          };
        }),
      toggleWord: (wordKey) =>
        setStore((current) => ({
          ...current,
          savedWords: current.savedWords.includes(wordKey)
            ? current.savedWords.filter((word) => word !== wordKey)
            : [...current.savedWords, wordKey],
        })),
      resetProgress: () => setStore({ ...emptyStore, courseId: null }),
    }),
    [store],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider");
  return context;
}

export function isLessonDone(store: ProgressStore, courseId: string, lessonId: string): boolean {
  return (store.lessonsDone[courseId] ?? []).includes(lessonId);
}

/** A lesson is unlocked when it is the first lesson or the previous one is complete. */
export function isLessonUnlocked(store: ProgressStore, course: Course, lessonId: string): boolean {
  const ordered = allLessons(course);
  const index = ordered.findIndex((lesson) => lesson.id === lessonId);
  if (index <= 0) return index === 0;
  return isLessonDone(store, course.id, ordered[index - 1].id);
}

export function nextLessonId(store: ProgressStore, course: Course): string | null {
  const ordered = allLessons(course);
  const firstIncomplete = ordered.find((lesson) => !isLessonDone(store, course.id, lesson.id));
  return firstIncomplete?.id ?? null;
}

export function completedCount(store: ProgressStore, course: Course): number {
  const done = store.lessonsDone[course.id] ?? [];
  return allLessons(course).filter((lesson) => done.includes(lesson.id)).length;
}

export function totalXp(store: ProgressStore): number {
  return Object.values(store.xpByDate).reduce((sum, xp) => sum + xp, 0);
}

export function todayXp(store: ProgressStore): number {
  return store.xpByDate[todayKey()] ?? 0;
}

/** Consecutive days with earned XP, counting back from today (or yesterday if today is still empty). */
export function streakDays(store: ProgressStore): number {
  let offset = store.xpByDate[todayKey()] ? 0 : 1;
  let streak = 0;
  while (store.xpByDate[todayKey(offset)]) {
    streak += 1;
    offset += 1;
  }
  return streak;
}
