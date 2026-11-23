import { Award, Clock3, Flame, Target, Trash2 } from "lucide-react";
import type { Course } from "../data/courses";
import { allLessons } from "../data/courses";
import { ProgressStore, completedCount, isLessonDone, streakDays, todayKey, totalXp } from "../state/progress";

const DAY_LABELS = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

export function StatsView({ course, store, onReset }: { course: Course; store: ProgressStore; onReset: () => void }) {
  const total = totalXp(store);
  const streak = streakDays(store);
  const lessonsDone = completedCount(store, course);
  const lessonsTotal = allLessons(course).length;
  const wordsLearned = allLessons(course).filter((lesson) => isLessonDone(store, course.id, lesson.id)).flatMap((lesson) => lesson.words).length;
  const accuracy = store.totalAnswers ? Math.round((store.correctAnswers / store.totalAnswers) * 100) : 0;

  const days = Array.from({ length: 7 }).map((_, index) => {
    const key = todayKey(6 - index);
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return { label: DAY_LABELS[date.getDay()], xp: store.xpByDate[key] ?? 0 };
  });
  const maxXp = Math.max(10, ...days.map((day) => day.xp));

  return (
    <div className="product-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow"><span className="live-dot" /> YOUR PROGRESS</div>
          <h1>Building a super-habit</h1>
          <p>Everything is saved on this device — no account, no sign-in, just your streak.</p>
        </div>
        <button className="subtle-action danger" onClick={onReset}><Trash2 size={14} /> Reset progress</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card panel"><span className="stat-icon peach"><Flame size={17} /></span><strong>{streak}</strong><span>day streak</span><small>{streak > 0 ? "Keep it burning" : "Finish a lesson today"}</small></div>
        <div className="stat-card panel"><span className="stat-icon green"><Award size={17} /></span><strong>{total}</strong><span>total XP</span><small>across every course</small></div>
        <div className="stat-card panel"><span className="stat-icon blue"><Clock3 size={17} /></span><strong>{lessonsDone}/{lessonsTotal}</strong><span>{course.name} lessons</span><small>{wordsLearned} words unlocked</small></div>
        <div className="stat-card panel"><span className="stat-icon yellow"><Target size={17} /></span><strong>{accuracy}%</strong><span>first-try accuracy</span><small>{store.sessionsPlayed} sessions played</small></div>
      </div>

      <div className="progress-layout">
        <div className="activity-card panel">
          <div className="section-heading"><div><span className="overline">PRACTICE ACTIVITY</span><h2>Last 7 days</h2></div><span className="chart-total">{days.reduce((sum, day) => sum + day.xp, 0)} XP</span></div>
          <div className="chart">
            <div className="chart-y"><span>{maxXp}</span><span>{Math.round(maxXp / 2)}</span><span>0</span></div>
            <div className="chart-bars">
              {days.map((day, index) => (
                <div className="bar-column" key={index}>
                  <div className="bar-track"><span style={{ height: `${day.xp ? Math.max(6, (day.xp / maxXp) * 100) : 0}%` }} /></div>
                  <small>{day.label}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="confidence-card panel">
          <span className="overline">COURSE COMPLETION</span>
          <h2>{course.nativeName}</h2>
          <p>{lessonsDone === lessonsTotal ? "Course complete! Replay lessons or start another language." : `${lessonsTotal - lessonsDone} lessons left on this path.`}</p>
          <div className="confidence-meter"><span style={{ width: `${(lessonsDone / lessonsTotal) * 100}%` }} /><strong>{Math.round((lessonsDone / lessonsTotal) * 100)}</strong><small>/ 100</small></div>
        </div>
      </div>
    </div>
  );
}
