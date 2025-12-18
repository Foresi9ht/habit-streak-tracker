<script setup>
import Header from ".//Header.vue";
import Footer from "./Footer.vue";
import { ref, computed, watch, onMounted } from "vue";
import HabitQuest from "./HabitQuest.vue";
import MyHabit from "./MyHabit.vue";
import Achievements from "./Achievements.vue";

const todayStr = () => new Date().toISOString().slice(0, 10);
const dateToStr = (d) => d.toISOString().slice(0, 10);
const isToday = (iso) => iso === todayStr();
const isYesterday = (iso) => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return iso === dateToStr(d);
};

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

const state = ref(
  load() ?? {
    habits: [],
    points: 0,
    createdAt: new Date().toISOString(),
  }
);

watch(state, () => save(state.value), { deep: true });

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

const level = computed(() => Math.floor(state.value.points / 100) + 1);
const nextLevelAt = computed(() => level.value * 100);
const progressToNext = computed(() => {
  const base = (level.value - 1) * 100;
  const current = state.value.points - base;
  return Math.max(0, Math.min(100, Math.round((current / 100) * 100)));
});

const modalVisible = ref(false);
const selectedIcon = ref(null);
const newHabitTitle = ref("");

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
  const savedTheme = localStorage.getItem("habitsapp.theme");
  if (savedTheme === "dark") {
    darkMode.value = true;
    document.documentElement.classList.add("dark");
  }
});
</script>

<template>
  <Header />

  <HabitQuest
    :points="state.points"
    :level="level"
    :progress="progressToNext"
    :nextLevelAt="nextLevelAt"
    :unlockedCount="unlockedCount"
    :totalAchievements="allAchievements.length"
    :darkMode="darkMode"
    @toggle-theme="toggleTheme"
  />

  <MyHabit
    :habits="circularHabits"
    :habitIcons="habitIcons"
    :modalVisible="modalVisible"
    :newHabitTitle="newHabitTitle"
    :selectedIcon="selectedIcon"
    @toggle-habit="toggleHabitCompletion"
    @remove-habit="removeHabit"
    @open-modal="openModal"
    @close-modal="closeModal"
    @select-icon="selectIcon"
    @add-habit="addCircularHabit"
    @update:title="newHabitTitle = $event"
  />

  <Achievements :achievements="allAchievements" />

  <Footer />
</template>
