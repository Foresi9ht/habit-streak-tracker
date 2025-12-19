import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useHabitStore = defineStore("habit", () => {
  const habits = ref([]);
  const points = ref(0);

  function loadFromStorage() {
    const stored = localStorage.getItem("habitQuest.v1");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        habits.value = parsed.habits || [];
        points.value = parsed.points || 0;
      } catch (error) {
        console.error("Error loading from storage:", error);
        habits.value = [];
        points.value = 0;
      }
    }
  }

  function saveToStorage() {
    localStorage.setItem(
      "habitQuest.v1",
      JSON.stringify({
        habits: habits.value,
        points: points.value,
        lastSaved: new Date().toISOString(),
      })
    );
  }

  function addHabit(habit) {
    habits.value.push(habit);
    saveToStorage();
    return habit;
  }

  function removeHabit(id) {
    habits.value = habits.value.filter((h) => h.id !== id);
    saveToStorage();
  }

  function toggleHabit(id) {
    const habit = habits.value.find((h) => h.id === id);
    if (!habit) return;

    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    if (habit.lastChecked === today) {
      habit.lastChecked = null;
      habit.total = Math.max(0, habit.total - 1);

      if (habit.streak > 0) {
        habit.streak -= 1;
      }

      points.value = Math.max(0, points.value - 10);
    } else {
      habit.lastChecked = today;
      habit.total += 1;

      if (habit.lastChecked === yesterday) {
        habit.streak += 1;
      } else if (!habit.lastChecked || habit.lastChecked !== yesterday) {
        habit.streak = 1;
      }

      let pointsToAdd = 10;

      if (habit.streak === 3) pointsToAdd += 5;
      if (habit.streak === 7) pointsToAdd += 10;
      if (habit.streak === 30) pointsToAdd += 30;

      points.value += pointsToAdd;
    }

    saveToStorage();
    return habit;
  }

  function checkHabit(habit) {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .slice(0, 10);

    if (!habit || habit.lastChecked === today) return habit;

    if (habit.lastChecked === yesterday) {
      habit.streak += 1;
    } else {
      habit.streak = 1;
    }

    habit.lastChecked = today;
    habit.total += 1;

    let pointsToAdd = 10;
    if (habit.streak === 3) pointsToAdd += 5;
    if (habit.streak === 7) pointsToAdd += 10;
    if (habit.streak === 30) pointsToAdd += 30;

    points.value += pointsToAdd;
    saveToStorage();

    return habit;
  }

  const totalAchievements = computed(() => {
    return habits.value.length;
  });

  const achievements = computed(() => {
    const totalChecks = habits.value.reduce((sum, h) => sum + h.total, 0);
    const bestStreak = habits.value.reduce(
      (max, h) => Math.max(max, h.streak),
      0
    );
    const hasAnyHabit = habits.value.length > 0;
    const hasFirstCheck = totalChecks >= 1;

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
        unlocked: points.value >= 200,
      },
    ];
  });

  const level = computed(() => Math.floor(points.value / 100) + 1);
  const nextLevelAt = computed(() => level.value * 100);
  const progressToNext = computed(() => {
    const base = (level.value - 1) * 100;
    const current = points.value - base;
    return Math.max(0, Math.min(100, Math.round((current / 100) * 100)));
  });

  return {
    habits,
    points,
    loadFromStorage,
    saveToStorage,
    addHabit,
    removeHabit,
    toggleHabit,
    checkHabit,
    totalAchievements,
    achievements,
    level,
    nextLevelAt,
    progressToNext,
  };
});
