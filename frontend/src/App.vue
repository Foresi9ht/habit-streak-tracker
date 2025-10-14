<script setup>
import { ref, computed, watch } from "vue";

/* ---------- DATE UTILS ---------- */
const todayStr = () => new Date().toISOString().slice(0, 10);
const dateToStr = (d) => d.toISOString().slice(0, 10);
const isToday = (iso) => iso === todayStr();
const isYesterday = (iso) => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return iso === dateToStr(d);
};

/* ---------- STORAGE ---------- */
const STORAGE_KEY = "habitQuest.v1";
const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    parsed.habits ??= [];
    parsed.points ??= 0;
    parsed.createdAt ??= new Date().toISOString();
    return parsed;
  } catch {
    return null;
  }
};
const save = (state) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

/* ---------- STATE ---------- */
const state = ref(
  load() ?? {
    habits: [],
    points: 0,
    createdAt: new Date().toISOString(),
  }
);

watch(state, () => save(state.value), { deep: true });

/* ---------- HABITS ---------- */
const newHabit = ref("");

function addHabit() {
  const name = newHabit.value.trim();
  if (!name) return;
  state.value.habits.push({
    id: crypto.randomUUID(),
    name,
    streak: 0,
    lastChecked: null,
    total: 0,
    createdAt: new Date().toISOString(),
  });
  newHabit.value = "";
}

function removeHabit(id) {
  state.value.habits = state.value.habits.filter((h) => h.id !== id);
}

function checkToday(habit) {
  if (habit.lastChecked && isToday(habit.lastChecked)) return;
  if (habit.lastChecked && isYesterday(habit.lastChecked)) {
    habit.streak += 1;
  } else {
    habit.streak = 1;
  }
  habit.lastChecked = todayStr();
  habit.total += 1;

  let gained = 10;
  if (habit.streak === 3) gained += 5;
  if (habit.streak === 7) gained += 10;
  if (habit.streak === 30) gained += 30;
  state.value.points += gained;
}

/* ---------- ACHIEVEMENTS ---------- */
const allAchievements = computed(() => {
  const totalChecks = state.value.habits.reduce((s, h) => s + h.total, 0);
  const bestStreak = state.value.habits.reduce(
    (m, h) => Math.max(m, h.streak),
    0
  );
  const hasFirstCheck = totalChecks >= 1;
  const hasAnyHabit = state.value.habits.length > 0;

  return [
    {
      code: "first-habit",
      title: "First Step",
      desc: "Create your first habit",
      emoji: "🧩",
      unlocked: hasAnyHabit,
    },
    {
      code: "first-check",
      title: "Day One",
      desc: "Complete your first habit check",
      emoji: "✨",
      unlocked: hasFirstCheck,
    },
    {
      code: "streak-3",
      title: "3-Day Streak",
      desc: "Keep it going for 3 days straight",
      emoji: "🔥",
      unlocked: bestStreak >= 3,
    },
    {
      code: "streak-7",
      title: "One Week Warrior",
      desc: "Maintain a 7-day streak",
      emoji: "🏆",
      unlocked: bestStreak >= 7,
    },
    {
      code: "streak-30",
      title: "Iron Will",
      desc: "Hit a 30-day streak",
      emoji: "💎",
      unlocked: bestStreak >= 30,
    },
    {
      code: "checks-30",
      title: "Persistent",
      desc: "Log 30 total check-ins",
      emoji: "📈",
      unlocked: totalChecks >= 30,
    },
    {
      code: "points-200",
      title: "Rising Hero",
      desc: "Earn 200 points",
      emoji: "⭐",
      unlocked: state.value.points >= 200,
    },
  ];
});

const unlockedCount = computed(
  () => allAchievements.value.filter((a) => a.unlocked).length
);

/* ---------- LEVEL SYSTEM ---------- */
const level = computed(() => Math.floor(state.value.points / 100) + 1);
const nextLevelAt = computed(() => level.value * 100);
const progressToNext = computed(() => {
  const base = (level.value - 1) * 100;
  const current = state.value.points - base;
  return Math.max(0, Math.min(100, Math.round((current / 100) * 100)));
});
</script>

<template>
  <div class="app">
    <header class="hero">
      <h1>Habit Quest</h1>
      <p>Track your habits, earn points, unlock achievements</p>
    </header>

    <section class="stats">
      <div class="card">
        <div class="stat">
          <div class="stat__label">Points</div>
          <div class="stat__value">{{ state.points }}</div>
        </div>
        <div class="stat">
          <div class="stat__label">Level</div>
          <div class="stat__value">Lv. {{ level }}</div>
          <div class="progress">
            <div
              class="progress__bar"
              :style="{ width: progressToNext + '%' }"
            ></div>
          </div>
          <div class="muted">Next level at {{ nextLevelAt }} pts</div>
        </div>
        <div class="stat">
          <div class="stat__label">Achievements</div>
          <div class="stat__value">
            {{ unlockedCount }} / {{ allAchievements.length }}
          </div>
        </div>
      </div>
    </section>

    <section class="habits">
      <h2>My Habits</h2>
      <div class="add">
        <input
          v-model="newHabit"
          type="text"
          placeholder="e.g. 10 push-ups, read 15 minutes..."
          @keyup.enter="addHabit"
        />
        <button class="btn" @click="addHabit">Add</button>
      </div>

      <div v-if="!state.habits.length" class="empty">
        Add your first habit and begin your streak! ✨
      </div>

      <ul class="list">
        <li v-for="h in state.habits" :key="h.id" class="habit">
          <div class="habit__left">
            <div class="habit__name">{{ h.name }}</div>
            <div class="habit__meta">
              <span
                >Streak: <b>{{ h.streak }}</b></span
              >
              <span
                >Total: <b>{{ h.total }}</b></span
              >
              <span
                >Last: <b>{{ h.lastChecked ? h.lastChecked : "—" }}</b></span
              >
            </div>
          </div>

          <div class="habit__right">
            <button
              class="btn btn--today"
              :disabled="h.lastChecked && h.lastChecked === todayStr()"
              @click="checkToday(h)"
            >
              {{
                h.lastChecked && h.lastChecked === todayStr()
                  ? "Done Today"
                  : "Mark Done"
              }}
            </button>
            <button class="icon-btn" @click="removeHabit(h.id)" title="Delete">
              🗑️
            </button>
          </div>
        </li>
      </ul>
    </section>

    <section class="achievements">
      <h2>Achievements</h2>
      <div class="grid">
        <div
          v-for="a in allAchievements"
          :key="a.code"
          class="achv"
          :class="{ 'achv--on': a.unlocked }"
        >
          <div class="achv__emoji">{{ a.emoji }}</div>
          <div class="achv__title">{{ a.title }}</div>
          <div class="achv__desc">{{ a.desc }}</div>
          <div class="achv__status">
            {{ a.unlocked ? "Unlocked" : "Locked" }}
          </div>
        </div>
      </div>
    </section>

    <footer class="foot">
      <small>Your data is stored locally in this browser.</small>
    </footer>
  </div>
</template>

<style scoped>
/* same styles as before */
.app {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
    "Helvetica Neue", Arial;
}
.hero {
  text-align: center;
  margin-bottom: 24px;
}
.hero h1 {
  font-size: 28px;
  margin-bottom: 6px;
}
.hero p {
  color: #6b7280;
  margin: 0;
}

.card {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}
.stat__label {
  color: #6b7280;
  font-size: 12px;
}
.stat__value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 4px;
}
.progress {
  height: 8px;
  background: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 8px;
}
.progress__bar {
  height: 100%;
  background: #3b82f6;
}

.habits {
  margin-top: 28px;
}
.habits h2,
.achievements h2 {
  font-size: 20px;
  margin: 0 0 12px;
}
.add {
  display: flex;
  gap: 8px;
}
.add input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  outline: none;
}
.btn {
  padding: 10px 14px;
  border: 1px solid #3b82f6;
  background: #3b82f6;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.icon-btn {
  margin-left: 8px;
  padding: 8px 10px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
}

.list {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  display: grid;
  gap: 10px;
}
.habit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px 14px;
  background: #fff;
}
.habit__name {
  font-weight: 600;
  margin-bottom: 4px;
}
.habit__meta {
  color: #6b7280;
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.achievements {
  margin-top: 32px;
}
.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}
.achv {
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
  padding: 12px;
  background: #fafafa;
  text-align: center;
  transition: 0.2s;
}
.achv--on {
  background: #fff;
  border: 1px solid #d1fae5;
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.12);
}
.achv__emoji {
  font-size: 28px;
}
.achv__title {
  font-weight: 700;
  margin-top: 6px;
}
.achv__desc {
  color: #6b7280;
  font-size: 12px;
  margin-top: 2px;
}
.achv__status {
  margin-top: 8px;
  font-size: 12px;
  color: #059669;
  font-weight: 700;
}

.empty {
  margin-top: 8px;
  padding: 14px;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  color: #6b7280;
}
.foot {
  text-align: center;
  color: #9ca3af;
  margin-top: 36px;
}
</style>
