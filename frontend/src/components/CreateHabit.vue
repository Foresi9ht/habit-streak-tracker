<!-- src/components/CreateHabit.vue -->
<script setup>
import { ref } from "vue";
import { useHabitStore } from "../stores/habitStore";
import { useRouter } from "vue-router";

const habitStore = useHabitStore();
const router = useRouter();

const name = ref("");
const description = ref("");
const category = ref("health");

function createHabit() {
  if (!name.value.trim()) return;

  const newHabit = {
    id: crypto.randomUUID(),
    name: name.value,
    description: description.value,
    category: category.value,
    streak: 0,
    lastChecked: null,
    total: 0,
    createdAt: new Date().toISOString(),
  };

  habitStore.addHabit(newHabit);

  // Reset form
  name.value = "";
  description.value = "";
  category.value = "health";

  // Go back to habits list
  router.push("/habits");
}
</script>

<template>
  <div class="create-habit">
    <h2>Create New Habit</h2>

    <form @submit.prevent="createHabit" class="habit-form">
      <div class="form-group">
        <label>Habit Name *</label>
        <input
          type="text"
          v-model="name"
          placeholder="e.g., Drink 8 glasses of water"
          required
        />
      </div>

      <div class="form-group">
        <label>Description (Optional)</label>
        <textarea
          v-model="description"
          placeholder="Add more details about your habit..."
          rows="3"
        ></textarea>
      </div>

      <div class="form-group">
        <label>Category</label>
        <select v-model="category">
          <option value="health">Health</option>
          <option value="fitness">Fitness</option>
          <option value="learning">Learning</option>
          <option value="productivity">Productivity</option>
          <option value="mindfulness">Mindfulness</option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-primary">Create Habit</button>
        <router-link to="/habits" class="btn-secondary">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-habit {
  max-width: 500px;
  margin: 0 auto;
}

.habit-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 30px;
}

.btn-primary {
  background: #125dc8;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  text-align: center;
}
</style>
