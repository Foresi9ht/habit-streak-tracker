<script setup>
defineProps({
  habits: Array,
  habitIcons: Array,
  modalVisible: Boolean,
  newHabitTitle: String,
  selectedIcon: String,
});

defineEmits([
  "toggle-habit",
  "remove-habit",
  "open-modal",
  "close-modal",
  "select-icon",
  "add-habit",
  "update:title",
]);
</script>

<template>
  <section class="habit-tracker">
    <h2>My Habits</h2>

    <div class="habit-container">
      <div
        v-for="habit in habits"
        :key="habit.id"
        class="habit"
        @contextmenu.prevent="$emit('remove-habit', habit.id)"
      >
        <button
          class="habit-btn"
          :class="{ completed: habit.completed }"
          @click="$emit('toggle-habit', habit)"
        >
          <svg v-html="habit.icon" width="24" height="24"></svg>
        </button>

        <div class="habit-name">{{ habit.name }}</div>
        <div class="habit-streak">Streak: {{ habit.streak }}</div>
      </div>

      <div class="new-habit">
        <button class="new-habit__add" @click="$emit('open-modal')">+</button>
      </div>
    </div>
  </section>

  <!-- Modal - Using v-show -->
  <div class="modal-container" v-show="modalVisible">
    <div class="modal">
      <h2>Add a new habit</h2>

      <input
        :value="newHabitTitle"
        @input="$emit('update:title', $event.target.value)"
        placeholder="Enter a habit name"
      />

      <div class="icons">
        <button
          v-for="icon in habitIcons"
          :key="icon.id"
          class="icon"
          :class="{ selected: selectedIcon === icon.id }"
          @click="$emit('select-icon', icon.id)"
        >
          <svg v-html="icon.svg"></svg>
        </button>
      </div>

      <div class="modal-btns">
        <button @click="$emit('add-habit')">Add Habit</button>
        <button @click="$emit('close-modal')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.habit-tracker {
  margin-top: 28px;
  position: relative;
}

.habit-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  padding: 0 0 50px 220px;
  max-width: 500px;
  margin: auto;
  grid-gap: 1rem;
}

.habit {
  display: grid;
  place-items: center;
  text-align: center;
}

.habit-btn {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: white;
  border: 6px solid #125dc8;
  color: #125dc8;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: all 300ms ease-in-out;
}

.habit-btn:hover {
  opacity: 0.5;
}

.icon:hover {
  opacity: 0.5;
}

.habit-btn.completed {
  background-color: #125dc8;
  color: #000000ff;
}

.habit-btn svg {
  pointer-events: none;
  width: 3rem;
  height: 3rem;
}

.habit-name {
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.habit-streak {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.new-habit__add {
  width: 3rem;
  height: 3rem;
  border-radius: 100px;
  background-color: #125dc8;
  color: white;
  display: grid;
  place-items: center;
  transition: all 300ms ease-in-out;
  cursor: pointer;
  border: none;
  margin: 18px 0 0 0;
}

.modal-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  place-items: center;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.modal {
  border: 3px solid var(--secondary);
  padding: 2rem;
  background-color: var(--primary);
  box-shadow: 1px 4px 30px 10px var(--shadow);
  border-radius: 12px;
  min-width: 300px;
  max-width: 90%;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal h2 {
  text-align: center;
  margin-bottom: 1rem;
  justify-content: center;
}

.modal input {
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  background-color: var(--light);
  padding: 0.5rem;
  width: 100%;
  margin-bottom: 1rem;
  border-radius: 6px;
  border: 1px solid var(--secondary);
}

.modal input:focus {
  outline: 2px solid var(--secondary);
}

.icons {
  display: grid;
  place-items: center;
  padding: 1.5rem 0;
  grid-template-columns: repeat(auto-fit, minmax(40px, 1fr));
  grid-gap: 1rem;
}

.icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--secondary);
  border: 4px solid black;
  display: grid;
  place-items: center;
  transition: all 300ms ease-in-out;
  cursor: pointer;
}

.icon.selected {
  background-color: var(--secondary);
  color: var(--primary);
}

.modal-btns {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 0.5rem;
}

.modal-btns button {
  font-size: inherit;
  font-family: inherit;
  color: inherit;
  background-color: var(--light);
  padding: 0.5rem;
  cursor: pointer;
  transition: all 300ms ease-in-out;
  border-radius: 6px;
  border: 1px solid var(--secondary);
}

.modal-btns button:hover {
  color: white;
  background-color: #125dc8;
}
:root {
  --primary: #ffffff;
  --secondary: #125dc8;
  --light: #f4f5f5;
  --shadow: rgba(8, 47, 102, 0.12);
}

:root.dark {
  --primary: #1a1a1a;
  --secondary: #3b82f6;
  --light: #2d3748;
  --shadow: rgba(0, 0, 0, 0.3);
}
</style>
