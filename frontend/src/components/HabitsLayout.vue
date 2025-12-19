<script setup>
import { useHabitStore } from "../stores/habitStore";

const habitStore = useHabitStore();
</script>

<template>
  <div class="habits-layout">
    <h1>My Habits Dashboard</h1>
    <div class="habits-nav">
      <router-link to="/habits">All Habits</router-link> |
      <router-link to="/habits/create">Create New</router-link> |
      <router-link to="/habits/stats">Statistics</router-link>
    </div>

    <!-- This is where nested routes will appear -->
    <router-view></router-view>

    <div class="habits-summary">
      <p>Total Habits: {{ habitStore.habits.length }}</p>
      <p>Total Points: {{ habitStore.points }}</p>
    </div>
  </div>
</template>

<style scoped>
.habits-layout {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.habits-nav {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 8px;
  margin: 20px 0;
}

.habits-nav a {
  margin: 0 10px;
  color: #125dc8;
  text-decoration: none;
}

.habits-nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}

.habits-summary {
  margin-top: 30px;
  padding: 15px;
  background: #e8f4ff;
  border-radius: 8px;
}
</style>
