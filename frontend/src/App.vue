<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import HabitQuest from "./components/HabitQuest.vue";
import MyHabit from "./components/MyHabit.vue";
import Achievements from "./components/Achievements.vue";
import { ref, computed, onMounted } from "vue";
import { useHabitStore } from "./stores/habitStore";
import { useTheme } from "./composables/useTheme";
const { darkMode, toggleTheme } = useTheme();
const habitStore = useHabitStore();
onMounted(() => {
  habitStore.loadFromStorage();
});
const circularHabits = computed(() =>
  habitStore.habits.map((habit) => ({
    ...habit,
    completed: habit.lastChecked === new Date().toISOString().slice(0, 10),
  }))
);
const allAchievements = computed(() => {
  const totalChecks = habitStore.habits.reduce((s, h) => s + h.total, 0);
  const bestStreak = habitStore.habits.reduce(
    (m, h) => Math.max(m, h.streak),
    0
  );
  const hasFirstCheck = totalChecks >= 1;
  const hasAnyHabit = habitStore.habits.length > 0;

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
      unlocked: habitStore.points >= 200,
    },
  ];
});

const unlockedCount = computed(
  () => allAchievements.value.filter((a) => a.unlocked).length
);

const level = computed(() => Math.floor(habitStore.points / 100) + 1);
const nextLevelAt = computed(() => level.value * 100);
const progressToNext = computed(() => {
  const base = (level.value - 1) * 100;
  const current = habitStore.points - base;
  return Math.max(0, Math.min(100, Math.round((current / 100) * 100)));
});

// Модалки и новые привычки
const modalVisible = ref(false);
const selectedIcon = ref(null);
const newHabitTitle = ref("");

const habitIcons = [
  { id: "book", svg: "<path ... />" },
  { id: "call", svg: "<path ... />" },
  { id: "camera", svg: "<path ... />" },
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

  habitStore.addHabit({
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

function toggleHabitCompletion(habit) {
  habitStore.toggleHabit(habit.id);
}

function removeHabit(id) {
  habitStore.removeHabit(id);
}
</script>

<template>
  <Header />
  <router-view />
  <HabitQuest
    :points="habitStore.points"
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
