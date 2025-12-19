<template>
  <div v-if="habit">
    <h2>{{ habit.name }}</h2>

    <p>Streak: {{ habit.streak }} days</p>
    <p>Total completions: {{ habit.total }}</p>
    <p>Last checked: {{ habit.lastChecked || "Never" }}</p>

    <button @click="checkHabitToday" :disabled="isCheckedToday">
      {{ isCheckedToday ? "Already checked today ✅" : "Check Today" }}
    </button>

    <button @click="goBack">Back</button>
  </div>

  <div v-else>
    <p>Habit not found.</p>
    <router-link to="/habits">Go back</router-link>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { useHabitStore } from "../stores/habitStore";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();
const habitStore = useHabitStore();
const habitId = route.params.id;
const habit = computed(() => habitStore.habits.find((h) => h.id === habitId));
const isCheckedToday = computed(() => {
  if (!habit.value) return false;
  const today = new Date().toISOString().slice(0, 10);
  return habit.value.lastChecked === today;
});

function checkHabitToday() {
  if (habit.value && !isCheckedToday.value) {
    habitStore.checkHabit(habit.value);
  }
}

function goBack() {
  router.push("/habits");
}
</script>
