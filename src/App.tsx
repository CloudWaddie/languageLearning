import { ReactNode, useState } from "react";
import { Brain, Check, ChevronDown, Flame, Map as MapIcon, MessageCircle, Sparkles, Target, Trophy } from "lucide-react";
import { Course, Lesson, courses, getCourse } from "./data/courses";
import { DAILY_GOAL_XP, streakDays, todayXp, useProgress } from "./state/progress";
import { LearnView } from "./views/LearnView";
import { LessonSession } from "./views/LessonSession";
import { PracticeView } from "./views/PracticeView";
import { StatsView } from "./views/StatsView";
import { WordsView } from "./views/WordsView";

type View = "Learn" | "Words" | "Talk" | "Stats";

function App() {
  const { store, selectCourse, completeLesson, toggleWord, resetProgress } = useProgress();
  const [view, setView] = useState<View>("Learn");
  const [activeSession, setActiveSession] = useState<{ course: Course; lesson: Lesson } | null>(null);
  const [showCourseMenu, setShowCourseMenu] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  if (!store.courseId) {
    return <Onboarding onPick={(id) => selectCourse(id)} />;
  }

  const course = getCourse(store.courseId);
  const streak = streakDays(store);
  const xpToday = todayXp(store);

  function startLesson(lesson: Lesson) {
    // Pin the course to the lesson so a remote course switch (storage sync)
    // can't yank the session out from under an active lesson.
    setActiveSession({ course, lesson });
  }

  function recordLesson(xp: number, correct: number, total: number) {
    if (activeSession) completeLesson(activeSession.course.id, activeSession.lesson.id, xp, correct, total);
  }

  function exitLesson() {
    setActiveSession(null);
    setView("Learn");
  }

  function switchCourse(id: string) {
    selectCourse(id);
    setShowCourseMenu(false);
    setView("Learn");
  }

  if (activeSession) {
    return (
      <LessonSession
        key={`${activeSession.course.id}:${activeSession.lesson.id}`}
        course={activeSession.course}
        lesson={activeSession.lesson}
        onExit={exitLesson}
        onFinished={recordLesson}
      />
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Sparkles size={17} strokeWidth={2.5} /></div>
          <span>lingua<span className="brand-dot">.</span></span>
        </div>

        <div className="course-picker-wrap">
          <button className="course-picker" onClick={() => setShowCourseMenu((current) => !current)} aria-expanded={showCourseMenu}>
            <span className="course-flag">{course.flag}</span>
            <span className="course-picker-name"><strong>{course.name}</strong><small>{course.nativeName}</small></span>
            <ChevronDown size={15} />
          </button>
          {showCourseMenu && (
            <div className="language-menu course-menu">
              {courses.map((item) => (
                <button key={item.id} onClick={() => switchCourse(item.id)}>
                  <span>{item.flag}</span>
                  <span><strong>{item.name}</strong><small>{item.nativeName}</small></span>
                  {item.id === course.id && <Check size={15} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          <p className="nav-label">Your space</p>
          <NavItem icon={<MapIcon size={17} />} label="Learn" active={view === "Learn"} onClick={() => setView("Learn")} />
          <NavItem icon={<Brain size={17} />} label="Word garden" active={view === "Words"} onClick={() => setView("Words")} />
          <NavItem icon={<MessageCircle size={17} />} label="Free talk" active={view === "Talk"} onClick={() => setView("Talk")} />
          <NavItem icon={<Trophy size={17} />} label="Progress" active={view === "Stats"} onClick={() => setView("Stats")} />
        </nav>

        <div className="sidebar-bottom">
          <div className="daily-goal-card">
            <div className="goal-topline"><span>Today's goal</span><Target size={16} /></div>
            <strong>{xpToday} <small>/ {DAILY_GOAL_XP} XP</small></strong>
            <div className="goal-bar"><span style={{ width: `${Math.min(100, (xpToday / DAILY_GOAL_XP) * 100)}%` }} /></div>
            <p>{xpToday >= DAILY_GOAL_XP ? "Goal smashed — see you tomorrow!" : `${Math.max(0, DAILY_GOAL_XP - xpToday)} XP to go.`}</p>
          </div>
          <div className="no-login-note">No account needed — progress saves on this device.</div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Space</span><span className="crumb-slash">/</span><strong>{view}</strong></div>
          <div className="topbar-actions">
            <button className="streak-pill"><Flame size={15} fill="currentColor" /> {streak} day streak</button>
            <span className="xp-pill"><Sparkles size={14} /> {Object.values(store.xpByDate).reduce((a, b) => a + b, 0)} XP</span>
          </div>
        </header>

        {view === "Learn" && <LearnView course={course} store={store} onStartLesson={startLesson} />}
        {view === "Words" && <WordsView course={course} store={store} onToggleWord={toggleWord} onStartLesson={() => setView("Learn")} />}
        {view === "Talk" && <PracticeView key={course.id} course={course} />}
        {view === "Stats" && (
          <StatsView
            course={course}
            store={store}
            onReset={() => {
              if (confirmReset) {
                resetProgress();
                setConfirmReset(false);
              } else {
                setConfirmReset(true);
                setTimeout(() => setConfirmReset(false), 4000);
              }
            }}
          />
        )}
        {confirmReset && <div className="reset-toast">Click again to erase all progress on this device.</div>}
      </main>
    </div>
  );
}

function Onboarding({ onPick }: { onPick: (courseId: string) => void }) {
  return (
    <div className="onboarding">
      <div className="onboarding-card">
        <div className="brand-lockup onboarding-brand">
          <div className="brand-mark"><Sparkles size={20} strokeWidth={2.5} /></div>
          <span>lingua<span className="brand-dot">.</span></span>
        </div>
        <h1>Learn a language<br />the fun way.</h1>
        <p className="onboarding-sub">Bite-size lessons, real phrases, hearts and streaks — and <strong>no account</strong>. Your progress lives on this device only.</p>
        <div className="course-grid">
          {courses.map((course) => (
            <button key={course.id} className="course-card" onClick={() => onPick(course.id)}>
              <span className="course-card-flag">{course.flag}</span>
              <strong>{course.name}</strong>
              <small>{course.nativeName}</small>
              <span className="course-card-meta">{course.units.reduce((sum, unit) => sum + unit.lessons.length, 0)} lessons · {course.units.length} units</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
      {active && <span className="nav-active-dot" />}
    </button>
  );
}

export default App;
