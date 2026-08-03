import { useState, useRef, useEffect } from 'react';
import { askGemini } from '../../services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Send, Brain, BarChart2, Users, Sparkles, Copy, Check, Loader2 } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────
export type ChatMode = 'general' | 'analysis' | 'referral' | 'competitor';

interface ChatMsg {
  role: 'bot' | 'user';
  text: string;
  time?: string;
  id: string;
}

interface AIChatProps {
  mode?: ChatMode;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  welcomeMsg?: string;
  quickQuestions?: { label: string; value: string }[];
  onUserMessage?: (msg: string) => Promise<string> | string;
  height?: number | string;
  sticky?: boolean;
  systemPrompt?: string;
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function stripMarkdownForCopy(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)');
}

function getTime(): string {
  return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// ── Component ────────────────────────────────────────────────
export default function AIChat({
  mode = 'general',
  title = 'JhaTech AI Assistant',
  subtitle = 'Online — Ask me anything!',
  placeholder = 'Type your question…',
  welcomeMsg,
  quickQuestions = [],
  onUserMessage,
  height,
  sticky = false,
  systemPrompt,
}: AIChatProps) {
  const defaultWelcome = welcomeMsg ?? (
    mode === 'referral'   ? 'Hi! I am your referral helper.'
    : mode === 'analysis'  ? 'Hi! I am your report helper.'
    : mode === 'competitor'? 'Hi! I am your analysis helper.'
    : 'Hi! I am JhaTech AI.'
  );

  const [msgs, setMsgs]           = useState<ChatMsg[]>([{ role:'bot', text:defaultWelcome, time:getTime(), id:createId() }]);
  const [input, setInput]         = useState('');
  const [typing, setTyping]       = useState(false);
  const [copiedId, setCopiedId]   = useState<string | null>(null);
  const messagesRef               = useRef<HTMLDivElement>(null);
  const bottomRef                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesElement = messagesRef.current;
    const bottomElement = bottomRef.current;
    if (!messagesElement || !bottomElement) return;
    requestAnimationFrame(() => {
      bottomElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, [msgs, typing]);

  const containerStyle = height ? { height } : undefined;

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(stripMarkdownForCopy(text));
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // noop
    }
  };

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput('');
    const userMsg: ChatMsg = { role:'user', text:msg, time:getTime(), id: createId() };
    setMsgs(p => [...p, userMsg]);
    setTyping(true);
    try {
      let reply: string;
      if (onUserMessage) {
        reply = await onUserMessage(msg);
      } else {
        const prompt = `${systemPrompt ?? 'You are a helpful business assistant specialised in: Digital Marketing, SEO, Social Media, Website Development, AI Automation, WhatsApp Marketing, Lead Generation, Pricing, and Referral Programs. Answer conversationally and helpfully. If the user asks unrelated casual things, answer politely but still respond using your knowledge.'}\n\nUser: ${msg}`;
        const g = await askGemini(prompt);
        reply = (g && g.trim()) ? g.trim() : 'Gemini returned an empty response.';
      }
      setTyping(false);
      setMsgs(p => [...p, { role:'bot', text:reply, time:getTime(), id: createId() }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gemini request failed';
      setTyping(false);
      setMsgs(p => [...p, { role:'bot', text:`**Gemini error:** ${message}. Check ` + '`VITE_GEMINI_API_KEY`' + ` in ` + '`frontend/.env`' + ` and restart ` + '`npm run dev`' + `.

    Try again after restarting the dev server.`, time:getTime(), id: createId() }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  const modeIcon = mode === 'analysis' ? <Brain size={16}/> : mode === 'referral' ? <Users size={16}/> : mode === 'competitor' ? <BarChart2 size={16}/> : <Sparkles size={16}/>;

  return (
    <div className={`aic ${sticky ? 'aic--sticky' : ''}`} style={containerStyle}>
      {/* Header */}
      <div className="aic__head">
        <div className="aic__avatar">{modeIcon}</div>
        <div className="aic__head-info">
          <strong>{title}</strong>
          <div className="aic__status"><span className="aic__dot"/>{subtitle}</div>
        </div>
        <div className="aic__mode-badge">{mode === 'analysis' ? 'Pain Analysis' : mode === 'referral' ? 'Referral FAQ' : mode === 'competitor' ? 'Competitor Intel' : 'General'}</div>
      </div>

      {/* Messages */}
      <div className="aic__msgs" ref={messagesRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`aic__msg aic__msg--${m.role}`}>
            {m.role === 'bot' && <div className="aic__msg-av"><Bot size={13}/></div>}
            <div className="aic__msg-wrap">
              <div className="aic__bubble">
                {m.role === 'bot' ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                ) : (
                  <span>{m.text}</span>
                )}
              </div>
              {m.time && <span className="aic__time">{m.time}</span>}
            </div>
            {m.role === 'bot' ? (
              <button className="aic__copy" onClick={() => handleCopy(m.text, m.id)} aria-label="Copy AI message">
                {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />}
              </button>
            ) : (
              <div className="aic__msg-av aic__msg-av--user"><User size={13}/></div>
            )}
          </div>
        ))}
        {typing && (
          <div className="aic__msg aic__msg--bot">
            <div className="aic__msg-av"><Bot size={13}/></div>
            <div className="aic__bubble aic__bubble--typing">
              <Loader2 size={13} className="aic__spinner" />
              <span>Typing</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {quickQuestions.length > 0 && (
        <div className="aic__quick">
          {quickQuestions.map(q => (
            <button key={q.value} className="aic__quick-btn" onClick={() => send(q.label)}>{q.label}</button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="aic__input">
        <textarea
          className="form-textarea aic__textarea"
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className="aic__send" onClick={() => send()} disabled={!input.trim()}>
          <Send size={15}/>
        </button>
      </div>

      <style>{`
        .aic{display:flex;flex-direction:column;background:linear-gradient(180deg,rgba(17,15,36,.98),rgba(12,10,25,.98));border:1px solid var(--dark-border);border-radius:var(--radius-2xl);overflow:hidden;transition:var(--transition);box-shadow:0 18px 50px rgba(0,0,0,.22);height:${typeof height === 'number' ? `${height}px` : height ?? '600px'};max-height:90vh;min-height:420px;min-width:0}
        .aic--sticky{position:sticky;top:6rem}
        .aic__head{display:flex;align-items:center;gap:.9rem;padding:1rem 1.2rem;background:linear-gradient(135deg,rgba(108,60,225,.24),rgba(108,60,225,.08));border-bottom:1px solid var(--dark-border);flex-shrink:0}
        .aic__avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#6C3CE1,#8B5CF6);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 14px rgba(108,60,225,.4)}
        .aic__head-info{flex:1;min-width:0}
        .aic__head-info strong{display:block;font-size:.9rem;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .aic__status{display:flex;align-items:center;gap:.35rem;font-size:.75rem;color:var(--gray-400)}
        .aic__dot{width:6px;height:6px;border-radius:50%;background:#10B981;animation:pulse-glow 2s ease-in-out infinite;flex-shrink:0}
        .aic__mode-badge{font-size:.68rem;font-weight:700;padding:.2rem .6rem;border-radius:var(--radius-full);background:rgba(108,60,225,.18);color:#c4b5fd;border:1px solid rgba(108,60,225,.3);white-space:nowrap;flex-shrink:0}
        .aic__msgs{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:1rem;display:flex;flex-direction:column;justify-content:flex-start;gap:.95rem;scroll-behavior:smooth;overscroll-behavior:contain}
        .aic__msg{display:flex;gap:.6rem;align-items:flex-end}
        .aic__msg--user{flex-direction:row-reverse}
        .aic__msg-av{width:26px;height:26px;border-radius:50%;background:rgba(108,60,225,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#8B5CF6;box-shadow:0 0 0 1px rgba(139,92,246,.15)}
        .aic__msg-av--user{background:rgba(245,158,11,.2);color:#F59E0B}
        .aic__msg-wrap{display:flex;flex-direction:column;gap:.25rem;max-width:84%}
        .aic__msg--user .aic__msg-wrap{align-items:flex-end}
        .aic__bubble{padding:.78rem .95rem;border-radius:16px;font-size:.88rem;line-height:1.65;word-break:break-word;overflow-wrap:anywhere;max-width:100%}
        .aic__msg--bot .aic__bubble{background:rgba(255,255,255,.06);border-bottom-left-radius:6px;color:var(--gray-200);border:1px solid rgba(255,255,255,.06)}
        .aic__msg--user .aic__bubble{background:linear-gradient(135deg,#6C3CE1,#8B5CF6);border-bottom-right-radius:6px;color:white;box-shadow:0 10px 26px rgba(108,60,225,.22)}
        .aic__bubble :is(p,ul,ol,blockquote,pre,table){margin:.35rem 0}
        .aic__bubble :is(ul,ol){padding-left:1.1rem}
        .aic__bubble code{padding:.12rem .35rem;border-radius:6px;background:rgba(255,255,255,.1)}
        .aic__bubble pre{padding:.75rem .85rem;overflow:auto;border-radius:12px;background:rgba(0,0,0,.22)}
        .aic__bubble h1,.aic__bubble h2,.aic__bubble h3,.aic__bubble h4{font-size:1em;margin:.2rem 0 .35rem;font-weight:800}
        .aic__bubble h1{font-size:1.05em}
        .aic__bubble h2{font-size:1em}
        .aic__bubble h3{font-size:.97em}
        .aic__bubble a{text-decoration:underline}
        .aic__bubble--typing{display:flex;align-items:center;gap:.45rem;padding:.6rem .85rem}
        .aic__spinner{animation:spin-slow 1s linear infinite}
        .aic__time{font-size:.65rem;color:var(--gray-600);padding:0 .25rem}
        .aic__copy{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:var(--gray-300);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:var(--transition)}
        .aic__copy:hover{background:rgba(108,60,225,.18);color:#fff;border-color:rgba(139,92,246,.4)}
        .aic__quick{display:flex;flex-wrap:wrap;gap:.4rem;padding:.7rem 1rem;border-top:1px solid var(--dark-border);flex-shrink:0;background:rgba(255,255,255,.01)}
        .aic__quick-btn{padding:.35rem .75rem;border-radius:var(--radius-full);background:rgba(108,60,225,.1);border:1px solid rgba(108,60,225,.22);color:#c4b5fd;font-size:.72rem;font-weight:500;transition:var(--transition);cursor:pointer}
        .aic__quick-btn:hover{background:rgba(108,60,225,.22);border-color:#8B5CF6;transform:translateY(-1px)}
        .aic__input{display:flex;gap:.6rem;padding:.85rem 1rem;border-top:1px solid var(--dark-border);flex-shrink:0;align-items:flex-end;background:rgba(255,255,255,.01)}
        .aic__textarea{flex:1;min-height:46px;max-height:140px;resize:none;padding:.78rem .95rem!important;line-height:1.45;font-size:.92rem}
        .aic__send{width:40px;height:40px;border-radius:var(--radius-md);background:linear-gradient(135deg,#6C3CE1,#8B5CF6);border:none;color:white;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:var(--transition);flex-shrink:0;box-shadow:0 4px 14px rgba(108,60,225,.35)}
        .aic__send:hover:not(:disabled){transform:translateY(-1px) scale(1.04);box-shadow:0 8px 18px rgba(108,60,225,.45)}
        .aic__send:disabled{opacity:.4;cursor:not-allowed}
        @media(max-width:640px){
          .aic{height:min(76vh,560px);min-height:380px}
          .aic__head{padding:.9rem 1rem}
          .aic__mode-badge{display:none}
          .aic__msgs{padding:.85rem}
          .aic__msg-wrap{max-width:88%}
          .aic__bubble{font-size:.86rem}
          .aic__input{padding:.75rem .85rem}
        }
        .aic__msgs::-webkit-scrollbar{width:3px}
        .aic__msgs::-webkit-scrollbar-thumb{background:rgba(108,60,225,.3);border-radius:2px}
      `}</style>
    </div>
  );
}
