<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useHabitStore } from "../stores/habitStore";

const route = useRoute();
const router = useRouter();
const habitStore = useHabitStore();

const name = ref("");
const description = ref("");
const category = ref("health");

onMounted(() => {
  const habitId = route.params.id;
  const habit = habitStore.habits.find((h) => h.id === habitId);

  if (habit) {
    name.value = habit.name;
    description.value = habit.description || "";
    category.value = habit.category || "health";
  }
});

function updateHabit() {
  if (!name.value.trim()) return;

  const habitId = route.params.id;
  const habit = habitStore.habits.find((h) => h.id === habitId);

  if (habit) {
    habit.name = name.value;
    habit.description = description.value;
    habit.category = category.value;

    habitStore.saveToStorage();

    router.push(`/habits/${habitId}`);
  }
}
</script>

<template>
  <div class="edit-habit">
    <h2>Edit Habit</h2>

    <form @submit.prevent="updateHabit" class="habit-form">
      <div class="form-group">
        <label>Habit Name *</label>
        <input type="text" v-model="name" required />
      </div>

      <div class="form-group">
        <label>Description (Optional)</label>
        <textarea v-model="description" rows="3"></textarea>
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
        <button type="submit" class="btn-primary">Save Changes</button>
        <router-link :to="`/habits/${$route.params.id}`" class="btn-secondary"
          >Cancel</router-link
        >
      </div>
    </form>
  </div>
</template>

<style scoped>
.edit-habit {
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
