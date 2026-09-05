import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, ReactNode } from "react";
import { ArrowUpRight, LoaderCircle, Mail, Send, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTranslation } from "react-i18next";

type EmailAction = {
  type: "email";
  email: string;
  subject: string;
  body: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  action?: EmailAction;
};

const SUGGESTION_KEYS = ["chat.suggestion1", "chat.suggestion2", "chat.suggestion3"];

function renderInlineMarkdown(text: string): ReactNode[] {
  const tokenPattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/|mailto:)[^)]+\)|https?:\/\/[^\s]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,})/g;

  return text.split(tokenPattern).filter(Boolean).map((token, index) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }

    const markdownLink = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (markdownLink) {
      return <a key={index} href={markdownLink[2]} target="_blank" rel="noreferrer">{markdownLink[1]}</a>;
    }

    if (/^https?:\/\//.test(token)) {
      const trailingPunctuation = token.match(/[.,!?;:]$/)?.[0] ?? "";
      const href = trailingPunctuation ? token.slice(0, -1) : token;
      return <span key={index}><a href={href} target="_blank" rel="noreferrer">{href}</a>{trailingPunctuation}</span>;
    }

    if (/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(token)) {
      return <a key={index} href={`mailto:${token}`}>{token}</a>;
    }

    return token;
  });
}

function RichMessage({ content }: { content: string }) {
  const blocks: ReactNode[] = [];
  const lines = content.split(/\r?\n/);
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ").trim();
    if (text) blocks.push(<p key={`p-${blocks.length}`}>{renderInlineMarkdown(text)}</p>);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`list-${blocks.length}`}>
        {list.map((item, index) => <li key={index}>{renderInlineMarkdown(item)}</li>)}
      </ul>,
    );
    list = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    const listItem = trimmed.match(/^[-*]\s+(.+)$/);
    const heading = trimmed.match(/^#{1,3}\s+(.+)$/);

    if (!trimmed) {
      flushParagraph();
      flushList();
    } else if (listItem) {
      flushParagraph();
      list.push(listItem[1]);
    } else if (heading) {
      flushParagraph();
      flushList();
      blocks.push(<h3 key={`h-${blocks.length}`}>{renderInlineMarkdown(heading[1])}</h3>);
    } else {
      flushList();
      paragraph.push(trimmed);
    }
  });

  flushParagraph();
  flushList();
  return <div className="portfolio-chat-rich-text">{blocks}</div>;
}

export function ChatAssistant() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: t("chat.welcome") },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [waitingForServer, setWaitingForServer] = useState(false);
  const [mode, setMode] = useState<"demo" | "live" | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    setMessages((current) => current.map((message) =>
      message.id === "welcome" ? { ...message, content: t("chat.welcome") } : message
    ));
  }, [i18n.resolvedLanguage, t]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, sending, reduceMotion]);

  useEffect(() => {
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const sendMessage = async (rawMessage: string) => {
    const content = rawMessage.trim();
    if (!content || sending) return;

    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    const controller = new AbortController();
    const wakeNotice = window.setTimeout(() => setWaitingForServer(true), 8000);
    const timeout = window.setTimeout(() => controller.abort(), 120000);
    try {
      const base = (import.meta.env.VITE_CHAT_API_URL || "").replace(/\/$/, "");
      const response = await fetch(`${base}/api/chat`, {
        signal: controller.signal,
        credentials: "omit",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale: (i18n.resolvedLanguage ?? "en").split("-")[0],
          messages: nextMessages
            .filter((message) => message.id !== "welcome")
            .slice(-8)
            .map(({ role, content: messageContent }) => ({ role, content: messageContent })),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || typeof data?.message !== "string") {
        throw new Error(data?.error ?? "The assistant could not respond.");
      }
      setMode(data.mode === "live" ? "live" : "demo");
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message,
          action: data.action?.type === "email" ? data.action : undefined,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: error instanceof Error ? `${error.message} ${t("chat.fallback")}` : t("chat.fallback"),
        },
      ]);
    } finally {
      window.clearTimeout(wakeNotice);
      window.clearTimeout(timeout);
      setWaitingForServer(false);
      setSending(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <div className="portfolio-chat">
      <AnimatePresence>
        {open && (
          <motion.section
            id="portfolio-chat-dialog"
            role="dialog"
            aria-modal="false"
            aria-labelledby="portfolio-chat-title"
            initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="portfolio-chat-panel"
          >
            <header className="portfolio-chat-header">
              <span className="portfolio-chat-avatar">
                <img src="/chat/rim-avatar.webp" alt="" width="40" height="40" aria-hidden="true" />
              </span>
              <div>
                <div className="portfolio-chat-title-row">
                  <h2 id="portfolio-chat-title">Rim</h2>
                  <span className="portfolio-chat-online">{t("chat.online")}</span>
                </div>
                <p>{t("chat.subtitle")}</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label={t("chat.close")}>
                <X size={17} aria-hidden="true" />
              </button>
            </header>

            <div className="portfolio-chat-messages" ref={listRef} aria-live="polite" aria-busy={sending}>
              {messages.map((message) => (
                <div key={message.id} className={`portfolio-chat-message is-${message.role}`}>
                  {message.role === "assistant" && (
                    <img className="portfolio-chat-message-avatar" src="/chat/rim-avatar.webp" alt="" width="26" height="26" aria-hidden="true" />
                  )}
                  <div className="portfolio-chat-message-content">
                    {message.role === "assistant"
                      ? <RichMessage content={message.content} />
                      : <p>{message.content}</p>}
                    {message.action?.type === "email" && (
                      <div className="portfolio-chat-handoff">
                        <span className="portfolio-chat-handoff-icon"><Mail size={16} aria-hidden="true" /></span>
                        <div>
                          <span>{t("chat.ready")}</span>
                          <strong>{t("chat.continue")}</strong>
                          <small>{t("chat.emailHelp")}</small>
                        </div>
                        <a
                          href={`mailto:${message.action.email}?subject=${encodeURIComponent(message.action.subject)}&body=${encodeURIComponent(message.action.body)}`}
                          aria-label={`Open email to ${message.action.email}`}
                        >
                          {t("chat.openEmail")} <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {messages.length === 1 && (
                <div className="portfolio-chat-suggestions" aria-label="Suggested questions">
                  {SUGGESTION_KEYS.map((suggestionKey) => (
                    <button key={suggestionKey} type="button" onClick={() => void sendMessage(t(suggestionKey))}>
                      {t(suggestionKey)}
                    </button>
                  ))}
                </div>
              )}
              {sending && (
                <div className="portfolio-chat-message is-assistant is-loading">
                  <LoaderCircle size={14} aria-hidden="true" />
                  <p>{waitingForServer ? t("chat.waking") : t("chat.loading")}</p>
                </div>
              )}
            </div>

            <form className="portfolio-chat-form" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="portfolio-chat-input">{t("chat.inputLabel")}</label>
              <textarea
                id="portfolio-chat-input"
                ref={inputRef}
                rows={1}
                maxLength={1_000}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={t("chat.placeholder")}
                disabled={sending}
              />
              <button type="submit" disabled={sending || input.trim().length === 0} aria-label={t("chat.send")}>
                <Send size={15} aria-hidden="true" />
              </button>
            </form>
            <p className="portfolio-chat-note">
              {mode === "demo" ? t("chat.demoNote") : t("chat.liveNote")}
            </p>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="portfolio-chat-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="portfolio-chat-dialog"
        aria-label={open ? t("chat.close") : t("chat.trigger")}
        whileHover={reduceMotion ? undefined : { y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      >
        {open
          ? <X size={19} aria-hidden="true" />
          : <img className="portfolio-chat-trigger-avatar" src="/chat/rim-avatar.webp" alt="" width="28" height="28" aria-hidden="true" />}
        <span>{open ? t("chat.close") : t("chat.trigger")}</span>
      </motion.button>
    </div>
  );
}
