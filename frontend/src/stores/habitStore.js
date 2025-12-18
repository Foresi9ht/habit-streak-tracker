// stores/habitStore.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useHabitStore = defineStore("habit", () => {
  const habits = ref([]);
  const points = ref(0);

  // Add this function
  function loadFromStorage() {
    const stored = localStorage.getItem("habitQuest.v1");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        habits.value = parsed.habits || [];
        points.value = parsed.points || 0;
      } catch (error) {
        console.error("Error loading from storage:", error);
      }
    }
  }

  function addHabit(habit) {
    habits.value.push(habit);
    saveToStorage();
  }

  function removeHabit(id) {
    habits.value = habits.value.filter((h) => h.id !== id);
    saveToStorage();
  }

  function checkHabit(habit) {
    const today = new Date().toISOString().slice(0, 10);
    if (habit.lastChecked === today) return;

    habit.streak =
      habit.lastChecked ===
      new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        ? habit.streak + 1
        : 1;

    habit.lastChecked = today;
    habit.total += 1;
    points.value += 10;
    saveToStorage();
  }

  // Add this helper function
  function saveToStorage() {
    localStorage.setItem(
      "habitQuest.v1",
      JSON.stringify({
        habits: habits.value,
        points: points.value,
      })
    );
  }

  const totalAchievements = computed(() => habits.value.length);

  return {
    habits,
    points,
    loadFromStorage,
    addHabit,
    removeHabit,
    checkHabit,
    totalAchievements,
    saveToStorage,
  };
});
