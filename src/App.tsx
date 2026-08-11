import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Award,
  BookOpen,
  Brain,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  CircleCheck,
  Clock3,
  Flame,
  Globe2,
  Headphones,
  Lightbulb,
  MessageCircle,
  Mic,
  MoreHorizontal,
  PanelLeftClose,
  Play,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  Target,
  Trophy,
  Volume2,
  X,
  Zap,
} from "lucide-react";

type Role = "assistant" | "user";
type Message = { id: number; role: Role; content: string; meta?: string };

type Language = {
  name: string;
  native: string;
  flag: string;
  tone: string;
};

const languages: Language[] = [
  { name: "Italian", native: "Italiano", flag: "🇮🇹", tone: "sunset" },
];

const starterMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    meta: "Luna · la tua coach di conversazione",
    content:
      "Ciao, Maya! Facciamo pratica con una scena vera. Immagina di scegliere un tavolo in un piccolo bar di Roma. Io terrò viva la conversazione e noterò i tuoi progressi lungo il percorso ✨",
  },
  {
    id: 2,
    role: "assistant",
    content: "Cosa ti va di ordinare da bere? Rispondi senza pensarci troppo — anche poche parole vanno benissimo.",
  },
  {
    id: 3,
    role: "user",
    content: "Ciao! Vorrei un cappuccino e un cornetto, per favore.",
  },
  {
    id: 4,
    role: "assistant",
    meta: "Ottimo istinto · piccolo upgrade",
    content:
      "Capito perfettamente ☕ Piccola chicca: in Italia diciamo spesso *cornetto* invece di “croissant”. La tua frase è già molto naturale — ora aggiungiamo un motivo.\n\nPerché ti piace il cappuccino?",
  },
];

const quickPrompts = [
  "Correggi la mia frase",
  "Spiegami questa regola",
  "Dammi una sfida più difficile",
];

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("Italian");
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [activeView, setActiveView] = useState("Pratica");
  const [showHint, setShowHint] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [savedWords, setSavedWords] = useState(["perché", "anche se", "chiacchiere"]);
  const [completedLessons, setCompletedLessons] = useState(["cafe"]);

  const activeLanguage = useMemo(
    () => languages.find((language) => language.name === selectedLanguage) ?? languages[0],
    [selectedLanguage],
  );

  async function sendMessage(rawMessage: string) {
    const content = rawMessage.trim();
    if (!content || isSending) return;

    const userMessage: Message = { id: Date.now(), role: "user", content };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          language: selectedLanguage,
          level: "A2 · Elementary",
          conversation: [...messages.slice(-8), userMessage].map(({ role, content: text }) => ({ role, content: text })),
        }),
      });

      if (!response.ok) throw new Error("AI route unavailable");
      const data = (await response.json()) as { message?: string };
      if (!data.message) throw new Error("Empty AI response");
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "assistant", content: data.message ?? "Let’s keep going." },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "assistant", content: buildDemoReply(content, selectedLanguage) },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function toggleWord(word: string) {
    setSavedWords((current) => current.includes(word) ? current.filter((item) => item !== word) : [...current, word]);
  }

  function completeLesson(id: string) {
    setCompletedLessons((current) => current.includes(id) ? current : [...current, id]);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Sparkles size={17} strokeWidth={2.5} /></div>
          <span>lingua<span className="brand-dot">.</span></span>
        </div>

        <div className="profile-card">
          <div className="avatar avatar-maya">MC</div>
          <div className="profile-copy"><strong>Maya Chen</strong><span>7 giorni di fila <Flame size={12} fill="currentColor" /></span></div>
          <MoreHorizontal size={17} className="muted-icon" />
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          <p className="nav-label">Il tuo spazio</p>
          <NavItem icon={<MessageCircle size={17} />} label="Pratica" active={activeView === "Pratica"} onClick={() => setActiveView("Pratica")} />
          <NavItem icon={<BookOpen size={17} />} label="Percorso" active={activeView === "Percorso"} onClick={() => setActiveView("Percorso")} />
          <NavItem icon={<Brain size={17} />} label="Giardino" active={activeView === "Giardino"} onClick={() => setActiveView("Giardino")} />
          <NavItem icon={<Trophy size={17} />} label="Progressi" active={activeView === "Progressi"} onClick={() => setActiveView("Progressi")} />
        </nav>

        <div className="sidebar-bottom">
          <div className="daily-goal-card">
            <div className="goal-topline"><span>Obiettivo di oggi</span><Target size={16} /></div>
            <strong>12 <small>/ 15 min</small></strong>
            <div className="goal-bar"><span /></div>
            <p>Ancora tre minuti per non spezzare la striscia!</p>
          </div>
          <button className="sidebar-link"><CircleHelp size={16} /> Centro aiuto</button>
          <button className="sidebar-link"><PanelLeftClose size={16} /> Riduci menu</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb"><span>Spazio</span><span className="crumb-slash">/</span><strong>{activeView}</strong></div>
          <div className="topbar-actions">
            <button className="streak-pill"><Flame size={15} fill="currentColor" /> 7 giorni di fila</button>
            <div className="notification-wrap">
              <button className="icon-button" aria-label="Notifications" onClick={() => setShowNotifications((current) => !current)}><Zap size={17} /><span className="notification-dot" /></button>
              {showNotifications && <div className="notification-popover"><div><strong>Che slancio, Maya!</strong><span>Ti mancano solo 3 minuti all’obiettivo.</span></div><button onClick={() => setShowNotifications(false)}>×</button></div>}
            </div>
            <div className="avatar avatar-small">MC</div>
          </div>
        </header>

        {activeView === "Pratica" ? <div className="workspace-grid">
          <section className="conversation-column">
            <div className="practice-heading">
              <div>
                <div className="eyebrow"><span className="live-dot" /> PRATICA LIVE · SESSIONE 04 <span className="playful-badge">andiamo!</span></div>
                <h1>Un caffè, per favore <span>☕</span></h1>
                <p>Parla senza paura. Io mi adatto a te, passo dopo passo.</p>
              </div>
              <div className="heading-actions">
                <div className="language-picker-wrap">
                  <button className="language-picker" onClick={() => setShowLanguageMenu((current) => !current)} aria-expanded={showLanguageMenu}>
                    <span>{activeLanguage.flag}</span> {activeLanguage.name} <ChevronDown size={14} />
                  </button>
                  {showLanguageMenu && <div className="language-menu">
                    {languages.map((language) => <button key={language.name} onClick={() => { setSelectedLanguage(language.name); setShowLanguageMenu(false); }}><span>{language.flag}</span><span><strong>{language.name}</strong><small>{language.native}</small></span>{language.name === selectedLanguage && <Check size={15} />}</button>)}
                  </div>}
                </div>
                <button className="more-button" aria-label="More session options"><MoreHorizontal size={19} /></button>
              </div>
            </div>

            <div className="conversation-scroll">
              {messages.map((message) => <MessageBubble key={message.id} message={message} onSpeak={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(message.content))} />)}
              {isSending && <div className="message-row assistant-row"><div className="coach-avatar"><Sparkles size={15} /></div><div className="typing-bubble"><span /><span /><span /></div></div>}
            </div>

            <div className="composer-area">
              <div className="quick-prompts">{quickPrompts.map((prompt) => <button key={prompt} onClick={() => void sendMessage(prompt)}>{prompt}</button>)}</div>
              <form className="composer" onSubmit={submitMessage}>
                <button type="button" className="composer-icon" aria-label="Add attachment"><Plus size={19} /></button>
                <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={`Rispondi in ${activeLanguage.native}...`} aria-label="Your reply" />
                <button type="button" className="composer-icon mic-button" aria-label="Practice speaking"><Mic size={18} /></button>
                <button type="submit" className="send-button" disabled={!input.trim() || isSending} aria-label="Send message"><ArrowUpRight size={19} /></button>
              </form>
              <p className="composer-note"><Sparkles size={12} /> Luna noterà i tuoi progressi e inventerà il prossimo gioco</p>
            </div>
          </section>

          <aside className="insight-column">
            <div className="session-progress panel">
              <div className="panel-title-row"><div><span className="overline">PROGRESSI DELLA SESSIONE</span><h2>Stai prendendo il volo</h2></div><span className="progress-percent">68%</span></div>
              <div className="progress-track"><span /></div>
              <div className="progress-meta"><span><Check size={13} /> Warm-up complete</span><span>2 of 3</span></div>
            </div>

            <div className="insight-card panel">
              <div className="insight-heading"><div className="insight-icon"><Lightbulb size={17} /></div><div><span className="overline">UNA COSA CHE HO NOTATO</span><h2>Piccole parole, grande magia</h2></div></div>
              <p>Sei pronta a collegare le idee con <em>perché</em> (because). Una piccola parola può rendere la conversazione molto più naturale.</p>
              <div className="example-box"><span>Prova così</span><strong>Mi piace perché è delicato.</strong><small>I like it because it’s smooth.</small></div>
              <button className="text-button" onClick={() => setShowHint((current) => !current)}>{showHint ? "Nascondi il suggerimento" : "Fammi vedere un esempio"} <ArrowUpRight size={15} /></button>
              {showHint && <div className="hint-copy">Pensa a <strong>perché</strong> come a un ponte tra ciò che ti piace e il motivo per cui ti piace.</div>}
            </div>

            <div className="focus-panel panel">
              <div className="panel-title-row"><div><span className="overline">FOCUS DI OGGI</span><h2>Parole-ponte utilissime</h2></div><button className="tiny-icon" aria-label="More focus options"><MoreHorizontal size={17} /></button></div>
              <div className="focus-list"><FocusItem label="perché" meaning="because" done /><FocusItem label="però" meaning="but" done /><FocusItem label="anche se" meaning="although" /></div>
              <div className="focus-footer"><span><Brain size={14} /> 4 parole sbloccate</span><button onClick={() => setActiveView("Giardino")}>Apri il giardino <ArrowUpRight size={13} /></button></div>
            </div>

            <div className="audio-card panel"><div className="audio-art"><Headphones size={19} /></div><div><strong>Ascolta e nota</strong><span>30 sec · frasi da bar</span></div><button aria-label="Play listening exercise"><Volume2 size={17} /></button></div>
          </aside>
        </div> : <ProductView view={activeView} onNavigate={setActiveView} savedWords={savedWords} onToggleWord={toggleWord} completedLessons={completedLessons} onCompleteLesson={completeLesson} />}
      </main>
    </div>
  );
}

type ProductViewProps = {
  view: string;
  onNavigate: (view: string) => void;
  savedWords: string[];
  onToggleWord: (word: string) => void;
  completedLessons: string[];
  onCompleteLesson: (id: string) => void;
};

function ProductView({ view, onNavigate, savedWords, onToggleWord, completedLessons, onCompleteLesson }: ProductViewProps) {
  if (view === "Percorso") {
    return <LessonMap onNavigate={onNavigate} completedLessons={completedLessons} onCompleteLesson={onCompleteLesson} />;
  }
  if (view === "Giardino") {
    return <WordGarden savedWords={savedWords} onToggleWord={onToggleWord} />;
  }
  return <ProgressView onNavigate={onNavigate} />;
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-intro"><div><div className="eyebrow"><span className="live-dot" /> {eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function LessonMap({ onNavigate, completedLessons, onCompleteLesson }: { onNavigate: (view: string) => void; completedLessons: string[]; onCompleteLesson: (id: string) => void }) {
  const lessons = [
    { id: "greetings", number: "01", title: "Facciamo conoscenza", description: "Saluti, presentazioni e il coraggio di rompere il ghiaccio.", time: "8 min", status: "Complete", color: "sage" },
    { id: "cafe", number: "02", title: "Un caffè, per favore", description: "Ordina quello che vuoi e tieni viva la conversazione.", time: "12 min", status: "In corso", color: "peach" },
    { id: "directions", number: "03", title: "Trova la strada", description: "Chiedi indicazioni e fatti aiutare da una persona del posto.", time: "10 min", status: "In arrivo", color: "sky" },
    { id: "stories", number: "04", title: "Racconta una storia", description: "Collega le idee con dettagli, ritmo e un pizzico di personalità.", time: "15 min", status: "Locked", color: "lavender" },
  ];
  return <div className="product-page">
    <PageIntro eyebrow="IL TUO PERCORSO" title="Un passo alla volta" description="Il tuo percorso si adatta alle situazioni che vuoi vivere in italiano." action={<button className="primary-action" onClick={() => onNavigate("Pratica")}><Play size={15} fill="currentColor" /> Continua a giocare</button>} />
    <div className="path-hero panel"><div className="path-hero-copy"><span className="overline">ITALIANO · SICUREZZA QUOTIDIANA</span><h2>Da “ciao” a “mi sento a casa”.</h2><p>Sei scene brevi e utili per iniziare a parlare prima di sentirti pronta.</p><div className="path-stats"><span><strong>42%</strong> percorso completato</span><span><Clock3 size={14} /> 2h 18m di pratica</span></div></div><div className="path-orbit"><div className="orbit-ring"><span className="orbit-dot" /><span className="orbit-dot second" /><div><Globe2 size={26} /><small>02</small></div></div></div></div>
    <div className="section-heading"><div><span className="overline">LE TUE SCENE</span><h2>Impara vivendo</h2></div><button className="subtle-action"><CalendarDays size={15} /> Questa settimana <ChevronDown size={14} /></button></div>
    <div className="lesson-list">{lessons.map((lesson) => { const complete = completedLessons.includes(lesson.id) || lesson.status === "Complete"; const locked = lesson.status === "Locked"; return <div className={`lesson-card panel ${locked ? "locked" : ""}`} key={lesson.id}><div className={`lesson-number ${lesson.color}`}>{complete ? <Check size={17} /> : lesson.number}</div><div className="lesson-copy"><div className="lesson-status"><span className={complete ? "status-complete" : locked ? "status-locked" : "status-current"}>{complete ? "Completata" : locked ? "Da sbloccare" : lesson.status}</span><span>·</span><span>{lesson.time}</span></div><h3>{lesson.title}</h3><p>{lesson.description}</p></div><button className={`lesson-action ${complete ? "done" : ""}`} disabled={locked} onClick={() => { if (!complete) { onCompleteLesson(lesson.id); onNavigate("Pratica"); } }}>{complete ? <CircleCheck size={18} /> : locked ? <span className="lock-dot" /> : <ChevronRight size={19} />}</button></div>; })}</div>
  </div>;
}

function WordGarden({ savedWords, onToggleWord }: { savedWords: string[]; onToggleWord: (word: string) => void }) {
  const [search, setSearch] = useState("");
  const [quizChoice, setQuizChoice] = useState("");
  const wordCards = [{ word: "perché", translation: "because", example: "Mi piace perché è delicato.", tag: "Parola-ponte", tone: "yellow" }, { word: "anche se", translation: "although", example: "Anche se piove, esco lo stesso.", tag: "Parola-ponte", tone: "mint" }, { word: "chiacchiere", translation: "after-meal conversation", example: "Dopo cena facciamo due chiacchiere.", tag: "Cultura", tone: "peach" }, { word: "cornetto", translation: "croissant", example: "Un cornetto, per favore.", tag: "Bar", tone: "blue" }];
  const visibleWords = wordCards.filter((card) => `${card.word} ${card.translation}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="product-page">
    <PageIntro eyebrow="IL TUO GIARDINO DELLE PAROLE" title="Parole che restano" description="Ogni parola utile che incontri entra nella tua personale collezione italiana." action={<div className="garden-count"><Sparkles size={15} /> {savedWords.length} parole salvate</div>} />
    <div className="garden-feature panel"><div className="garden-feature-icon"><Brain size={25} /></div><div><span className="overline">PRONTA PER UN RIPASSINO?</span><h2>Facciamo brillare le parole di oggi.</h2><p>Un gioco di due minuti ti aspetta quando vuoi.</p></div><button className="primary-action"><RotateCcw size={15} /> Inizia il gioco</button></div>
    <div className="section-heading"><div><span className="overline">APPENA NOTATE</span><h2>La tua collezione cresce</h2></div><label className="search-field"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cerca una parola" /></label></div>
    <div className="word-grid">{visibleWords.map((card) => <div className="word-card panel" key={card.word}><div className={`word-card-top ${card.tone}`}><span>{card.tag}</span><button onClick={() => onToggleWord(card.word)} aria-label={`${savedWords.includes(card.word) ? "Remove" : "Save"} ${card.word}`}>{savedWords.includes(card.word) ? <Star size={16} fill="currentColor" /> : <Star size={16} />}</button></div><div className="word-card-body"><h3>{card.word}</h3><p>{card.translation}</p><div className="word-example"><span>“</span>{card.example}</div><button className="listen-link" onClick={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance(card.word))}><Volume2 size={13} /> Listen to pronunciation</button></div></div>)}</div>
    <div className="recall-card panel"><div><span className="overline">QUICK RECALL</span><h2>Quale parola significa “although”?</h2><p>Fidati del tuo primo istinto — puoi sempre riprovare.</p></div><div className="quiz-options">{["però", "anche se", "perché"].map((option) => <button key={option} className={quizChoice === option ? option === "anche se" ? "correct" : "incorrect" : ""} onClick={() => setQuizChoice(option)}>{option}{quizChoice === option && (option === "anche se" ? <Check size={14} /> : <X size={14} />)}</button>)}</div>{quizChoice === "anche se" && <span className="quiz-feedback"><Check size={14} /> Esatto. Questa è pronta per una conversazione vera!</span>}</div>
  </div>;
}

function ProgressView({ onNavigate }: { onNavigate: (view: string) => void }) {
  const days = [{ label: "M", height: 38 }, { label: "T", height: 55 }, { label: "W", height: 44 }, { label: "T", height: 72 }, { label: "F", height: 61 }, { label: "S", height: 88 }, { label: "S", height: 66 }];
  return <div className="product-page">
    <PageIntro eyebrow="I TUOI PROGRESSI" title="Stai creando una super-abitudine" description="La costanza è il tuo superpotere. Ecco cosa sta costruendo la tua pratica." action={<button className="subtle-action"><CalendarDays size={15} /> Ultimi 7 giorni <ChevronDown size={14} /></button>} />
    <div className="stats-grid"><div className="stat-card panel"><span className="stat-icon green"><Flame size={17} /></span><strong>7</strong><span>giorni di fila</span><small>Record: 14 giorni</small></div><div className="stat-card panel"><span className="stat-icon peach"><Clock3 size={17} /></span><strong>2h 18m</strong><span>pratica totale</span><small>+24m questa settimana</small></div><div className="stat-card panel"><span className="stat-icon yellow"><Award size={17} /></span><strong>284</strong><span>parole sbloccate</span><small>+18 questa settimana</small></div><div className="stat-card panel"><span className="stat-icon blue"><Target size={17} /></span><strong>82%</strong><span>sicurezza in sessione</span><small>+6% questo mese</small></div></div>
    <div className="progress-layout"><div className="activity-card panel"><div className="section-heading"><div><span className="overline">ATTIVITÀ DI PRATICA</span><h2>Il tuo ritmo sta crescendo</h2></div><span className="chart-total">48 min</span></div><div className="chart"><div className="chart-y"><span>15m</span><span>10m</span><span>5m</span><span>0</span></div><div className="chart-bars">{days.map((day, index) => <div className="bar-column" key={`${day.label}-${index}`}><div className="bar-track"><span style={{ height: `${day.height}%` }} /></div><small>{day.label}</small></div>)}</div></div></div><div className="confidence-card panel"><span className="overline">QUANDO SCATTA LA MAGIA</span><h2>La tua sicurezza sboccia</h2><p>Rispondi più velocemente nelle scene quotidiane, soprattutto quando fai una domanda di seguito.</p><div className="confidence-meter"><span /><strong>82</strong><small>/ 100</small></div><button className="text-button" onClick={() => onNavigate("Pratica")}>Allena questa abilità <ArrowUpRight size={15} /></button></div></div>
    <div className="milestone-banner"><div className="milestone-badge"><Trophy size={20} /></div><div><span className="overline">PROSSIMO TRAGUARDO</span><h2>10 conversazioni · ancora 2</h2><p>Completa altre due sessioni per sbloccare “Primi passi coraggiosi”.</p></div><div className="milestone-progress"><span /></div></div>
  </div>;
}

function NavItem({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return <button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>{icon}<span>{label}</span>{active && <span className="nav-active-dot" />}</button>;
}

function MessageBubble({ message, onSpeak }: { message: Message; onSpeak: () => void }) {
  const isAssistant = message.role === "assistant";
  return <div className={`message-row ${isAssistant ? "assistant-row" : "user-row"}`}>
    {isAssistant && <div className="coach-avatar"><Sparkles size={15} /></div>}
    <div className="message-content-wrap">
      {message.meta && <div className="message-meta">{message.meta}</div>}
      <div className={`message-bubble ${isAssistant ? "assistant-bubble" : "user-bubble"}`}>
        {message.content.split("\n").map((line, index) => <p key={`${message.id}-${index}`}>{formatEmphasis(line)}</p>)}
      </div>
      {isAssistant && <button className="speak-button" onClick={onSpeak}><Volume2 size={13} /> Ascolta</button>}
    </div>
  </div>;
}

function FocusItem({ label, meaning, done = false }: { label: string; meaning: string; done?: boolean }) {
  return <div className="focus-item"><span className={`focus-check ${done ? "done" : ""}`}>{done ? <Check size={12} /> : <span />}</span><strong>{label}</strong><span>{meaning}</span></div>;
}

function formatEmphasis(text: string) {
  const pieces = text.split(/(\*[^*]+\*)/g);
  return pieces.map((piece, index) => piece.startsWith("*") && piece.endsWith("*") ? <em key={index}>{piece.slice(1, -1)}</em> : piece);
}

function buildDemoReply(input: string, language: string) {
  const lower = input.toLowerCase();
  if (lower.includes("correggi") || lower.includes("regola") || lower.includes("correct") || lower.includes("grammar")) {
    return `Il significato è chiarissimo — bravissima! Per un ritmo più naturale in ${language}, prova ad aggiungere una parola-ponte: “Mi piace il cappuccino perché è delicato.” Nota come *perché* dà più forma alla tua idea.`;
  }
  if (lower.includes("difficile") || lower.includes("sfida") || lower.includes("harder") || lower.includes("challenge")) {
    return "Alziamo un po’ il livello: ordina qualcosa per un’amica con un’allergia e poi chiedi al barista cosa consiglia. Usa due frasi — dopo le rendiamo ancora più naturali insieme!";
  }
  return "Adoro questa risposta! Tieni la stessa idea, ma aggiungi un motivo con *perché*. È il piccolo ponte di oggi — perché ti piace proprio quella scelta?";
}

export default App;
