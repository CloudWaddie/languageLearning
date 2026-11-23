import { FormEvent, ReactNode, useEffect, useState } from "react";
import { ArrowUpRight, Mic, Plus, Sparkles, Volume2 } from "lucide-react";
import type { Course } from "../data/courses";
import { speak } from "../lib/speech";

type Role = "assistant" | "user";
type Message = { id: number; role: Role; content: string; meta?: string; lang?: string };

// Keep conversations alive across in-app navigation (module lives for the session).
const chatCache = new Map<string, Message[]>();

const QUICK_PROMPTS = ["Correct my sentence", "Explain this rule", "Give me a harder challenge"];

function coachGreeting(course: Course): Message[] {
  return [
    {
      id: 1,
      role: "assistant",
      meta: `Luna · your ${course.name} conversation coach`,
      lang: "en-US",
      content: `Hi! I'm Luna, your ${course.name} coach. Imagine a real scene — a café, a market, a train station — and just start talking in ${course.name}. I'll keep the conversation alive, notice your progress and explain little things along the way.`,
    },
    { id: 2, role: "assistant", lang: "en-US", content: "To warm up: introduce yourself and say where you're from. Short answers are perfect." },
  ];
}

function buildDemoReply(input: string, course: Course): string {
  const lower = input.toLowerCase();
  if (lower.includes("correct") || lower.includes("rule") || lower.includes("grammar")) {
    return `The meaning is crystal clear — nicely done! For a more natural rhythm in ${course.name}, try adding a connector word. Short, correct sentences beat long shaky ones. What would you like to say next?`;
  }
  if (lower.includes("harder") || lower.includes("challenge")) {
    return `Let's raise the bar: order something for a friend too, then ask the waiter what they recommend. Two sentences — then we'll polish them together!`;
  }
  return `I love this answer! Keep the same idea, but add a reason — why do you like that choice? It's today's little bridge word. (Live coach replies need an API key on the server; this is the offline demo reply.)`;
}

export function PracticeView({ course }: { course: Course }) {
  const [messages, setMessages] = useState<Message[]>(() => chatCache.get(course.id) ?? coachGreeting(course));
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    chatCache.set(course.id, messages);
  }, [course.id, messages]);

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
          language: course.name,
          level: "A1 · Beginner",
          conversation: [...messages.slice(-8), userMessage].map(({ role, content: text }) => ({ role, content: text })),
        }),
      });
      if (!response.ok) throw new Error("AI route unavailable");
      const data = (await response.json()) as { message?: string };
      if (!data.message) throw new Error("Empty AI response");
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", lang: course.ttsLang, content: data.message! }]);
    } catch {
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", lang: "en-US", content: buildDemoReply(content, course) }]);
    } finally {
      setIsSending(false);
    }
  }

  function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="practice-page">
      <div className="practice-heading">
        <div>
          <div className="eyebrow"><span className="live-dot" /> FREE TALK · {course.name.toUpperCase()}</div>
          <h1>Say it without fear <span>{course.flag}</span></h1>
          <p>Open conversation with Luna. Replies adapt to your {course.name} — mistakes are welcome.</p>
        </div>
      </div>

      <div className="conversation-scroll">
        {messages.map((message) => <MessageBubble key={message.id} message={message} onSpeak={() => speak(message.content, message.lang ?? course.ttsLang)} />)}
        {isSending && <div className="message-row assistant-row"><div className="coach-avatar"><Sparkles size={15} /></div><div className="typing-bubble"><span /><span /><span /></div></div>}
      </div>

      <div className="composer-area">
        <div className="quick-prompts">{QUICK_PROMPTS.map((prompt) => <button key={prompt} onClick={() => void sendMessage(prompt)}>{prompt}</button>)}</div>
        <form className="composer" onSubmit={submitMessage}>
          <button type="button" className="composer-icon" aria-label="Add attachment"><Plus size={19} /></button>
          <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={`Reply in ${course.nativeName}…`} aria-label="Your reply" />
          <button type="button" className="composer-icon mic-button" aria-label="Practice speaking"><Mic size={18} /></button>
          <button type="submit" className="send-button" disabled={!input.trim() || isSending} aria-label="Send message"><ArrowUpRight size={19} /></button>
        </form>
        <p className="composer-note"><Sparkles size={12} /> Luna notices your progress and invents the next game</p>
      </div>
    </div>
  );
}

function MessageBubble({ message, onSpeak }: { message: Message; onSpeak: () => void }) {
  const isAssistant = message.role === "assistant";
  return (
    <div className={`message-row ${isAssistant ? "assistant-row" : "user-row"}`}>
      {isAssistant && <div className="coach-avatar"><Sparkles size={15} /></div>}
      <div className="message-content-wrap">
        {message.meta && <div className="message-meta">{message.meta}</div>}
        <div className={`message-bubble ${isAssistant ? "assistant-bubble" : "user-bubble"}`}>
          {message.content.split("\n").map((line, index) => <p key={`${message.id}-${index}`}>{formatEmphasis(line)}</p>)}
        </div>
        {isAssistant && <button className="speak-button" onClick={onSpeak}><Volume2 size={13} /> Listen</button>}
      </div>
    </div>
  );
}

function formatEmphasis(text: string): ReactNode[] {
  return text.split(/(\*[^*]+\*)/g).map((piece, index) =>
    piece.startsWith("*") && piece.endsWith("*") ? <em key={index}>{piece.slice(1, -1)}</em> : piece,
  );
}
