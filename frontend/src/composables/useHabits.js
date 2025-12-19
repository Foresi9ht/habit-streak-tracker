import { ref, computed, watch } from "vue";

const STORAGE_KEY = "habitQuest.v1";

export function useHabits() {
  const state = ref(
    load() ?? { habits: [], points: 0, createdAt: new Date().toISOString() }
  );

  const todayStr = () => new Date().toISOString().slice(0, 10);
  const dateToStr = (d) => d.toISOString().slice(0, 10);
  const isToday = (iso) => iso === todayStr();
  const isYesterday = (iso) => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return iso === dateToStr(d);
  };

  function load() {
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
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value));
  }

  watch(state, save, { deep: true });

  function addHabit(name) {
    const trimmed = name.trim();
    if (!trimmed) return;
    state.value.habits.push({
      id: crypto.randomUUID(),
      name: trimmed,
      streak: 0,
      lastChecked: null,
      total: 0,
      createdAt: new Date().toISOString(),
    });
  }

  function removeHabit(id) {
    state.value.habits = state.value.habits.filter((h) => h.id !== id);
  }

  function checkHabit(habit) {
    if (!habit) return;
    if (habit.lastChecked && isToday(habit.lastChecked)) return;

    if (habit.lastChecked && isYesterday(habit.lastChecked)) habit.streak += 1;
    else habit.streak = 1;

    habit.lastChecked = todayStr();
    habit.total += 1;

    let gained = 10;
    if (habit.streak === 3) gained += 5;
    if (habit.streak === 7) gained += 10;
    if (habit.streak === 30) gained += 30;
    state.value.points += gained;
  }

  const circularHabits = computed(() =>
    state.value.habits.map((habit) => ({
      ...habit,
      completed: habit.lastChecked === todayStr(),
    }))
  );

  const level = computed(() => Math.floor(state.value.points / 100) + 1);
  const nextLevelAt = computed(() => level.value * 100);
  const progressToNext = computed(() => {
    const base = (level.value - 1) * 100;
    const current = state.value.points - base;
    return Math.max(0, Math.min(100, Math.round((current / 100) * 100)));
  });

  return {
    state,
    circularHabits,
    level,
    nextLevelAt,
    progressToNext,
    addHabit,
    removeHabit,
    checkHabit,
  };
}
