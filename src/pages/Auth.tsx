import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useLocale, Locale, getTranslations } from "@/lib/i18n";
import { Sparkles, Brain, Timer, Zap, CheckCircle2, Crown, Globe, Plus, Shuffle, Trash2, Pencil, Check, Mail, ShieldCheck, ArrowRight, LayoutGrid, History, Smartphone, MailCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { GridSize, getRandomTasks, createEmptyGrid, checkBingoLines, BingoCell } from "@/lib/bingo-utils";
import { playTapSound, playUntapSound, playBingoSound } from "@/lib/sounds";
import confetti from "canvas-confetti";

const localeLabels: Record<Locale, string> = { zh: "中", en: "EN", es: "ES" };
const localeOrder: Locale[] = ["zh", "en", "es"];
const painIcons = [Brain, Timer, Zap];

const cellColors = [
  "bg-primary", "bg-secondary", "bg-bingo-green",
  "bg-bingo-purple", "bg-bingo-orange", "bg-bingo-pink",
];

const authPanelCopy: Record<
  Locale,
  {
    eyebrow: string;
    headline: string;
    subline: string;
    heroNote: string;
    primaryTitle: string;
    primaryDesc: string;
    secureHint: string;
    trustItems: [string, string, string];
    helperTitle: string;
    helperDesc: string;
    footer: string;
    emailLabel: string;
    emailPlaceholder: string;
    emailCta: string;
    sentTitle: string;
    sentDescription: (email: string) => string;
  }
> = {
  zh: {
    eyebrow: "邮箱魔法链接登录",
    headline: "输入邮箱，去收一封登录邮件就够了。",
    subline: "用户不需要密码，也不需要 Google OAuth。输入邮箱后，点击邮件里的登录链接即可进入 Bingo Time。",
    heroNote: "邮件会发送到用户填写的邮箱，点击一次即可完成登录。",
    primaryTitle: "使用邮箱登录",
    primaryDesc: "发送一封一次性登录邮件到用户邮箱。点击邮件中的链接后，会直接回到应用并完成登录。",
    secureHint: "本页不会要求密码。Supabase 会向该邮箱发送一次性 Magic Link。",
    trustItems: ["免密码登录", "自动保存进度", "跨设备同步"],
    helperTitle: "这次真正需要的登录方式",
    helperDesc: "你要的是邮箱登录，不是 Google 授权。首屏现在直接围绕“输入邮箱 -> 收信 -> 点击登录”这个流程来设计。",
    footer: "继续即表示你将通过邮箱收到一次性登录链接。",
    emailLabel: "邮箱地址",
    emailPlaceholder: "name@example.com",
    emailCta: "发送登录链接",
    sentTitle: "登录邮件已发送",
    sentDescription: (email) => `我们已经把登录链接发到 ${email}，请去邮箱点击邮件中的链接完成登录。`,
  },
  en: {
    eyebrow: "Email magic link sign-in",
    headline: "Enter an email, then click the link in the inbox.",
    subline: "No password and no Google OAuth. Users type their email, open the message, and sign in from the email link.",
    heroNote: "A one-time sign-in email is sent to the address the user enters.",
    primaryTitle: "Sign in with email",
    primaryDesc: "Send a one-time sign-in email to the user. Clicking the link returns them to the app and completes sign-in.",
    secureHint: "This page never asks for a password. Supabase sends a one-time Magic Link to the email address.",
    trustItems: ["Passwordless sign-in", "Auto-saved progress", "Cross-device sync"],
    helperTitle: "This matches your real flow",
    helperDesc: "You wanted email login, not Google auth. The page now focuses on the simple flow: enter email, open inbox, click link.",
    footer: "By continuing, you will receive a one-time sign-in link by email.",
    emailLabel: "Email address",
    emailPlaceholder: "name@example.com",
    emailCta: "Send sign-in link",
    sentTitle: "Sign-in email sent",
    sentDescription: (email) => `We sent a sign-in link to ${email}. Open the email and click the link to finish signing in.`,
  },
  es: {
    eyebrow: "Inicio con enlace mágico por correo",
    headline: "Escribe un correo y luego entra desde el enlace del inbox.",
    subline: "Sin contraseña y sin Google OAuth. El usuario escribe su correo, abre el mensaje y entra con el enlace recibido.",
    heroNote: "Se envía un correo de acceso de un solo uso al email que introduzca el usuario.",
    primaryTitle: "Entrar con correo",
    primaryDesc: "Envía un correo de acceso de un solo uso. Al pulsar el enlace, el usuario vuelve a la app e inicia sesión.",
    secureHint: "Esta página no pide contraseña. Supabase envía un Magic Link de un solo uso al correo indicado.",
    trustItems: ["Acceso sin contraseña", "Progreso guardado", "Sincronización entre dispositivos"],
    helperTitle: "Este flujo sí coincide",
    helperDesc: "Lo que querías era acceso por correo, no autorización con Google. Ahora la página se centra en: escribir correo, abrir inbox y pulsar el enlace.",
    footer: "Al continuar, recibirás por correo un enlace de acceso de un solo uso.",
    emailLabel: "Correo electrónico",
    emailPlaceholder: "name@example.com",
    emailCta: "Enviar enlace de acceso",
    sentTitle: "Correo de acceso enviado",
    sentDescription: (email) => `Enviamos un enlace de acceso a ${email}. Abre el correo y pulsa el enlace para terminar de iniciar sesión.`,
  },
};

const authErrorCopy: Record<
  Locale,
  {
    invalidEmailTitle: string;
    invalidEmailDescription: string;
    emailSendTitle: string;
    emailSendDescription: string;
    genericTitle: string;
    genericDescription: string;
  }
> = {
  zh: {
    invalidEmailTitle: "邮箱格式不正确",
    invalidEmailDescription: "请输入有效的邮箱地址后再发送登录链接。",
    emailSendTitle: "发送失败",
    emailSendDescription: "登录邮件暂时无法发送，请检查 Supabase 的 Email Auth 和 Site URL 配置。",
    genericTitle: "登录失败",
    genericDescription: "邮箱登录暂时不可用，请检查 Supabase Auth 配置后重试。",
  },
  en: {
    invalidEmailTitle: "Invalid email address",
    invalidEmailDescription: "Enter a valid email address before sending the sign-in link.",
    emailSendTitle: "Unable to send email",
    emailSendDescription: "The sign-in email could not be sent. Check Supabase Email Auth and Site URL settings.",
    genericTitle: "Sign-in failed",
    genericDescription: "Email sign-in is temporarily unavailable. Please verify your Supabase Auth settings and try again.",
  },
  es: {
    invalidEmailTitle: "Correo no válido",
    invalidEmailDescription: "Introduce un correo válido antes de enviar el enlace de acceso.",
    emailSendTitle: "No se pudo enviar el correo",
    emailSendDescription: "No se pudo enviar el correo de acceso. Revisa la configuración de Email Auth y Site URL en Supabase.",
    genericTitle: "Error al iniciar sesión",
    genericDescription: "El acceso por correo no está disponible ahora. Verifica la configuración de Supabase Auth e inténtalo de nuevo.",
  },
};

// Static demo grid (kept for the "See how it works" section)
function checkLines(completed: Set<number>, size: number) {
  const lines: number[][] = [];
  for (let r = 0; r < size; r++) {
    const row = Array.from({ length: size }, (_, c) => r * size + c);
    if (row.every((i) => completed.has(i))) lines.push(row);
  }
  for (let c = 0; c < size; c++) {
    const col = Array.from({ length: size }, (_, r) => r * size + c);
    if (col.every((i) => completed.has(i))) lines.push(col);
  }
  const d1 = Array.from({ length: size }, (_, i) => i * size + i);
  if (d1.every((i) => completed.has(i))) lines.push(d1);
  const d2 = Array.from({ length: size }, (_, i) => i * size + (size - 1 - i));
  if (d2.every((i) => completed.has(i))) lines.push(d2);
  return lines;
}

function DemoBingoGrid({ tasks }: { tasks: readonly string[] }) {
  const grid = tasks.slice(0, 25);
  const [completed, setCompleted] = useState<Set<number>>(
    () => new Set([0, 1, 2, 3, 4, 5, 7, 12, 17, 19, 20, 22, 23, 24])
  );
  const lines = checkLines(completed, 5);
  const bingoIndices = new Set(lines.flat());
  const toggle = useCallback((i: number) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }, []);

  return (
    <div className="grid grid-cols-5 gap-1.5" style={{ maxWidth: "320px", margin: "0 auto" }}>
      {grid.map((task, i) => (
        <motion.button
          key={i}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggle(i)}
          className={cn(
            "aspect-square rounded-xl flex items-center justify-center p-1 text-center text-[9px] font-body font-semibold shadow-sm border-2 border-transparent select-none leading-tight cursor-pointer transition-all duration-200",
            completed.has(i)
              ? bingoIndices.has(i)
                ? "bg-accent text-accent-foreground border-accent scale-105"
                : `${cellColors[i % cellColors.length]} text-primary-foreground opacity-90`
              : "bg-card text-card-foreground border border-border hover:border-primary/30"
          )}
        >
          {task}
        </motion.button>
      ))}
    </div>
  );
}

// ─── Interactive Try-It Demo ───
const gridOptions: { size: GridSize; label: string }[] = [
  { size: 3, label: "3×3" },
  { size: 4, label: "4×4" },
  { size: 5, label: "5×5" },
];

function InteractiveDemo({ locale }: { locale: Locale }) {
  const t = getTranslations(locale);
  const [phase, setPhase] = useState<"setup" | "play">("setup");
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [tasks, setTasks] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  // Play phase state
  const [cells, setCells] = useState<BingoCell[]>([]);
  const [bingoLines, setBingoLines] = useState<number[][]>([]);
  const [showBingo, setShowBingo] = useState(false);

  const totalSlots = gridSize * gridSize;
  const remaining = totalSlots - tasks.length;

  const addTask = () => {
    if (!input.trim() || tasks.length >= totalSlots) return;
    setTasks([...tasks, input.trim()]);
    setInput("");
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const startEditTask = (index: number) => {
    setEditingIndex(index);
    setEditingValue(tasks[index]);
  };

  const saveEditTask = () => {
    if (editingIndex === null) return;
    if (editingValue.trim()) {
      setTasks(tasks.map((t, i) => (i === editingIndex ? editingValue.trim() : t)));
    }
    setEditingIndex(null);
  };

  const fillRandom = () => {
    const needed = totalSlots - tasks.length;
    if (needed <= 0) return;
    const random = getRandomTasks(needed, tasks, t.sampleTasks);
    setTasks([...tasks, ...random]);
  };

  const startGame = () => {
    if (tasks.length !== totalSlots) return;
    const shuffled = [...tasks].sort(() => Math.random() - 0.5);
    const newCells = createEmptyGrid(gridSize).map((cell, i) => ({ ...cell, task: shuffled[i] }));
    setCells(newCells);
    setBingoLines([]);
    setPhase("play");
  };

  const toggleCell = (index: number) => {
    const wasCompleted = cells[index].completed;
    const updated = cells.map((c, i) =>
      i === index ? { ...c, completed: !c.completed } : c
    );
    setCells(updated);
    const newLines = checkBingoLines(updated, gridSize);

    if (!wasCompleted) {
      playTapSound();
      if (newLines.length > bingoLines.length) {
        setTimeout(() => {
          playBingoSound();
          setShowBingo(true);
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#e84057", "#3bb54a", "#8b5cf6", "#f59e0b", "#e84057"],
          });
          setTimeout(() => setShowBingo(false), 2500);
        }, 150);
      }
    } else {
      playUntapSound();
    }

    setBingoLines(newLines);
  };

  const resetDemo = () => {
    setPhase("setup");
    setTasks([]);
    setCells([]);
    setBingoLines([]);
  };

  const bingoIndicesSet = new Set(bingoLines.flat());

  if (phase === "play") {
    return (
      <div className="relative space-y-4 mx-auto" style={{ maxWidth: gridSize === 3 ? "340px" : gridSize === 4 ? "400px" : "440px" }}>
        <div
          className="grid gap-2"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {cells.map((cell, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.92 }}
              onClick={() => toggleCell(i)}
              className={cn(
                "aspect-square rounded-xl flex items-center justify-center p-1 text-center transition-all duration-200 font-body font-semibold shadow-md border-2 border-transparent cursor-pointer select-none",
                gridSize === 3 ? "text-sm" : gridSize === 4 ? "text-xs" : "text-[10px]",
                cell.completed
                  ? bingoIndicesSet.has(i)
                    ? "bg-accent text-accent-foreground border-accent scale-105 bingo-line-shimmer"
                    : `${cellColors[i % cellColors.length]} text-primary-foreground opacity-90`
                  : "bg-card text-card-foreground hover:shadow-lg hover:border-primary/30"
              )}
            >
              <span className={cn(cell.completed && "animate-cell-complete")}>
                {cell.task}
              </span>
            </motion.button>
          ))}
        </div>

        {bingoLines.length > 0 && (
          <div className="mt-4 text-center">
            <span className="font-display text-lg text-primary font-bold">
              🎉 BINGO × {bingoLines.length}
            </span>
          </div>
        )}

        <AnimatePresence>
          {showBingo && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="font-display text-6xl font-bold text-primary drop-shadow-lg animate-bingo-pop">
                BINGO! 🎊
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button variant="outline" onClick={resetDemo} className="w-full rounded-xl font-display">
          ↺ {t.selectGridSize}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      {/* Grid size */}
      <div className="text-center space-y-2">
        <h3 className="font-display text-lg font-bold text-foreground">{t.selectGridSize}</h3>
        <div className="flex gap-3 justify-center">
          {gridOptions.map((opt) => (
            <Button
              key={opt.size}
              variant={gridSize === opt.size ? "default" : "outline"}
              className={cn(
                "font-display text-base px-5 py-2 rounded-xl transition-all",
                gridSize === opt.size && "shadow-lg scale-105"
              )}
              onClick={() => {
                setGridSize(opt.size);
                setTasks(tasks.slice(0, opt.size * opt.size));
              }}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder={t.inputTask}
          className="rounded-xl font-body"
          disabled={tasks.length >= totalSlots}
        />
        <Button onClick={addTask} disabled={!input.trim() || tasks.length >= totalSlots} className="rounded-xl">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Random fill */}
      <Button variant="secondary" onClick={fillRandom} disabled={remaining <= 0} className="w-full rounded-xl font-display">
        <Shuffle className="w-4 h-4 mr-2" /> {t.randomFill} ({remaining})
      </Button>

      {/* Task list */}
      <div className="space-y-2">
        <p className="font-body text-sm text-muted-foreground text-center">
          {t.tasksAdded} {tasks.length}/{totalSlots} {t.tasksUnit}
        </p>
        {tasks.length > 0 && (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {tasks.map((task, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 bg-card rounded-lg px-3 py-2 text-xs font-body shadow-sm"
              >
                {editingIndex === i ? (
                  <>
                    <Input
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEditTask()}
                      className="h-6 text-xs rounded-lg font-body flex-1 min-w-0"
                      autoFocus
                    />
                    <button onClick={saveEditTask} className="text-primary shrink-0">
                      <Check className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 truncate">{task}</span>
                    <button onClick={() => startEditTask(i)} className="text-muted-foreground hover:text-foreground shrink-0">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeTask(i)} className="text-muted-foreground hover:text-destructive shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Start */}
      <Button
        onClick={startGame}
        disabled={tasks.length !== totalSlots}
        className="w-full rounded-xl font-display text-lg py-5 shadow-lg"
      >
        <Sparkles className="w-5 h-5 mr-2" /> {t.startBingo}
      </Button>
    </div>
  );
}

// ─── Main Auth Page ───
export default function Auth() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { locale, setLocale, t } = useLocale();
  const authCopy = authPanelCopy[locale];
  const errorCopy = authErrorCopy[locale];
  const [email, setEmail] = useState("");
  const [sendingLink, setSendingLink] = useState(false);
  const [linkSentTo, setLinkSentTo] = useState<string | null>(null);
  const trustRows = [
    { icon: ShieldCheck, label: authCopy.trustItems[0] },
    { icon: History, label: authCopy.trustItems[1] },
    { icon: Smartphone, label: authCopy.trustItems[2] },
  ];

  useEffect(() => {
    if (!loading && user) navigate("/", { replace: true });
  }, [user, loading, navigate]);

  const handleEmailSignIn = async () => {
    const normalizedEmail = email.trim();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!isValidEmail) {
      toast({
        title: errorCopy.invalidEmailTitle,
        description: errorCopy.invalidEmailDescription,
        variant: "destructive",
      });
      return;
    }

    setSendingLink(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    setSendingLink(false);

    if (!error) {
      setLinkSentTo(normalizedEmail);
      toast({
        title: authCopy.sentTitle,
        description: authCopy.sentDescription(normalizedEmail),
      });
      return;
    }

    const emailSendError = /email|smtp|rate limit|sending/i.test(error.message);
    toast({
      title: emailSendError ? errorCopy.emailSendTitle : errorCopy.genericTitle,
      description: emailSendError
        ? `${errorCopy.emailSendDescription} (${error.message})`
        : `${errorCopy.genericDescription} (${error.message})`,
      variant: "destructive",
    });
  };

  const cycleLocale = () => {
    const idx = localeOrder.indexOf(locale);
    setLocale(localeOrder[(idx + 1) % localeOrder.length]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(251,188,5,0.12),_transparent_24%),linear-gradient(180deg,#fbfdff_0%,#fffaf1_45%,#fff6ed_100%)]">
      <header className="sticky top-0 z-30 border-b border-white/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <Mail className="h-5 w-5 text-[#4285F4]" />
            </div>
            <div>
              <p className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-[#5f6368]">Bingo Time</p>
              <p className="font-display text-lg font-bold text-slate-900">Passwordless email sign in</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={cycleLocale} className="h-9 w-9 rounded-full text-slate-600 hover:bg-white">
              <Globe className="h-4 w-4" />
            </Button>
            <span className="min-w-9 text-center text-xs font-body font-bold text-slate-500">{localeLabels[locale]}</span>
            <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-body text-slate-700 shadow-sm sm:block">
              {authCopy.primaryTitle}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-8 md:py-12">
        <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-body text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                <MailCheck className="h-4 w-4 text-[#1a73e8]" />
                <span>{authCopy.eyebrow}</span>
              </div>
              <div className="space-y-4">
                <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-slate-950 md:text-6xl">
                  {authCopy.headline}
                </h1>
                <p className="max-w-xl whitespace-pre-line font-body text-lg leading-8 text-slate-600">
                  {t.heroDesc}
                </p>
                <p className="max-w-xl font-body text-base leading-7 text-slate-500">
                  {authCopy.subline}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {trustRows.map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-3xl border border-white/80 bg-white/80 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                  <Icon className="mb-3 h-5 w-5 text-[#4285F4]" />
                  <p className="font-body text-sm font-semibold text-slate-800">{label}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[32px] border border-white/80 bg-white/75 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Preview
                  </p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-slate-900">{t.appTitle}</h2>
                </div>
                <div className="rounded-full bg-[#e8f0fe] px-4 py-2 font-body text-sm font-semibold text-[#1a73e8]">
                  {authCopy.heroNote}
                </div>
              </div>
              <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_220px]">
                <div className="space-y-4">
                  <p className="font-body text-sm leading-7 text-slate-600">{authCopy.helperDesc}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <LayoutGrid className="mb-2 h-4 w-4 text-[#ea4335]" />
                      <p className="font-body text-sm font-semibold text-slate-800">{t.tryItTitle}</p>
                      <p className="mt-1 font-body text-xs leading-6 text-slate-500">{t.tryItDesc}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <ShieldCheck className="mb-2 h-4 w-4 text-[#34a853]" />
                      <p className="font-body text-sm font-semibold text-slate-800">{authCopy.helperTitle}</p>
                      <p className="mt-1 font-body text-xs leading-6 text-slate-500">{authCopy.secureHint}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-[28px] border border-slate-100 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
                  <DemoBingoGrid tasks={t.sampleTasks.slice(0, 25)} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="mx-auto w-full max-w-[480px]"
          >
            <div
              className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] md:p-8"
              style={{ fontFamily: 'Arial, "Helvetica Neue", sans-serif' }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#f8fafd]">
                    <MailCheck className="h-6 w-6 text-[#1a73e8]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#5f6368]">Email sign in</p>
                    <h2 className="text-[32px] font-normal tracking-tight text-[#202124]">{t.signIn}</h2>
                  </div>
                </div>
                <span className="rounded-full border border-[#d2e3fc] bg-[#eef3fd] px-3 py-1 text-xs font-medium text-[#1a73e8]">
                  Magic Link
                </span>
              </div>

              <div className="mt-8 space-y-3">
                <p className="text-xl font-normal text-[#202124]">{authCopy.primaryTitle}</p>
                <p className="text-sm leading-6 text-[#5f6368]">{authCopy.primaryDesc}</p>
              </div>

              <form
                className="mt-8 rounded-[28px] border border-[#dadce0] bg-[#f8fafd] p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleEmailSignIn();
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-sm">
                    <Mail className="h-5 w-5 text-[#1a73e8]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#202124]">{authCopy.emailLabel}</p>
                    <p className="text-sm text-[#5f6368]">{authCopy.secureHint}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={authCopy.emailPlaceholder}
                    className="h-12 rounded-2xl border-[#dadce0] bg-white text-base text-[#202124] placeholder:text-[#5f6368]"
                  />
                  {linkSentTo && (
                    <div className="rounded-2xl border border-[#d2e3fc] bg-white px-4 py-3">
                      <p className="text-sm font-medium text-[#1a73e8]">{authCopy.sentTitle}</p>
                      <p className="mt-1 text-sm leading-6 text-[#5f6368]">{authCopy.sentDescription(linkSentTo)}</p>
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={sendingLink}
                  className="mt-5 h-14 w-full rounded-full bg-[#1a73e8] px-5 text-base font-medium text-white shadow-none transition hover:bg-[#1967d2]"
                >
                  <MailCheck className="mr-3 h-5 w-5" />
                  {sendingLink ? `${authCopy.emailCta}...` : authCopy.emailCta}
                  <ArrowRight className="ml-auto h-4 w-4" />
                </Button>
                <p className="mt-4 text-xs leading-6 text-[#5f6368]">{authCopy.footer}</p>
              </form>

              <div className="mt-6 space-y-3">
                {trustRows.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-50">
                      <Icon className="h-4 w-4 text-[#1a73e8]" />
                    </div>
                    <p className="text-sm text-[#3c4043]">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {t.painPoints.map((item, i) => {
            const Icon = painIcons[i];
            return (
              <div key={i} className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] backdrop-blur-sm">
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-display text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 font-body text-sm leading-7 text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl font-bold text-foreground">{t.tryItTitle}</h2>
            <p className="font-body text-sm text-muted-foreground">{t.tryItDesc}</p>
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/85 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <InteractiveDemo locale={locale} />
          </div>

          <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] border border-[#d2e3fc] bg-[#eef3fd] px-4 py-4 text-center sm:flex-row">
            <p className="font-body text-sm text-[#4a5565]">{t.saveHint}</p>
            <span className="rounded-full bg-white px-4 py-2 font-body text-sm text-[#1a73e8] shadow-sm">
              {authCopy.emailCta}
            </span>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-center font-display text-3xl font-bold text-foreground">{t.choosePlan}</h2>

          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)]">
              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-foreground">Basic</h3>
                <p className="font-display text-3xl font-bold text-primary">{t.free}</p>
              </div>
              <ul className="mt-5 space-y-3 font-body text-sm text-muted-foreground">
                {t.basicFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-6 w-full rounded-full font-body text-sm"
              >
                <Sparkles className="mr-2 h-4 w-4" /> {t.freeStart}
              </Button>
            </div>

            <div className="relative rounded-[28px] border-2 border-primary bg-white p-6 shadow-[0_24px_60px_rgba(232,64,87,0.12)]">
              <div className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs font-display font-bold text-primary-foreground">
                {t.recommended}
              </div>
              <div className="space-y-1">
                <h3 className="flex items-center gap-2 font-display text-xl font-bold text-foreground">
                  <Crown className="h-5 w-5 text-accent" /> Pro
                </h3>
                <p className="font-display text-3xl font-bold text-primary">
                  $4.99<span className="text-base font-body text-muted-foreground">{t.perMonth}</span>
                </p>
              </div>
              <ul className="mt-5 space-y-3 font-body text-sm text-muted-foreground">
                {t.proFeatures.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="mt-6 w-full rounded-full border-primary font-body text-sm text-primary hover:bg-primary hover:text-primary-foreground"
                disabled
              >
                {t.comingSoon}
              </Button>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="pb-8 text-center"
        >
          <p className="font-body text-sm text-muted-foreground">{t.footerCta}</p>
        </motion.section>
      </main>
    </div>
  );
}
