// [DEPRECATED] Simple local server for user management with JSON storage
// ⚠️ שרת מקומי ישן - הוחלף ב-Supabase. קובץ users.json נמחק.
// Prepared for future migration (keep the REST contract stable)

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());

const DB_DIR = path.join(__dirname, "db");
const DB_FILE = path.join(DB_DIR, "users.json"); // ⚠️ קובץ זה נמחק
const WORKOUTS_FILE = path.join(DB_DIR, "workouts.json");

function ensureDb() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2), "utf8");
  }
  if (!fs.existsSync(WORKOUTS_FILE)) {
    fs.writeFileSync(
      WORKOUTS_FILE,
      JSON.stringify({ workouts: [] }, null, 2),
      "utf8"
    );
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_FILE, "utf8");
  try {
    return JSON.parse(raw);
  } catch (_e) {
    // ignore parse error and start fresh
    return { users: [] };
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

function readWorkouts() {
  ensureDb();
  const raw = fs.readFileSync(WORKOUTS_FILE, "utf8");
  try {
    return JSON.parse(raw);
  } catch (_e) {
    return { workouts: [] };
  }
}

function writeWorkouts(data) {
  fs.writeFileSync(WORKOUTS_FILE, JSON.stringify(data, null, 2), "utf8");
}

function genId() {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 7);
  return `u_${ts}_${rnd}`;
}

// Ensure baseline XP for users who completed the questionnaire (idempotent)
function ensureQuestionnaireXpBaseline(user) {
  try {
    const completedAt =
      user?.smartQuestionnaireData?.completedAt ||
      user?.smartQuestionnaireData?.meta?.completedAt;
    if (!completedAt) return false;
    const currentXp = Number(user?.trainingStats?.xp) || 0;
    if (currentXp >= 120) return false;
    user.trainingStats = user.trainingStats || {};
    user.trainingStats.xp = 120;
    if (typeof user.trainingStats.level !== "number") {
      user.trainingStats.level = Math.floor(user.trainingStats.xp / 1000) + 1;
    }
    return true;
  } catch {
    return false;
  }
}

// Health
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "storage-server",
    time: new Date().toISOString(),
  });
});

// Users CRUD
app.get("/users", (_req, res) => {
  const db = readDb();
  let changed = false;
  (db.users || []).forEach((u, i) => {
    if (ensureQuestionnaireXpBaseline(u)) {
      db.users[i] = u;
      changed = true;
    }
  });
  if (changed) writeDb(db);
  res.json(db.users || []);
});

app.get("/users/:id", (req, res) => {
  const db = readDb();
  const idx = (db.users || []).findIndex((u) => u.id === req.params.id);
  const user = idx >= 0 ? db.users[idx] : null;
  if (!user) return res.status(404).json({ error: "User not found" });
  if (ensureQuestionnaireXpBaseline(user)) {
    db.users[idx] = user;
    writeDb(db);
  }
  res.json(user);
});

app.get("/users/by-email/:email", (req, res) => {
  const db = readDb();
  const idx = (db.users || []).findIndex(
    (u) =>
      (u.email || "").toLowerCase() ===
      decodeURIComponent(req.params.email).toLowerCase()
  );
  const user = idx >= 0 ? db.users[idx] : null;
  if (!user) return res.status(404).json({ error: "User not found" });
  if (ensureQuestionnaireXpBaseline(user)) {
    db.users[idx] = user;
    writeDb(db);
  }
  res.json(user);
});

app.post("/users", (req, res) => {
  const { name, email, ...rest } = req.body || {};
  if (!name || !email)
    return res
      .status(400)
      .json({ error: "Missing required fields: name, email" });
  const db = readDb();
  const exists = (db.users || []).some(
    (u) => (u.email || "").toLowerCase() === String(email).toLowerCase()
  );
  if (exists)
    return res
      .status(409)
      .json({ error: "User with this email already exists" });
  const user = { id: genId(), name, email, ...rest };

  // 📈 בונוס XP עבור השלמת שאלון בעת יצירה
  try {
    const completedAt =
      user?.smartQuestionnaireData?.completedAt ||
      user?.smartQuestionnaireData?.meta?.completedAt;
    if (completedAt) {
      user.trainingStats = user.trainingStats || {};
      const baseXp = Number(user.trainingStats.xp) || 0;
      user.trainingStats.xp = baseXp + 120;
      // עדכון רמה בסיסי (כל 1000 XP = רמה)
      const totalXp = user.trainingStats.xp;
      user.trainingStats.level =
        user.trainingStats.level || Math.floor(totalXp / 1000) + 1;
    }
  } catch {
    // ignore bonus errors to keep endpoint robust
  }
  db.users = db.users || [];
  db.users.push(user);
  writeDb(db);
  res.status(201).json(user);
});

app.put("/users/:id", (req, res) => {
  const updates = req.body || {};
  const db = readDb();
  const idx = (db.users || []).findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "User not found" });
  const prev = db.users[idx] || {};
  const updated = { ...prev, ...updates, id: prev.id };

  // 📈 בונוס XP עבור השלמת שאלון בעת עדכון
  try {
    const hadCompleted = !!(
      prev?.smartQuestionnaireData?.completedAt ||
      prev?.smartQuestionnaireData?.meta?.completedAt
    );
    const nowCompleted = !!(
      updated?.smartQuestionnaireData?.completedAt ||
      updated?.smartQuestionnaireData?.meta?.completedAt
    );
    if (!hadCompleted && nowCompleted) {
      updated.trainingStats = updated.trainingStats || {};
      const baseXp = Number(updated.trainingStats.xp) || 0;
      updated.trainingStats.xp = baseXp + 120;
      const totalXp = updated.trainingStats.xp;
      updated.trainingStats.level =
        updated.trainingStats.level || Math.floor(totalXp / 1000) + 1;
    }
  } catch {
    // ignore bonus errors to keep endpoint robust
  }
  db.users[idx] = updated;
  writeDb(db);
  res.json(updated);
});

app.delete("/users/:id", (req, res) => {
  const db = readDb();
  const before = (db.users || []).length;
  db.users = (db.users || []).filter((u) => u.id !== req.params.id);
  if (db.users.length === before)
    return res.status(404).json({ error: "User not found" });
  writeDb(db);
  res.status(204).send();
});

// Workouts per user
app.get("/users/:id/workouts", (req, res) => {
  const wdb = readWorkouts();
  const items = (wdb.workouts || []).filter((w) => w.userId === req.params.id);
  res.json(items);
});

app.post("/users/:id/workouts", (req, res) => {
  const wdb = readWorkouts();
  const userId = req.params.id;
  const payload = req.body || {};
  const id =
    payload.id ||
    `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const workout = { id, userId, ...payload };
  wdb.workouts = wdb.workouts || [];
  wdb.workouts.unshift(workout);
  writeWorkouts(wdb);
  res.status(201).json(workout);
});

app.delete("/users/:id/workouts/:wid", (req, res) => {
  const wdb = readWorkouts();
  const before = (wdb.workouts || []).length;
  wdb.workouts = (wdb.workouts || []).filter(
    (w) => !(w.userId === req.params.id && w.id === req.params.wid)
  );
  if (wdb.workouts.length === before)
    return res.status(404).json({ error: "Workout not found" });
  writeWorkouts(wdb);
  res.status(204).send();
});

app.listen(PORT, () => {
  ensureDb();
  console.warn(`📦 storage-server running on http://localhost:${PORT}`);
});
