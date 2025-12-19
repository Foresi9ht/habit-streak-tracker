<script setup>
import { useHabitStore } from "../stores/habitStore";

const habitStore = useHabitStore();

const habits = habitStore.habits;
</script>

<template>
  <div class="habits-list">
    <h2>All Habits ({{ habits.length }})</h2>

    <div v-if="habits.length === 0" class="empty-state">
      <p>No habits yet. Create your first one!</p>
      <router-link to="/habits/create">Create Habit</router-link>
    </div>

    <div v-else class="habits-grid">
      <div v-for="habit in habits" :key="habit.id" class="habit-card">
        <h3>{{ habit.name }}</h3>
        <p>Streak: {{ habit.streak }} days</p>
        <p>Total checks: {{ habit.total }}</p>
        <router-link :to="`/habits/${habit.id}`">View Details</router-link> |
        <router-link :to="`/habits/${habit.id}/edit`">Edit</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.habits-list {
  margin-top: 20px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background: #f9f9f9;
  border-radius: 8px;
}

.habits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.habit-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.2s;
}

.habit-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.habit-card h3 {
  margin-top: 0;
  color: #125dc8;
}
</style>
