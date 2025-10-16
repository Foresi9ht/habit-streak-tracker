<script setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import { ref, computed, watch, onMounted } from "vue";

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

/* ---------- CIRCULAR HABIT TRACKER INTEGRATION ---------- */
const modalVisible = ref(false);
const selectedIcon = ref(null);
const newHabitTitle = ref("");

// Available icons for the circular habit tracker
const habitIcons = [
  {
    id: "book",
    svg: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19.25 5.75C19.25 5.19772 18.8023 4.75 18.25 4.75H14C12.8954 4.75 12 5.64543 12 6.75V19.25L12.8284 18.4216C13.5786 17.6714 14.596 17.25 15.6569 17.25H18.25C18.8023 17.25 19.25 16.8023 19.25 16.25V5.75Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.75 5.75C4.75 5.19772 5.19772 4.75 5.75 4.75H10C11.1046 4.75 12 5.64543 12 6.75V19.25L11.1716 18.4216C10.4214 17.6714 9.40401 17.25 8.34315 17.25H5.75C5.19772 17.25 4.75 16.8023 4.75 16.25V5.75Z"/>',
  },
  {
    id: "call",
    svg: '<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.89286 4.75H6.06818C5.34017 4.75 4.75 5.34017 4.75 6.06818C4.75 13.3483 10.6517 19.25 17.9318 19.25C18.6598 19.25 19.25 18.6598 19.25 17.9318V15.1071L16.1429 13.0357L14.5317 14.6468C14.2519 14.9267 13.8337 15.0137 13.4821 14.8321C12.8858 14.524 11.9181 13.9452 10.9643 13.0357C9.98768 12.1045 9.41548 11.1011 9.12829 10.494C8.96734 10.1537 9.06052 9.76091 9.32669 9.49474L10.9643 7.85714L8.89286 4.75Z"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5.02936C16.4312 5.72562 18.3396 7.65944 19 10.1056"/>',
  },
  {
    id: "camera",
    svg: '<path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M19.25 17.25V9.75C19.25 8.64543 18.3546 7.75 17.25 7.75H16.9167C16.513 7.75 16.1489 7.50726 15.9936 7.13462L15.2564 5.36538C15.1011 4.99274 14.737 4.75 14.3333 4.75H9.66667C9.26297 4.75 8.89886 4.99274 8.74359 5.36538L8.00641 7.13462C7.85114 7.50726 7.48703 7.75 7.08333 7.75H6.75C5.64543 7.75 4.75 8.64543 4.75 9.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25Z"/><path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M15.25 13C15.25 14.7949 13.7949 16.25 12 16.25C10.2051 16.25 8.75 14.7949 8.75 13C8.75 11.2051 10.2051 9.75 12 9.75C13.7949 9.75 15.25 11.2051 15.25 13Z"/>',
  },
];

function openModal() {
  modalVisible.value = true;
}

function closeModal() {
  modalVisible.value = false;
  newHabitTitle.value = "";
  selectedIcon.value = null;
}

function selectIcon(iconId) {
  selectedIcon.value = iconId;
}

function addCircularHabit() {
  const title = newHabitTitle.value.trim();
  const icon = habitIcons.find((i) => i.id === selectedIcon.value);

  if (!title || !icon) return;
  state.value.habits.push({
    id: crypto.randomUUID(),
    name: title,
    streak: 0,
    lastChecked: null,
    total: 0,
    createdAt: new Date().toISOString(),
    icon: icon.svg,
  });

  closeModal();
}

const circularHabits = computed(() => {
  return state.value.habits.map((habit) => ({
    ...habit,
    completed: habit.lastChecked === todayStr(),
  }));
});

function toggleHabitCompletion(habit) {
  if (habit.lastChecked === todayStr()) {
    return;
  }
  checkToday(habit);
}

// Theme functionality
const darkMode = ref(false);

function toggleTheme() {
  darkMode.value = !darkMode.value;
  if (darkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("habitsapp.theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("habitsapp.theme", "light");
  }
}

onMounted(() => {
  // Initialize theme
  const savedTheme = localStorage.getItem("habitsapp.theme");
  if (savedTheme === "dark") {
    darkMode.value = true;
    document.documentElement.classList.add("dark");
  }
});
</script>

<template>
  <Header />
  <router-view></router-view>

  <div class="app">
    <!-- Theme Toggle - Fixed positioning -->
    <div class="theme-container">
      <button class="theme" :class="{ dark: darkMode }" @click="toggleTheme">
        <span class="theme-slider"></span>
      </button>
    </div>

    <div class="hero">
      <div class="header-top">
        <h1>Habit Quest</h1>
      </div>
      <p>Track your habits, earn points, unlock achievements</p>
    </div>

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

    <!-- Circular Habit Tracker Section -->
    <section class="habit-tracker">
      <h2>My Habits</h2>
      <div class="habit-container">
        <div
          v-for="habit in circularHabits"
          :key="habit.id"
          class="habit"
          @contextmenu.prevent="($event) => removeHabit(habit.id)"
        >
          <button
            class="habit-btn"
            :class="{ completed: habit.completed }"
            @click="toggleHabitCompletion(habit)"
            :title="habit.name"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              v-html="habit.icon"
            ></svg>
          </button>
          <div class="habit-name">{{ habit.name }}</div>
          <div class="habit-streak">Streak: {{ habit.streak }}</div>
        </div>

        <div class="new-habit">
          <button class="new-habit__add" @click="openModal">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 5.75V18.25"
              />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M18.25 12L5.75 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Add Habit Modal -->
    <div class="modal-container" :class="{ active: modalVisible }">
      <div class="modal">
        <h2>Add a new habit</h2>
        <input
          type="text"
          v-model="newHabitTitle"
          placeholder="Enter a habit name"
          @keyup.enter="addCircularHabit"
        />
        <div class="icons">
          <button
            v-for="icon in habitIcons"
            :key="icon.id"
            class="icon"
            :class="{ selected: selectedIcon === icon.id }"
            @click="selectIcon(icon.id)"
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              v-html="icon.svg"
            ></svg>
          </button>
        </div>
        <div class="modal-btns">
          <button @click="addCircularHabit">Add Habit</button>
          <button @click="closeModal">Cancel</button>
        </div>
      </div>
    </div>

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
  </div>
  <Footer />
</template>

<style scoped>
/* Your existing Vue styles remain the same */
.app {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
    "Helvetica Neue", Arial;
  position: relative;
}

.hero {
  background-color: white;
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.hero h1 {
  font-size: 28px;
  margin-bottom: 6px;
  margin: 0;
}

.hero p {
  color: #6b7280;
  margin: 0;
  margin-top: 8px;
}

.card {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);
  background: #fff;
  border: 1px solid #000000ff;
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
  background: #fff;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 8px;
}
.progress__bar {
  height: 100%;
  background: #3b82f6;
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

.foot {
  text-align: center;
  color: #9ca3af;
  margin-top: 36px;
}

/* Circular Habit Tracker Styles */
.habit-tracker {
  margin-top: 28px;
  position: relative;
}

.habit-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  padding: 0 0 50px 220px;
  max-width: 500px;
  margin: auto;
  grid-gap: 1rem;
}

.habit {
  display: grid;
  place-items: center;
  text-align: center;
}

.habit-btn {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: white;
  border: 6px solid #125dc8;
  color: #125dc8;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 300ms ease-in-out;
}

.habit-btn:hover {
  opacity: 0.5;
}

.icon:hover {
  opacity: 0.5;
}

.habit-btn.completed {
  background-color: #125dc8;
  color: #000000ff;
}

.habit-btn svg {
  pointer-events: none;
  width: 3rem;
  height: 3rem;
}

.habit-name {
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.habit-streak {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.new-habit__add {
  width: 3rem;
  height: 3rem;
  border-radius: 100px;
  background-color: #125dc8;
  color: white;
  display: grid;
  place-items: center;
  transition: all 300ms ease-in-out;
  cursor: pointer;
  border: none;
  margin: 18px 0 0 0;
}

.modal-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  place-items: center;
  backdrop-filter: blur(10px);
  opacity: 0;
  pointer-events: none;
  z-index: 4;
  transition: all 300ms ease-in-out;
}

.modal-container.active {
  opacity: 1;
  pointer-events: all;
}

.modal {
  border: 3px solid var(--secondary);
  padding: 2rem;
  background-color: var(--primary);
  box-shadow: 1px 4px 30px 10px var(--shadow);
  transform: translateY(30%);
  transition: all 300ms ease-in;
  border-radius: 12px;
}

.modal-container.active .modal {
  transform: translateY(0);
}

.modal h2 {
  text-align: center;
  margin-bottom: 1rem;
  justify-content: center;
}

.modal input {
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  background-color: var(--light);
  padding: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid var(--secondary);
}

.modal input:focus {
  outline: 2px solid var(--secondary);
}

.icons {
  display: grid;
  place-items: center;
  padding: 1.5rem 0;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  grid-gap: 1rem;
}

.icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--secondary);
  border: 4px solid black;
  display: grid;
  place-items: center;
  transition: all 300ms ease-in-out;
  cursor: pointer;
}

.icon.selected {
  background-color: var(--secondary);
  color: var(--primary);
}

.modal-btns {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 0.5rem;
}

.modal-btns button {
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  background-color: var(--light);
  padding: 0.5rem;
  cursor: pointer;
  transition: all 300ms ease-in-out;
  border-radius: 6px;
  border: 1px solid var(--secondary);
}

.modal-btns button:hover {
  color: #000000ff;
  background-color: #125dc8;
}

.theme-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.theme {
  width: 50px;
  height: 24px;
  border-radius: 12px;
  position: relative;
  background-color: #3b82f6;
  cursor: pointer;
  border: none;
  padding: 0;
  display: block;
}

.theme-slider {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 300ms ease-in-out;
}

.theme.dark .theme-slider {
  transform: translateX(26px);
}
:root {
  --primary: #000000ff;
  --secondary: #125dc8;
  --light: #f4f5f5;
  --danger: #d81616;
  --shadow: rgba(8, 47, 102, 0.12);
}

:root.dark {
  --primary: #12223b;
  --secondary: #627da6;
  --light: #003074;
  --danger: #9f0b0b;
  --shadow: rgba(152, 174, 205, 0.05);
}

:root.dark .card {
  background: black;
  border-color: #374151;
  color: #e5e7eb;
}

:root.dark #app {
  background-color: black;
}

:root.dark .stat__label {
  color: white;
}

:root.dark .achv {
  background: black;
  border-color: #374151;
  color: #e5e7eb;
}

:root.dark .achv--on {
  background: #423d22ff;
  border-color: #4b5563;
}

:root.dark .achv__desc {
  color: #9ca3af;
}

:root.dark .hero p {
  color: #9ca3af;
}

:root.dark .habit-streak {
  color: #9ca3af;
}

:root.dark .foot {
  color: #6b7280;
}

:root.dark body {
  background-color: #12223b;
  color: #e5e7eb;
}
</style>
