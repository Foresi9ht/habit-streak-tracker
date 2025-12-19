<script setup>
import { useHabitStore } from "../stores/habitStore";
import { computed } from "vue";

const habitStore = useHabitStore();

const stats = computed(() => {
  const habits = habitStore.habits;

  return {
    totalHabits: habits.length,
    totalChecks: habits.reduce((sum, h) => sum + h.total, 0),
    averageStreak:
      habits.length > 0
        ? Math.round(
            habits.reduce((sum, h) => sum + h.streak, 0) / habits.length
          )
        : 0,
    bestStreak: habits.reduce((max, h) => Math.max(max, h.streak), 0),
    habitsByCategory: habits.reduce((acc, h) => {
      const category = h.category || "uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {}),
  };
});
</script>

<template>
  <div class="habit-stats">
    <h2>Habit Statistics</h2>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Habits</h3>
        <div class="stat-value">{{ stats.totalHabits }}</div>
      </div>

      <div class="stat-card">
        <h3>Total Check-ins</h3>
        <div class="stat-value">{{ stats.totalChecks }}</div>
      </div>

      <div class="stat-card">
        <h3>Average Streak</h3>
        <div class="stat-value">{{ stats.averageStreak }} days</div>
      </div>

      <div class="stat-card">
        <h3>Best Streak</h3>
        <div class="stat-value">{{ stats.bestStreak }} days</div>
      </div>
    </div>

    <div
      class="category-stats"
      v-if="Object.keys(stats.habitsByCategory).length > 0"
    >
      <h3>Habits by Category</h3>
      <div class="category-list">
        <div
          v-for="(count, category) in stats.habitsByCategory"
          :key="category"
          class="category-item"
        >
          <span class="category-name">{{ category }}</span>
          <span class="category-count">{{ count }}</span>
        </div>
      </div>
    </div>

    <div v-else class="no-stats">
      <p>No habits yet to show statistics.</p>
    </div>
  </div>
</template>

<style scoped>
.habit-stats {
  margin-top: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.stat-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.stat-card h3 {
  margin-top: 0;
  font-size: 1rem;
  color: #666;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #125dc8;
}

.category-stats {
  margin-top: 30px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 4px;
}

.category-name {
  text-transform: capitalize;
}

.category-count {
  font-weight: bold;
  color: #125dc8;
}

.no-stats {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
