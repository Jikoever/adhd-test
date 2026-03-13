const STORAGE_KEY = "adhd_bingo_todos";
const BOARD_STORAGE_KEY = "adhd_bingo_board_state";
const BOARD_SIZE_KEY = "adhd_bingo_board_size";
const LANG_STORAGE_KEY = "adhd_bingo_lang";

const MAX_TODOS = 25;
const SUPPORTED_LANGS = ["en", "es", "zh"];

const I18N = {
  en: {
    "common.appTitle": "ADHD bingo",
    "common.tagline": "Stop thinking. Start clicking.",
    "common.language": "Language",
    "common.footer": "Designed for focus & relaxation",
    "common.randomTask": "Random task {index}",

    "landing.pageTitle": "ADHD bingo",
    "landing.subtitle": "Choose what you want to do.",
    "landing.tasksBtn": "Add Tasks",
    "landing.tasksDesc": "Create your task list and generate your board.",
    "landing.calendarBtn": "Calendar",
    "landing.calendarDesc": "View your daily Bingo history.",

    "auth.emailPlaceholder": "Email",
    "auth.passwordPlaceholder": "Verification code",
    "auth.loginBtn": "Send Code",
    "auth.registerBtn": "Verify Code",
    "auth.logoutBtn": "Logout",
    "auth.todayCount": "Today: {count} Bingos",
    "auth.loginSuccess": "Logged in successfully.",
    "auth.registerSuccess": "Code verified. Logged in.",
    "auth.codeSent": "Verification code sent. Check your email inbox.",
    "auth.checkEmail": "Check your email to confirm signup, then log in.",
    "auth.logoutSuccess": "Logged out.",
    "auth.invalidInput": "Use a valid email address.",
    "auth.invalidCode": "Use the 6-digit verification code from your email.",
    "auth.badCreds": "Invalid email or password.",
    "auth.emailExists": "This email is already registered.",
    "auth.dbError": "Database error. Check Supabase table setup and try again.",
    "auth.sessionError": "Session could not be created. Please retry.",
    "auth.supabaseNotConfigured": "Supabase config missing. Add URL + Publishable key in .env.",
    "auth.usePublishableKey": "Use Supabase Publishable (anon) key in browser config, not secret key.",
    "auth.libMissing": "Supabase Auth library failed to load.",
    "auth.unknownError": "Request failed. Please try again.",
    "auth.serverOffline": "Auth service unavailable. Check deployment and API settings.",
    "auth.quickSignup": "Need an email? Sign up:",
    "auth.gmailSignup": "Gmail",
    "auth.outlookSignup": "Outlook",

    "todo.pageTitle": "ADHD bingo - Tasks",
    "todo.title": "Create Task List",
    "todo.boardSize": "Board",
    "todo.clearTitle": "Clear tasks",
    "todo.inputPlaceholder": "Type a task, e.g. Drink a glass of water",
    "todo.ideaBtn": "💡 Task Ideas",
    "todo.generateBtn": "Generate Bingo",
    "todo.countBadge": "{count} / {max}",
    "todo.needExact": "Add exactly {count} tasks for this board size.",
    "todo.empty": "No tasks yet. Add your first one.",
    "todo.removeAria": "Remove task",

    "board.pageTitle": "ADHD bingo - Board",
    "board.sizeLabel": "Size",
    "board.applySizeBtn": "Apply Size",
    "board.shuffleBtn": "🔀 Shuffle",
    "board.randomBtn": "🎯 Random Tasks",
    "board.restartBtn": "↺ Restart",
    "board.backBtn": "Back To Tasks",
    "board.info": "{size} x {size} board, {count} cells",
    "board.progress": "Completed {done}/{total}",
    "board.todayInline": "Bingo {count}",
    "board.bingoRow": "BINGO! Completed line(s): {rows}",
    "board.celebrate": "BINGO! 🎉",
    "board.restartConfirm": "Restarting will clear current board order and progress. Continue?",
    "board.hint.todoOnly": "Tasks are from your task list.",
    "board.hint.mixed": "Used your tasks and auto-filled with random tasks.",
    "board.hint.randomOnly": "No tasks found. Random tasks were used.",
    "board.hint.shuffleRestart": "Shuffled current tasks and restarted.",
    "board.hint.randomRestart": "Generated random tasks and restarted.",
    "board.calendarBtn": "Calendar",

    "calendar.pageTitle": "ADHD bingo - Calendar",
    "calendar.title": "Bingo Calendar",
    "calendar.prev": "Prev",
    "calendar.next": "Next",
    "calendar.loginHint": "Login to view your daily Bingo history.",
    "calendar.total": "Total this month: {count}",
    "calendar.dayCount": "Bingo {count}",
    "calendar.empty": "No Bingo records this month.",
    "calendar.yearTitle": "Yearly Activity",
    "calendar.totalAll": "Total Bingos",
    "calendar.currentStreak": "Current Streak",
    "calendar.bestStreak": "Best Streak",
    "calendar.daysUnit": "{count} days",
    "calendar.heatEmpty": "No activity this year."
  },
  es: {
    "common.appTitle": "ADHD bingo",
    "common.tagline": "Stop thinking. Start clicking.",
    "common.language": "Idioma",
    "common.footer": "Diseñado para enfoque y relajación",
    "common.randomTask": "Tarea aleatoria {index}",

    "landing.pageTitle": "ADHD bingo",
    "landing.subtitle": "Elige lo que quieres hacer.",
    "landing.tasksBtn": "Agregar tareas",
    "landing.tasksDesc": "Crea tu lista y genera tu tablero.",
    "landing.calendarBtn": "Calendario",
    "landing.calendarDesc": "Mira tu historial diario de Bingo.",

    "auth.emailPlaceholder": "Correo",
    "auth.passwordPlaceholder": "Código de verificación",
    "auth.loginBtn": "Enviar código",
    "auth.registerBtn": "Verificar código",
    "auth.logoutBtn": "Salir",
    "auth.todayCount": "Hoy: {count} Bingos",
    "auth.loginSuccess": "Sesión iniciada.",
    "auth.registerSuccess": "Código verificado. Sesión iniciada.",
    "auth.codeSent": "Código enviado. Revisa tu correo.",
    "auth.checkEmail": "Revisa tu correo para confirmar la cuenta y luego inicia sesión.",
    "auth.logoutSuccess": "Sesión cerrada.",
    "auth.invalidInput": "Usa un correo válido.",
    "auth.invalidCode": "Usa el código de 6 dígitos enviado a tu correo.",
    "auth.badCreds": "Correo o contraseña incorrectos.",
    "auth.emailExists": "Este correo ya está registrado.",
    "auth.dbError": "Error de base de datos. Revisa Supabase e inténtalo de nuevo.",
    "auth.sessionError": "No se pudo crear la sesión. Inténtalo otra vez.",
    "auth.supabaseNotConfigured": "Falta configuración de Supabase. Añade URL + clave publicable en .env.",
    "auth.usePublishableKey": "Usa la clave publicable (anon) de Supabase en el navegador, no la secreta.",
    "auth.libMissing": "No se pudo cargar la librería de Supabase Auth.",
    "auth.unknownError": "La solicitud falló. Inténtalo de nuevo.",
    "auth.serverOffline": "Servicio de autenticación no disponible. Revisa el despliegue y la configuración API.",
    "auth.quickSignup": "¿No tienes correo? Regístrate:",
    "auth.gmailSignup": "Gmail",
    "auth.outlookSignup": "Outlook",

    "todo.pageTitle": "ADHD bingo - Tareas",
    "todo.title": "Crear Lista de Tareas",
    "todo.boardSize": "Tablero",
    "todo.clearTitle": "Limpiar tareas",
    "todo.inputPlaceholder": "Escribe una tarea, ej. Beber un vaso de agua",
    "todo.ideaBtn": "💡 Ideas",
    "todo.generateBtn": "Generar Bingo",
    "todo.countBadge": "{count} / {max}",
    "todo.needExact": "Agrega exactamente {count} tareas para este tamaño.",
    "todo.empty": "Aún no hay tareas. Agrega la primera.",
    "todo.removeAria": "Eliminar tarea",

    "board.pageTitle": "ADHD bingo - Tablero",
    "board.sizeLabel": "Tamaño",
    "board.applySizeBtn": "Aplicar",
    "board.shuffleBtn": "🔀 Mezclar",
    "board.randomBtn": "🎯 Aleatorias",
    "board.restartBtn": "↺ Reiniciar",
    "board.backBtn": "Volver a Tareas",
    "board.info": "Tablero {size} x {size}, {count} celdas",
    "board.progress": "Completado {done}/{total}",
    "board.todayInline": "Bingo {count}",
    "board.bingoRow": "BINGO! Lineas completadas: {rows}",
    "board.celebrate": "BINGO! 🎉",
    "board.restartConfirm": "Reiniciar borrará orden y progreso actuales. ¿Continuar?",
    "board.hint.todoOnly": "Las tareas vienen de tu lista.",
    "board.hint.mixed": "Se usaron tus tareas y se completó con aleatorias.",
    "board.hint.randomOnly": "No hay tareas. Se usaron tareas aleatorias.",
    "board.hint.shuffleRestart": "Se mezclaron las tareas actuales y se reinició.",
    "board.hint.randomRestart": "Se generaron tareas aleatorias y se reinició.",
    "board.calendarBtn": "Calendario",

    "calendar.pageTitle": "ADHD bingo - Calendario",
    "calendar.title": "Calendario Bingo",
    "calendar.prev": "Anterior",
    "calendar.next": "Siguiente",
    "calendar.loginHint": "Inicia sesión para ver tu historial diario de Bingo.",
    "calendar.total": "Total del mes: {count}",
    "calendar.dayCount": "Bingo {count}",
    "calendar.empty": "No hay registros de Bingo este mes.",
    "calendar.yearTitle": "Actividad anual",
    "calendar.totalAll": "Bingos totales",
    "calendar.currentStreak": "Racha actual",
    "calendar.bestStreak": "Mejor racha",
    "calendar.daysUnit": "{count} días",
    "calendar.heatEmpty": "Sin actividad este año."
  },
  zh: {
    "common.appTitle": "ADHD bingo",
    "common.tagline": "Stop thinking. Start clicking.",
    "common.language": "语言",
    "common.footer": "Designed for focus & relaxation",
    "common.randomTask": "随机任务 {index}",

    "landing.pageTitle": "ADHD bingo",
    "landing.subtitle": "选择你想进入的页面。",
    "landing.tasksBtn": "添加任务",
    "landing.tasksDesc": "创建任务清单并生成棋盘。",
    "landing.calendarBtn": "日历",
    "landing.calendarDesc": "查看每天的 Bingo 记录。",

    "auth.emailPlaceholder": "邮箱",
    "auth.passwordPlaceholder": "邮箱验证码",
    "auth.loginBtn": "发送验证码",
    "auth.registerBtn": "验证并登录",
    "auth.logoutBtn": "退出",
    "auth.todayCount": "今日: {count} 次 Bingo",
    "auth.loginSuccess": "登录成功。",
    "auth.registerSuccess": "验证码验证成功，已登录。",
    "auth.codeSent": "验证码已发送，请查收邮箱。",
    "auth.checkEmail": "请先去邮箱完成验证，再回来登录。",
    "auth.logoutSuccess": "已退出登录。",
    "auth.invalidInput": "请输入有效邮箱地址。",
    "auth.invalidCode": "请输入邮箱收到的 6 位验证码。",
    "auth.badCreds": "邮箱或密码错误。",
    "auth.emailExists": "该邮箱已注册。",
    "auth.dbError": "数据库错误，请检查 Supabase 表配置后重试。",
    "auth.sessionError": "会话创建失败，请重试。",
    "auth.supabaseNotConfigured": "Supabase 配置缺失，请在 .env 填写 URL 和 Publishable key。",
    "auth.usePublishableKey": "浏览器端请使用 Supabase Publishable（anon）key，不要用 secret key。",
    "auth.libMissing": "Supabase Auth 库加载失败。",
    "auth.unknownError": "请求失败，请稍后重试。",
    "auth.serverOffline": "认证服务不可用，请检查部署和 API 配置。",
    "auth.quickSignup": "没有邮箱？快速注册：",
    "auth.gmailSignup": "Gmail",
    "auth.outlookSignup": "Outlook",

    "todo.pageTitle": "ADHD bingo - 任务",
    "todo.title": "创建任务清单",
    "todo.boardSize": "棋盘",
    "todo.clearTitle": "清空任务",
    "todo.inputPlaceholder": "输入任务，例如：喝一杯水",
    "todo.ideaBtn": "💡 任务灵感",
    "todo.generateBtn": "生成 Bingo",
    "todo.countBadge": "{count} / {max}",
    "todo.needExact": "该尺寸需要恰好 {count} 个任务。",
    "todo.empty": "还没有任务，先添加一条吧。",
    "todo.removeAria": "删除任务",

    "board.pageTitle": "ADHD bingo - 棋盘",
    "board.sizeLabel": "尺寸",
    "board.applySizeBtn": "应用尺寸",
    "board.shuffleBtn": "🔀 洗牌",
    "board.randomBtn": "🎯 随机任务",
    "board.restartBtn": "↺ 重新开始",
    "board.backBtn": "返回任务页",
    "board.info": "{size} x {size} 棋盘，共 {count} 格",
    "board.progress": "已完成 {done}/{total}",
    "board.todayInline": "Bingo {count}",
    "board.bingoRow": "BINGO! 完成连线：{rows}",
    "board.celebrate": "BINGO! 🎉",
    "board.restartConfirm": "重新开始会清空当前排序和完成进度，确定继续吗？",
    "board.hint.todoOnly": "任务来自你的任务清单。",
    "board.hint.mixed": "已使用你的任务，并自动补充随机任务。",
    "board.hint.randomOnly": "没有任务，已使用随机任务。",
    "board.hint.shuffleRestart": "已在原任务基础上洗牌并重开。",
    "board.hint.randomRestart": "已随机生成任务并重开。",
    "board.calendarBtn": "日历",

    "calendar.pageTitle": "ADHD bingo - 日历",
    "calendar.title": "Bingo 日历",
    "calendar.prev": "上个月",
    "calendar.next": "下个月",
    "calendar.loginHint": "请先登录以查看每天的 Bingo 记录。",
    "calendar.total": "本月总计: {count}",
    "calendar.dayCount": "Bingo {count}",
    "calendar.empty": "本月还没有 Bingo 记录。",
    "calendar.yearTitle": "年度活跃图",
    "calendar.totalAll": "历史总 Bingo",
    "calendar.currentStreak": "当前连续天数",
    "calendar.bestStreak": "最长连续天数",
    "calendar.daysUnit": "{count} 天",
    "calendar.heatEmpty": "今年还没有记录。"
  }
};

const RANDOM_POOL = {
  en: [
    "Drink a glass of water",
    "Stretch for 2 minutes",
    "Clean your desk for 5 minutes",
    "Reply to one important message",
    "Organize one folder",
    "Take out the trash",
    "Wash one cup",
    "Write the most important task today",
    "Start a 15-minute focus timer",
    "Take 10 deep breaths",
    "Check your schedule",
    "Send one pending email",
    "Put clothes back in closet",
    "Sort charging cables",
    "Make your bed",
    "Prepare a small reward",
    "Delete 5 useless screenshots",
    "Close extra browser tabs",
    "Keep phone away for 20 minutes",
    "Write a 3-line daily summary",
    "Check wallet, keys, ID",
    "Break one task into next action",
    "Water your plant",
    "Do 20 steps in place",
    "Clean one drawer"
  ],
  es: [
    "Bebe un vaso de agua",
    "Estírate 2 minutos",
    "Limpia tu escritorio 5 minutos",
    "Responde un mensaje importante",
    "Organiza una carpeta",
    "Saca la basura",
    "Lava una taza",
    "Escribe la tarea más importante",
    "Activa un temporizador de 15 minutos",
    "Haz 10 respiraciones profundas",
    "Revisa tu agenda",
    "Envía un correo pendiente",
    "Guarda la ropa",
    "Ordena cables de carga",
    "Haz la cama",
    "Prepárate una recompensa pequeña",
    "Borra 5 capturas innecesarias",
    "Cierra pestañas extra",
    "Deja el móvil lejos 20 minutos",
    "Escribe un resumen de 3 líneas",
    "Revisa cartera, llaves e identificación",
    "Divide una tarea en un siguiente paso",
    "Riega una planta",
    "Haz 20 pasos en el sitio",
    "Limpia un cajón"
  ],
  zh: [
    "喝一杯水",
    "站起来伸展 2 分钟",
    "清理桌面 5 分钟",
    "回复一条重要消息",
    "整理一个文件夹",
    "把垃圾扔掉",
    "洗一个杯子",
    "写下今天最重要的一件事",
    "设置 15 分钟专注计时",
    "做 10 次深呼吸",
    "看一眼日程表",
    "发一封待发送邮件",
    "把衣服放回柜子",
    "收纳充电线",
    "把床铺整理一下",
    "给自己准备一个小奖励",
    "删除 5 个无用截图",
    "清理浏览器标签页",
    "把手机放远 20 分钟",
    "写 3 行今天的总结",
    "检查钱包/钥匙/证件",
    "把待办拆成下一步动作",
    "给植物浇水",
    "做 20 次原地踏步",
    "清理一个抽屉"
  ]
};

let activeLang = getLanguage();

function getLanguage() {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  return SUPPORTED_LANGS.includes(saved) ? saved : "en";
}

function setLanguage(lang) {
  if (SUPPORTED_LANGS.includes(lang)) {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }
}

function t(key, vars = {}) {
  const pack = I18N[activeLang] || I18N.en;
  const text = pack[key] || I18N.en[key] || key;
  return text.replace(/\{(\w+)\}/g, (_, k) => (Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : `{${k}}`));
}

function applyTranslations(page) {
  document.documentElement.lang = activeLang === "zh" ? "zh-CN" : activeLang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.title = t(node.dataset.i18nTitle);
  });

  if (page === "landing") document.title = t("landing.pageTitle");
  if (page === "todo") document.title = t("todo.pageTitle");
  if (page === "board") document.title = t("board.pageTitle");
  if (page === "calendar") document.title = t("calendar.pageTitle");
}

function initLanguageSelector(page, onChange) {
  const select = document.getElementById("langSelect");
  if (!select) return;
  select.value = activeLang;
  applyTranslations(page);
  select.addEventListener("change", () => {
    activeLang = select.value;
    setLanguage(activeLang);
    applyTranslations(page);
    onChange();
  });
}

function emptyTodoStore() {
  return { en: [], es: [], zh: [] };
}

function normalizeTodoArray(list) {
  return dedupeTexts(Array.isArray(list) ? list : []).slice(0, MAX_TODOS);
}

function readTodoStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyTodoStore();

    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      const legacyStore = emptyTodoStore();
      legacyStore[activeLang] = normalizeTodoArray(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyStore));
      return legacyStore;
    }

    if (parsed && typeof parsed === "object") {
      const store = emptyTodoStore();
      SUPPORTED_LANGS.forEach((lang) => {
        store[lang] = normalizeTodoArray(parsed[lang]);
      });
      return store;
    }

    return emptyTodoStore();
  } catch (_) {
    return emptyTodoStore();
  }
}

function getTodos() {
  const store = readTodoStore();
  return store[activeLang] || [];
}

function setTodos(todos) {
  const store = readTodoStore();
  store[activeLang] = normalizeTodoArray(todos);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function getBoardState() {
  try {
    const raw = localStorage.getItem(BOARD_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function setBoardState(state) {
  localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(state));
}

function clearBoardState() {
  localStorage.removeItem(BOARD_STORAGE_KEY);
}

function getBoardSizePref() {
  const size = Number(localStorage.getItem(BOARD_SIZE_KEY));
  return [3, 4, 5].includes(size) ? size : 5;
}

function setBoardSizePref(size) {
  if ([3, 4, 5].includes(size)) {
    localStorage.setItem(BOARD_SIZE_KEY, String(size));
  }
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function dedupeTexts(list) {
  const seen = new Set();
  const output = [];
  list.forEach((item) => {
    const text = String(item || "").trim();
    if (!text || seen.has(text)) return;
    seen.add(text);
    output.push(text);
  });
  return output;
}

function randomPool() {
  return RANDOM_POOL[activeLang] || RANDOM_POOL.en;
}

function pickRandomUnique(source, n, exclude = []) {
  const blocked = new Set(exclude);
  const pool = source.filter((item) => !blocked.has(item));
  return shuffle(pool).slice(0, n);
}

async function apiRequest(path, options = {}) {
  try {
    const response = await fetch(path, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include"
    });

    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      data = null;
    }

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data && data.error ? data.error : "request_failed"
      };
    }

    return { ok: true, status: response.status, data };
  } catch (_) {
    return { ok: false, status: 0, error: "network_error" };
  }
}

function localDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function localeForLang() {
  if (activeLang === "zh") return "zh-CN";
  if (activeLang === "es") return "es-ES";
  return "en-US";
}

function weekdayNames() {
  if (activeLang === "zh") return ["日", "一", "二", "三", "四", "五", "六"];
  if (activeLang === "es") return ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
}

let sharedAudioContext = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedAudioContext) {
    sharedAudioContext = new Ctx();
  }
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

function scheduleTone(ctx, { freq, at, duration = 0.09, volume = 0.05, type = "sine" }) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, at);

  gainNode.gain.setValueAtTime(0.0001, at);
  gainNode.gain.exponentialRampToValueAtTime(volume, at + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, at + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(at);
  oscillator.stop(at + duration + 0.03);
}

function playTaskDoneSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const start = ctx.currentTime + 0.01;
  scheduleTone(ctx, { freq: 1046.5, at: start, duration: 0.08, volume: 0.05, type: "triangle" });
  scheduleTone(ctx, { freq: 1318.5, at: start + 0.05, duration: 0.1, volume: 0.04, type: "sine" });
}

function playBingoSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const start = ctx.currentTime + 0.01;
  const notes = [659.25, 783.99, 987.77, 1318.5];
  notes.forEach((freq, index) => {
    scheduleTone(ctx, {
      freq,
      at: start + index * 0.09,
      duration: 0.16,
      volume: index === notes.length - 1 ? 0.07 : 0.05,
      type: "triangle"
    });
  });
}

function initAuth(onUpdate = () => {}) {
  const emailInput = document.getElementById("authEmail");
  const codeInput = document.getElementById("authPassword");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const loggedOut = document.getElementById("authLoggedOut");
  const loggedIn = document.getElementById("authLoggedIn");
  const externalLinks = document.getElementById("authExternalLinks");
  const userEmail = document.getElementById("authUserEmail");
  const todayBadge = document.getElementById("todayBingoBadge");
  const message = document.getElementById("authMessage");

  if (!emailInput || !codeInput || !loginBtn || !registerBtn || !logoutBtn || !loggedOut || !loggedIn || !userEmail || !todayBadge || !message) {
    return {
      render: () => {},
      isLoggedIn: () => false,
      getTodayCount: () => 0,
      request: async () => ({ ok: false, status: 401, error: "unauthorized" }),
      incrementTodayBingo: async () => false
    };
  }

  const state = {
    user: null,
    todayCount: 0,
    messageKey: "",
    messageCustom: "",
    messageError: false
  };
  let supabaseClient = null;
  let accessToken = "";

  function showMessage({ key = "", custom = "", isError = false }) {
    state.messageKey = key;
    state.messageCustom = custom;
    state.messageError = isError;
    render();
  }

  function render() {
    const logged = Boolean(state.user);
    loggedOut.classList.toggle("hidden", logged);
    loggedIn.classList.toggle("hidden", !logged);
    if (externalLinks) {
      externalLinks.classList.toggle("hidden", logged);
    }

    userEmail.textContent = logged ? state.user.email : "";
    todayBadge.textContent = t("auth.todayCount", { count: state.todayCount });

    if (state.messageCustom) {
      message.textContent = state.messageCustom;
    } else if (state.messageKey) {
      message.textContent = t(state.messageKey);
    } else {
      message.textContent = "";
    }
    message.style.color = state.messageError ? "#b05f5f" : "#8ca08d";
  }

  function notifyUpdate() {
    onUpdate();
  }

  function validateEmail() {
    const email = emailInput.value.trim().toLowerCase();
    const emailValid = /^\S+@\S+\.\S+$/.test(email);
    if (!emailValid) {
      showMessage({ key: "auth.invalidInput", isError: true });
      return null;
    }
    return email;
  }

  function validateCode() {
    const code = codeInput.value.trim();
    const codeValid = /^\d{6}$/.test(code);
    if (!codeValid) {
      showMessage({ key: "auth.invalidCode", isError: true });
      return null;
    }
    return code;
  }

  function mapSupabaseError(error, { isRegister = false } = {}) {
    const msg = String(error && error.message ? error.message : "").toLowerCase();
    if (!msg) return "auth.unknownError";
    if (msg.includes("invalid login credentials")) return "auth.badCreds";
    if (msg.includes("token") && msg.includes("invalid")) return "auth.invalidCode";
    if (msg.includes("otp")) return "auth.invalidCode";
    if (msg.includes("code challenge")) return "auth.invalidCode";
    if (msg.includes("user already registered")) return "auth.emailExists";
    if (msg.includes("email not confirmed")) return "auth.checkEmail";
    if (msg.includes("network")) return "auth.serverOffline";
    if (isRegister && msg.includes("already")) return "auth.emailExists";
    return "auth.unknownError";
  }

  async function authedRequest(path, options = {}) {
    if (!accessToken) {
      return { ok: false, status: 401, error: "unauthorized" };
    }
    return apiRequest(path, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`
      }
    });
  }

  async function refreshTodayCount() {
    if (!state.user) {
      state.todayCount = 0;
      render();
      notifyUpdate();
      return;
    }

    const result = await authedRequest(`/api/stats/today?date=${encodeURIComponent(localDateKey())}`);
    if (!result.ok) {
      if (result.status === 0) {
        showMessage({ key: "auth.serverOffline", isError: true });
      }
      if (result.status === 401) {
        state.user = null;
        state.todayCount = 0;
      }
      render();
      notifyUpdate();
      return;
    }

    state.todayCount = Number(result.data && result.data.count ? result.data.count : 0);
    if (state.messageError) {
      state.messageKey = "";
      state.messageCustom = "";
      state.messageError = false;
    }
    render();
    notifyUpdate();
  }

  async function applySession(session) {
    accessToken = session && typeof session.access_token === "string" ? session.access_token : "";
    state.user = session && session.user
      ? {
          id: String(session.user.id || ""),
          email: String(session.user.email || "")
        }
      : null;
    await refreshTodayCount();
  }

  async function initSupabaseClient() {
    const cfg = await apiRequest("/api/config");
    if (!cfg.ok) {
      showMessage({ key: "auth.serverOffline", isError: true });
      return;
    }

    const supabaseUrl = String((cfg.data && cfg.data.supabaseUrl) || "");
    const supabaseAnonKey = String((cfg.data && cfg.data.supabaseAnonKey) || "");

    if (!supabaseUrl || !supabaseAnonKey) {
      showMessage({ key: "auth.supabaseNotConfigured", isError: true });
      return;
    }
    if (supabaseAnonKey.startsWith("sb_secret_")) {
      showMessage({ key: "auth.usePublishableKey", isError: true });
      return;
    }
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      showMessage({ key: "auth.libMissing", isError: true });
      return;
    }

    supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

    const sessionResp = await supabaseClient.auth.getSession();
    if (sessionResp.error) {
      showMessage({ key: "auth.unknownError", isError: true });
      return;
    }

    await applySession(sessionResp.data ? sessionResp.data.session : null);
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });
  }

  loginBtn.addEventListener("click", async () => {
    const email = validateEmail();
    if (!email) return;
    if (!supabaseClient) {
      showMessage({ key: "auth.supabaseNotConfigured", isError: true });
      return;
    }

    const result = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true
      }
    });

    if (result.error) {
      showMessage({ key: mapSupabaseError(result.error), isError: true });
      return;
    }

    state.messageKey = "auth.codeSent";
    state.messageCustom = "";
    state.messageError = false;
    codeInput.value = "";
    render();
    notifyUpdate();
  });

  registerBtn.addEventListener("click", async () => {
    const email = validateEmail();
    if (!email) return;
    const code = validateCode();
    if (!code) return;
    if (!supabaseClient) {
      showMessage({ key: "auth.supabaseNotConfigured", isError: true });
      return;
    }

    const result = await supabaseClient.auth.verifyOtp({
      email,
      token: code,
      type: "email"
    });

    if (result.error) {
      showMessage({ key: mapSupabaseError(result.error, { isRegister: true }), isError: true });
      return;
    }

    await applySession(result.data ? result.data.session : null);
    state.messageKey = "auth.registerSuccess";
    state.messageCustom = "";
    state.messageError = false;
    codeInput.value = "";
    render();
    notifyUpdate();
  });

  logoutBtn.addEventListener("click", async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    accessToken = "";
    state.user = null;
    state.todayCount = 0;
    showMessage({ key: "auth.logoutSuccess" });
    notifyUpdate();
  });

  codeInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      registerBtn.click();
    }
  });

  emailInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loginBtn.click();
    }
  });

  void initSupabaseClient();
  render();

  return {
    render,
    isLoggedIn: () => Boolean(state.user),
    getTodayCount: () => Number(state.todayCount || 0),
    request: authedRequest,
    incrementTodayBingo: async (amount = 1) => {
      if (!state.user) return false;
      const safeAmount = Number.isInteger(amount) && amount > 0 ? Math.min(amount, 100) : 1;
      const result = await authedRequest("/api/stats/increment", {
        method: "POST",
        body: { date: localDateKey(), amount: safeAmount }
      });
      if (!result.ok) {
        if (result.status === 0) {
          showMessage({ key: "auth.serverOffline", isError: true });
        }
        return false;
      }
      state.todayCount = Number(result.data.count || 0);
      render();
      notifyUpdate();
      return true;
    }
  };
}

function initTodoPage() {
  const todoInput = document.getElementById("todoInput");
  const addBtn = document.getElementById("addTodoBtn");
  const randomBtn = document.getElementById("randomTodosBtn");
  const clearBtn = document.getElementById("clearTodosBtn");
  const generateBtn = document.getElementById("generateBingoBtn");
  const chipList = document.getElementById("todoChipList");
  const countBadge = document.getElementById("todoCountBadge");
  const sizeSelect = document.getElementById("boardSizeSelect");

  let auth = null;

  function boardCapacity() {
    const size = Number(sizeSelect.value);
    return [3, 4, 5].includes(size) ? size * size : 25;
  }

  function normalizeTodosForSize() {
    const todos = getTodos();
    const max = boardCapacity();
    if (todos.length <= max) return todos;
    const trimmed = todos.slice(0, max);
    setTodos(trimmed);
    clearBoardState();
    return trimmed;
  }

  function updateGenerateState(todoCount) {
    if (!generateBtn) return;
    const needed = boardCapacity();
    const ready = todoCount === needed;
    generateBtn.classList.toggle("disabled", !ready);
    generateBtn.setAttribute("aria-disabled", String(!ready));
    generateBtn.title = ready ? "" : t("todo.needExact", { count: needed });
  }

  function render() {
    const todos = normalizeTodosForSize();
    const needed = boardCapacity();
    countBadge.textContent = t("todo.countBadge", { count: todos.length, max: needed });
    updateGenerateState(todos.length);
    chipList.innerHTML = "";

    if (todos.length === 0) {
      const li = document.createElement("li");
      li.className = "subtle";
      li.textContent = t("todo.empty");
      chipList.appendChild(li);
      return;
    }

    todos.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = "chip";

      const text = document.createElement("span");
      text.textContent = task;

      const removeBtn = document.createElement("button");
      removeBtn.className = "chip-remove";
      removeBtn.type = "button";
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", t("todo.removeAria"));
      removeBtn.addEventListener("click", () => {
        const next = getTodos();
        next.splice(index, 1);
        setTodos(next);
        clearBoardState();
        render();
      });

      li.appendChild(text);
      li.appendChild(removeBtn);
      chipList.appendChild(li);
    });
  }

  function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;
    const todos = getTodos();
    if (todos.length >= boardCapacity()) return;
    todos.push(text);
    setTodos(todos);
    clearBoardState();
    todoInput.value = "";
    render();
  }

  addBtn.addEventListener("click", addTodo);
  todoInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTodo();
  });

  randomBtn.addEventListener("click", () => {
    const todos = getTodos();
    const room = Math.max(0, boardCapacity() - todos.length);
    if (room === 0) return;
    const picks = pickRandomUnique(randomPool(), Math.min(5, room), todos);
    setTodos(todos.concat(picks));
    clearBoardState();
    render();
  });

  clearBtn.addEventListener("click", () => {
    setTodos([]);
    clearBoardState();
    render();
  });

  sizeSelect.value = String(getBoardSizePref());
  sizeSelect.addEventListener("change", () => {
    const size = Number(sizeSelect.value);
    setBoardSizePref(size);
    normalizeTodosForSize();
    clearBoardState();
    render();
  });

  if (generateBtn) {
    generateBtn.addEventListener("click", (event) => {
      const needed = boardCapacity();
      const todos = getTodos();
      if (todos.length !== needed) {
        event.preventDefault();
        window.alert(t("todo.needExact", { count: needed }));
        return;
      }
      clearBoardState();
    });
  }

  initLanguageSelector("todo", () => {
    render();
    if (auth) auth.render();
  });

  auth = initAuth(() => {
    if (auth) auth.render();
  });

  render();
}

function initLandingPage() {
  let auth = null;

  initLanguageSelector("landing", () => {
    if (auth) auth.render();
  });

  auth = initAuth(() => {
    if (auth) auth.render();
  });
}

function initBoardPage() {
  const sizeSelect = document.getElementById("boardSize");
  const applySizeBtn = document.getElementById("generateBoardBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const randomBtn = document.getElementById("randomBoardBtn");
  const restartBtn = document.getElementById("restartBtn");
  const boardEl = document.getElementById("board");
  const boardInfo = document.getElementById("boardInfo");
  const boardHint = document.getElementById("boardHint");
  const boardProgress = document.getElementById("boardProgress");
  const boardTodayInline = document.getElementById("boardTodayInline");
  const bingoMessage = document.getElementById("bingoMessage");
  const celebration = document.getElementById("celebration");
  const confettiLayer = document.getElementById("confettiLayer");

  let auth = null;
  let boardSize = getBoardSizePref();
  let cells = [];
  let hintKey = "";
  let awardedLineIds = [];
  let pendingIncrementCount = 0;
  let lastBingoKey = "";
  let celebrationTimerId = null;
  let incrementSyncInFlight = false;

  function renderTodayInline() {
    if (!boardTodayInline) return;
    const count = auth ? auth.getTodayCount() : 0;
    boardTodayInline.textContent = t("board.todayInline", { count });
  }

  function isValidBoardState(state) {
    if (!state || typeof state !== "object") return false;
    if (typeof state.lang !== "string") return false;
    if (![3, 4, 5].includes(state.size)) return false;
    if (!Array.isArray(state.cells) || state.cells.length !== state.size * state.size) return false;
    if (state.awardedLineIds !== undefined && !Array.isArray(state.awardedLineIds)) return false;
    if (state.pendingIncrementCount !== undefined && (!Number.isInteger(state.pendingIncrementCount) || state.pendingIncrementCount < 0)) {
      return false;
    }
    return state.cells.every((cell) => cell && typeof cell.text === "string" && typeof cell.done === "boolean");
  }

  function persistBoard() {
    setBoardState({
      lang: activeLang,
      size: boardSize,
      cells,
      hintKey,
      awardedLineIds,
      pendingIncrementCount
    });
    setBoardSizePref(boardSize);
  }

  function fillTexts(baseTexts, needCount) {
    const merged = [...dedupeTexts(baseTexts)];
    const needMore = needCount - merged.length;
    if (needMore > 0) {
      merged.push(...pickRandomUnique(randomPool(), needMore, merged));
    }
    let idx = 1;
    while (merged.length < needCount) {
      merged.push(t("common.randomTask", { index: idx }));
      idx += 1;
    }
    return shuffle(merged).slice(0, needCount);
  }

  function buildAllLines() {
    const lines = [];

    for (let row = 0; row < boardSize; row += 1) {
      const indexes = [];
      for (let col = 0; col < boardSize; col += 1) {
        indexes.push(row * boardSize + col);
      }
      lines.push({ id: `r${row + 1}`, type: "row", order: row + 1, indexes });
    }

    for (let col = 0; col < boardSize; col += 1) {
      const indexes = [];
      for (let row = 0; row < boardSize; row += 1) {
        indexes.push(row * boardSize + col);
      }
      lines.push({ id: `c${col + 1}`, type: "col", order: col + 1, indexes });
    }

    const diag1 = [];
    const diag2 = [];
    for (let i = 0; i < boardSize; i += 1) {
      diag1.push(i * boardSize + i);
      diag2.push(i * boardSize + (boardSize - 1 - i));
    }
    lines.push({ id: "d1", type: "diag", order: 1, indexes: diag1 });
    lines.push({ id: "d2", type: "diag", order: 2, indexes: diag2 });

    return lines;
  }

  function getCompletedLines() {
    return buildAllLines().filter((line) => line.indexes.every((index) => cells[index].done));
  }

  function launchCanvasConfetti() {
    if (typeof window.confetti !== "function") return false;
    const colors = ["#c7c4ba", "#9faf88", "#5e885b", "#3f6747", "#355845", "#7a9275"];

    window.confetti({
      particleCount: 120,
      spread: 90,
      startVelocity: 36,
      gravity: 0.95,
      scalar: 1.02,
      origin: { x: 0.5, y: 0.2 },
      colors
    });

    window.confetti({
      particleCount: 70,
      angle: 60,
      spread: 65,
      startVelocity: 38,
      gravity: 0.95,
      scalar: 0.95,
      origin: { x: 0, y: 0.72 },
      colors
    });

    window.confetti({
      particleCount: 70,
      angle: 120,
      spread: 65,
      startVelocity: 38,
      gravity: 0.95,
      scalar: 0.95,
      origin: { x: 1, y: 0.72 },
      colors
    });

    return true;
  }

  function launchCelebration() {
    playBingoSound();
    if (!celebration) return;

    const usedCanvas = launchCanvasConfetti();
    if (!usedCanvas && confettiLayer) {
      const colors = ["#c7c4ba", "#9faf88", "#5e885b", "#3f6747", "#355845", "#7a9275"];
      confettiLayer.innerHTML = "";

      for (let i = 0; i < 120; i += 1) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = `${1.8 + Math.random() * 1.8}s`;
        piece.style.animationDelay = `${Math.random() * 0.35}s`;
        confettiLayer.appendChild(piece);
      }
    }

    celebration.classList.add("active");
    if (celebrationTimerId) window.clearTimeout(celebrationTimerId);
    celebrationTimerId = window.setTimeout(() => {
      celebration.classList.remove("active");
      if (confettiLayer) confettiLayer.innerHTML = "";
    }, 2600);
  }

  function formatLineLabel(line) {
    if (line.type === "row") {
      if (activeLang === "zh") return `横${line.order}`;
      if (activeLang === "es") return `Fila ${line.order}`;
      return `Row ${line.order}`;
    }

    if (line.type === "col") {
      if (activeLang === "zh") return `竖${line.order}`;
      if (activeLang === "es") return `Columna ${line.order}`;
      return `Column ${line.order}`;
    }

    if (activeLang === "zh") return line.order === 1 ? "主斜线" : "副斜线";
    if (activeLang === "es") return line.order === 1 ? "Diagonal 1" : "Diagonal 2";
    return line.order === 1 ? "Diagonal 1" : "Diagonal 2";
  }

  async function flushPendingIncrements() {
    if (incrementSyncInFlight) return;
    if (!auth || !auth.isLoggedIn()) return;
    if (pendingIncrementCount <= 0) return;

    incrementSyncInFlight = true;
    try {
      while (auth && auth.isLoggedIn() && pendingIncrementCount > 0) {
        const amount = pendingIncrementCount;
        const ok = await auth.incrementTodayBingo(amount);
        if (!ok) break;
        pendingIncrementCount -= amount;
        persistBoard();
      }
    } finally {
      incrementSyncInFlight = false;
    }
  }

  async function handleBingoState(hitLineIds) {
    if (hitLineIds.length === 0) {
      lastBingoKey = "";
      return;
    }

    const known = new Set(awardedLineIds);
    const newLineIds = hitLineIds.filter((id) => !known.has(id));
    if (newLineIds.length === 0) {
      return;
    }

    const key = `${boardSize}:${newLineIds.join(",")}`;
    if (key !== lastBingoKey) {
      lastBingoKey = key;
      launchCelebration();
    }

    awardedLineIds = Array.from(new Set([...awardedLineIds, ...newLineIds]));
    pendingIncrementCount += newLineIds.length;
    persistBoard();
    await flushPendingIncrements();
  }

  function renderBoard() {
    const completedLines = getCompletedLines();
    const activeLineIds = completedLines.map((line) => line.id);
    const activeLineLabels = completedLines.map((line) => formatLineLabel(line));
    const highlightedCellSet = new Set(completedLines.flatMap((line) => line.indexes));
    const doneCount = cells.filter((cell) => cell.done).length;

    boardEl.innerHTML = "";
    boardEl.style.gridTemplateColumns = `repeat(${boardSize}, minmax(0, 1fr))`;

    boardInfo.textContent = t("board.info", { size: boardSize, count: cells.length });
    boardHint.textContent = hintKey ? t(hintKey) : "";
    boardProgress.textContent = t("board.progress", { done: doneCount, total: cells.length });
    renderTodayInline();
    bingoMessage.textContent = activeLineLabels.length > 0
      ? t("board.bingoRow", { rows: activeLang === "zh" ? activeLineLabels.join("、") : activeLineLabels.join(", ") })
      : "";

    cells.forEach((cell, index) => {
      const button = document.createElement("button");
      button.className = "board-cell";
      button.type = "button";
      button.textContent = cell.text;
      if (cell.done) button.classList.add("done");
      if (highlightedCellSet.has(index)) {
        button.classList.add("bingo-row");
      }

      button.addEventListener("click", () => {
        cells[index].done = !cells[index].done;
        if (cells[index].done) {
          playTaskDoneSound();
        }
        persistBoard();
        renderBoard();
      });

      boardEl.appendChild(button);
    });

    void handleBingoState(activeLineIds);
  }

  function generateFromTodos() {
    boardSize = Number(sizeSelect.value);
    const need = boardSize * boardSize;
    const todos = dedupeTexts(getTodos()).slice(0, need);

    let texts = [];
    if (todos.length < need) {
      texts = [...todos];
      let index = 1;
      while (texts.length < need) {
        texts.push(t("common.randomTask", { index }));
        index += 1;
      }
      hintKey = "board.hint.mixed";
    } else {
      texts = todos;
      hintKey = "board.hint.todoOnly";
    }

    cells = texts.map((text) => ({ text, done: false }));
    awardedLineIds = [];
    pendingIncrementCount = 0;
    lastBingoKey = "";
    persistBoard();
    renderBoard();
  }

  function shuffleCurrentTasks() {
    boardSize = Number(sizeSelect.value);
    const need = boardSize * boardSize;
    const texts = fillTexts(cells.map((cell) => cell.text), need);
    cells = texts.map((text) => ({ text, done: false }));
    hintKey = "board.hint.shuffleRestart";
    awardedLineIds = [];
    pendingIncrementCount = 0;
    lastBingoKey = "";
    persistBoard();
    renderBoard();
  }

  function generateRandomTasks() {
    boardSize = Number(sizeSelect.value);
    const need = boardSize * boardSize;
    const source = dedupeTexts([...getTodos(), ...randomPool()]);
    const texts = fillTexts(source, need);
    cells = texts.map((text) => ({ text, done: false }));
    hintKey = "board.hint.randomRestart";
    awardedLineIds = [];
    pendingIncrementCount = 0;
    lastBingoKey = "";
    persistBoard();
    renderBoard();
  }

  function restartBoard() {
    const ok = window.confirm(t("board.restartConfirm"));
    if (!ok) return;
    clearBoardState();
    generateFromTodos();
  }

  function loadBoardState() {
    const state = getBoardState();
    if (!isValidBoardState(state)) return false;
    if (state.lang !== activeLang) return false;
    boardSize = state.size;
    cells = state.cells;
    hintKey = typeof state.hintKey === "string" ? state.hintKey : "";
    if (Array.isArray(state.awardedLineIds)) {
      awardedLineIds = state.awardedLineIds.filter((id) => typeof id === "string");
    } else if (state.bingoLogged) {
      awardedLineIds = getCompletedLines().map((line) => line.id);
    } else if (state.awardedLineIds === undefined) {
      awardedLineIds = getCompletedLines().map((line) => line.id);
    } else {
      awardedLineIds = [];
    }
    pendingIncrementCount = Number.isInteger(state.pendingIncrementCount) && state.pendingIncrementCount > 0
      ? state.pendingIncrementCount
      : 0;
    sizeSelect.value = String(boardSize);
    return true;
  }

  sizeSelect.value = String(boardSize);
  applySizeBtn.addEventListener("click", generateFromTodos);
  shuffleBtn.addEventListener("click", shuffleCurrentTasks);
  randomBtn.addEventListener("click", generateRandomTasks);
  restartBtn.addEventListener("click", restartBoard);

  initLanguageSelector("board", () => {
    renderTodayInline();
    if (!loadBoardState()) {
      generateFromTodos();
      return;
    }
    renderBoard();
    if (auth) auth.render();
  });

  auth = initAuth(() => {
    if (auth) auth.render();
    void flushPendingIncrements();
    renderTodayInline();
  });

  if (!loadBoardState()) {
    generateFromTodos();
    return;
  }

  renderBoard();
  void flushPendingIncrements();
}

function initCalendarPage() {
  const monthLabel = document.getElementById("calendarMonthLabel");
  const prevBtn = document.getElementById("calendarPrevBtn");
  const nextBtn = document.getElementById("calendarNextBtn");
  const grid = document.getElementById("calendarGrid");
  const summary = document.getElementById("calendarSummary");
  const totalAll = document.getElementById("calendarTotalAll");
  const currentStreak = document.getElementById("calendarCurrentStreak");
  const bestStreak = document.getElementById("calendarBestStreak");
  const heatMonths = document.getElementById("yearHeatmapMonths");
  const heatGrid = document.getElementById("yearHeatmapGrid");
  const heatHint = document.getElementById("yearHeatmapHint");

  if (!monthLabel || !prevBtn || !nextBtn || !grid || !summary || !totalAll || !currentStreak || !bestStreak || !heatMonths || !heatGrid || !heatHint) {
    return;
  }

  let auth = null;
  const now = new Date();
  let viewYear = now.getFullYear();
  let viewMonth = now.getMonth() + 1;
  const DAY_MS = 24 * 60 * 60 * 1000;

  function monthLabelText() {
    return new Intl.DateTimeFormat(localeForLang(), { year: "numeric", month: "long" })
      .format(new Date(viewYear, viewMonth - 1, 1));
  }

  function pad2(v) {
    return String(v).padStart(2, "0");
  }

  function dateKeyFromDate(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function toDateKey(day) {
    return `${viewYear}-${pad2(viewMonth)}-${pad2(day)}`;
  }

  function clearCalendarGrid() {
    grid.innerHTML = "";
  }

  function renderHeaders() {
    weekdayNames().forEach((name) => {
      const cell = document.createElement("div");
      cell.className = "calendar-weekday";
      cell.textContent = name;
      grid.appendChild(cell);
    });
  }

  function renderEmptyMonth() {
    clearCalendarGrid();
    renderHeaders();
    const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth, 0).getDate();
    for (let i = 0; i < firstDay; i += 1) {
      const blank = document.createElement("div");
      blank.className = "calendar-cell blank";
      grid.appendChild(blank);
    }
    for (let day = 1; day <= totalDays; day += 1) {
      const cell = document.createElement("div");
      cell.className = "calendar-cell";
      const dayNum = document.createElement("div");
      dayNum.className = "day-num";
      dayNum.textContent = String(day);
      const count = document.createElement("div");
      count.className = "day-count";
      count.textContent = t("calendar.dayCount", { count: 0 });
      cell.appendChild(dayNum);
      cell.appendChild(count);
      grid.appendChild(cell);
    }
  }

  function setOverviewStats(data = {}) {
    const total = Number(data.totalAllTime || 0);
    const current = Number(data.currentStreak || 0);
    const longest = Number(data.longestStreak || 0);
    totalAll.textContent = String(total);
    currentStreak.textContent = t("calendar.daysUnit", { count: current });
    bestStreak.textContent = t("calendar.daysUnit", { count: longest });
  }

  function intensityLevel(count) {
    if (count <= 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  }

  function renderYearHeatmap(year, rows) {
    const countMap = new Map((Array.isArray(rows) ? rows : []).map((item) => [String(item.date), Number(item.count || 0)]));
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    const gridStart = new Date(yearStart);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());
    const gridEnd = new Date(yearEnd);
    gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()));

    const totalDays = Math.round((gridEnd.getTime() - gridStart.getTime()) / DAY_MS) + 1;
    const weeks = Math.ceil(totalDays / 7);

    heatMonths.innerHTML = "";
    heatMonths.style.gridTemplateColumns = `repeat(${weeks}, 12px)`;
    const monthLabels = Array(weeks).fill("");
    for (let month = 0; month < 12; month += 1) {
      const firstDay = new Date(year, month, 1);
      const weekIndex = Math.floor((firstDay.getTime() - gridStart.getTime()) / DAY_MS / 7);
      if (weekIndex >= 0 && weekIndex < weeks && !monthLabels[weekIndex]) {
        monthLabels[weekIndex] = new Intl.DateTimeFormat(localeForLang(), { month: "short" }).format(firstDay);
      }
    }
    monthLabels.forEach((label) => {
      const monthEl = document.createElement("span");
      monthEl.textContent = label;
      heatMonths.appendChild(monthEl);
    });

    heatGrid.innerHTML = "";
    heatGrid.style.gridTemplateColumns = `repeat(${weeks}, 12px)`;
    const todayKey = localDateKey();
    let activeDays = 0;

    for (let offset = 0; offset < totalDays; offset += 1) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + offset);
      const dateKey = dateKeyFromDate(d);
      const value = countMap.get(dateKey) || 0;
      if (value > 0 && d.getFullYear() === year) activeDays += 1;

      const cell = document.createElement("div");
      cell.className = "heat-cell";
      const level = intensityLevel(value);
      if (level > 0) {
        cell.classList.add(`level-${level}`);
      }
      if (d.getFullYear() !== year) {
        cell.classList.add("out-year");
      }
      if (dateKey === todayKey) {
        cell.classList.add("today");
      }
      cell.title = `${dateKey}: ${t("calendar.dayCount", { count: value })}`;
      heatGrid.appendChild(cell);
    }

    heatHint.textContent = activeDays > 0 ? "" : t("calendar.heatEmpty");
  }

  function dateKeyToUtcMs(dateKey) {
    const parts = String(dateKey).split("-");
    if (parts.length !== 3) return NaN;
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = Number(parts[2]);
    if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return NaN;
    return Date.UTC(y, m - 1, d);
  }

  function utcMsToDateKey(ms) {
    const dt = new Date(ms);
    return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
  }

  function computeLongestStreak(dateKeysSorted) {
    if (!Array.isArray(dateKeysSorted) || dateKeysSorted.length === 0) return 0;
    let longest = 1;
    let current = 1;

    for (let i = 1; i < dateKeysSorted.length; i += 1) {
      const prev = dateKeyToUtcMs(dateKeysSorted[i - 1]);
      const curr = dateKeyToUtcMs(dateKeysSorted[i]);
      if (!Number.isFinite(prev) || !Number.isFinite(curr)) continue;
      if (curr - prev === DAY_MS) {
        current += 1;
        if (current > longest) longest = current;
      } else if (curr !== prev) {
        current = 1;
      }
    }

    return longest;
  }

  function computeCurrentStreak(dateSet, todayKey) {
    if (!dateSet || dateSet.size === 0) return 0;
    let streak = 0;
    let cursor = todayKey;
    while (dateSet.has(cursor)) {
      streak += 1;
      cursor = utcMsToDateKey(dateKeyToUtcMs(cursor) - DAY_MS);
    }
    return streak;
  }

  async function loadOverviewFallbackByYear(year) {
    const requests = [];
    for (let m = 1; m <= 12; m += 1) {
      requests.push(auth.request(`/api/stats/calendar?year=${year}&month=${m}`));
    }
    const responses = await Promise.all(requests);
    if (responses.some((resp) => !resp.ok)) return null;

    const merged = new Map();
    responses.forEach((resp) => {
      const days = Array.isArray(resp.data && resp.data.days) ? resp.data.days : [];
      days.forEach((day) => {
        const key = String(day.date);
        const value = Number(day.count || 0);
        merged.set(key, (merged.get(key) || 0) + value);
      });
    });

    const rows = Array.from(merged.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const activeKeys = rows.filter((row) => row.count > 0).map((row) => row.date);
    const activeSet = new Set(activeKeys);
    return {
      rows,
      total: rows.reduce((sum, row) => sum + row.count, 0),
      currentStreak: computeCurrentStreak(activeSet, localDateKey()),
      longestStreak: computeLongestStreak(activeKeys)
    };
  }

  async function loadOverview() {
    if (!auth || !auth.isLoggedIn()) {
      setOverviewStats();
      renderYearHeatmap(viewYear, []);
      heatHint.textContent = t("calendar.loginHint");
      return;
    }

    const result = await auth.request(`/api/stats/overview?year=${viewYear}`);
    if (!result.ok) {
      if (result.status === 401) {
        setOverviewStats();
        renderYearHeatmap(viewYear, []);
        heatHint.textContent = t("calendar.loginHint");
        return;
      }
      const fallback = await loadOverviewFallbackByYear(viewYear);
      if (fallback) {
        setOverviewStats({
          totalAllTime: fallback.total,
          currentStreak: fallback.currentStreak,
          longestStreak: fallback.longestStreak
        });
        renderYearHeatmap(viewYear, fallback.rows);
        heatHint.textContent = "";
        return;
      }
      setOverviewStats();
      renderYearHeatmap(viewYear, []);
      heatHint.textContent = t("auth.serverOffline");
      return;
    }

    setOverviewStats({
      totalAllTime: Number(result.data.totalAllTime || 0),
      currentStreak: Number(result.data.currentStreak || 0),
      longestStreak: Number(result.data.longestStreak || 0)
    });
    renderYearHeatmap(viewYear, Array.isArray(result.data.days) ? result.data.days : []);
  }

  async function loadMonth() {
    monthLabel.textContent = monthLabelText();

    if (!auth || !auth.isLoggedIn()) {
      renderEmptyMonth();
      summary.textContent = t("calendar.loginHint");
      await loadOverview();
      return;
    }

    const result = await auth.request(`/api/stats/calendar?year=${viewYear}&month=${viewMonth}`);
    if (!result.ok) {
      if (result.status === 401) {
        renderEmptyMonth();
        summary.textContent = t("calendar.loginHint");
        await loadOverview();
        return;
      }
      renderEmptyMonth();
      summary.textContent = t("auth.serverOffline");
      await loadOverview();
      return;
    }

    const rows = Array.isArray(result.data.days) ? result.data.days : [];
    const countMap = new Map(rows.map((item) => [String(item.date), Number(item.count || 0)]));
    const monthTotal = Number(result.data.total || 0);

    clearCalendarGrid();
    renderHeaders();

    const firstDay = new Date(viewYear, viewMonth - 1, 1).getDay();
    const totalDays = new Date(viewYear, viewMonth, 0).getDate();

    for (let i = 0; i < firstDay; i += 1) {
      const blank = document.createElement("div");
      blank.className = "calendar-cell blank";
      grid.appendChild(blank);
    }

    const todayKey = localDateKey();
    for (let day = 1; day <= totalDays; day += 1) {
      const key = toDateKey(day);
      const countValue = countMap.get(key) || 0;

      const cell = document.createElement("div");
      cell.className = "calendar-cell";
      if (key === todayKey) cell.classList.add("today");
      if (countValue > 0) cell.classList.add("has-bingo");

      const dayNum = document.createElement("div");
      dayNum.className = "day-num";
      dayNum.textContent = String(day);

      const count = document.createElement("div");
      count.className = "day-count";
      count.textContent = t("calendar.dayCount", { count: countValue });

      cell.appendChild(dayNum);
      cell.appendChild(count);
      grid.appendChild(cell);
    }

    if (monthTotal > 0) {
      summary.textContent = t("calendar.total", { count: monthTotal });
    } else {
      summary.textContent = t("calendar.empty");
    }

    await loadOverview();
  }

  prevBtn.addEventListener("click", () => {
    viewMonth -= 1;
    if (viewMonth < 1) {
      viewMonth = 12;
      viewYear -= 1;
    }
    loadMonth();
  });

  nextBtn.addEventListener("click", () => {
    viewMonth += 1;
    if (viewMonth > 12) {
      viewMonth = 1;
      viewYear += 1;
    }
    loadMonth();
  });

  initLanguageSelector("calendar", () => {
    loadMonth();
    if (auth) auth.render();
  });

  auth = initAuth(() => {
    if (auth) auth.render();
    loadMonth();
  });

  loadMonth();
}

const page = document.body.dataset.page;
if (page === "landing") initLandingPage();
if (page === "todo") initTodoPage();
if (page === "board") initBoardPage();
if (page === "calendar") initCalendarPage();
