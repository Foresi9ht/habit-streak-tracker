<script setup>
defineProps({
  points: Number,
  level: Number,
  progress: Number,
  nextLevelAt: Number,
  unlockedCount: Number,
  totalAchievements: Number,
  darkMode: Boolean,
});

defineEmits(["toggle-theme"]);
</script>

<template>
  <!-- Theme toggle -->
  <div class="theme-container">
    <button
      class="theme"
      :class="{ dark: darkMode }"
      @click="$emit('toggle-theme')"
    >
      <span class="theme-slider"></span>
    </button>
  </div>

  <!-- Hero -->
  <div class="hero">
    <h1>Habit Quest</h1>
    <p>Track your habits, earn points, unlock achievements</p>
  </div>

  <!-- Stats -->
  <section class="stats">
    <div class="card">
      <div class="stat">
        <div class="stat__label">Points</div>
        <div class="stat__value">{{ points }}</div>
      </div>

      <div class="stat">
        <div class="stat__label">Level</div>
        <div class="stat__value">Lv. {{ level }}</div>
        <div class="progress">
          <div class="progress__bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="muted">Next level at {{ nextLevelAt }} pts</div>
      </div>

      <div class="stat">
        <div class="stat__label">Achievements</div>
        <div class="stat__value">
          {{ unlockedCount }} / {{ totalAchievements }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Your existing Vue styles remain the same */
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap");

body {
  font-family: "Oswald", sans-serif;
  overflow-x: hidden;
}

.app {
  max-width: 920px;
  margin: 0 auto;
  padding: 24px;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
    "Helvetica Neue", Arial;
  position: relative;
}

.hero {
  background-color: white;
  text-align: center;
  margin-bottom: 24px;
  position: relative;
}

.hero h1 {
  font-size: 28px;
  margin-bottom: 6px;
  margin: 0;
}

.hero p {
  color: #6b7280;
  margin: 0;
  margin-top: 8px;
}

.card {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr);
  background: #fff;
  border: 1px solid #000000ff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}
.stat__label {
  color: #6b7280;
  font-size: 12px;
}
.stat__value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 4px;
}
.progress {
  height: 8px;
  background: #fff;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 8px;
}
.progress__bar {
  height: 100%;
  background: #3b82f6;
}

.theme-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.theme {
  width: 50px;
  height: 24px;
  border-radius: 12px;
  position: relative;
  background-color: #3b82f6;
  cursor: pointer;
  border: none;
  padding: 0;
  display: block;
}

.theme-slider {
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 300ms ease-in-out;
}

.theme.dark .theme-slider {
  transform: translateX(26px);
}
:root {
  --primary: #000000ff;
  --secondary: #125dc8;
  --light: #f4f5f5;
  --danger: #d81616;
  --shadow: rgba(8, 47, 102, 0.12);
}

:root.dark {
  --primary: #12223b;
  --secondary: #627da6;
  --light: #003074;
  --danger: #9f0b0b;
  --shadow: rgba(152, 174, 205, 0.05);
}

:root.dark .card {
  background: black;
  border-color: #374151;
  color: #e5e7eb;
}

:root.dark #app {
  background-color: black;
}

:root.dark .stat__label {
  color: white;
}

:root.dark .achv {
  background: black;
  border-color: #374151;
  color: #e5e7eb;
}

:root.dark .achv--on {
  background: #423d22ff;
  border-color: #4b5563;
}

:root.dark .achv__desc {
  color: #9ca3af;
}

:root.dark .hero p {
  color: #9ca3af;
}

:root.dark .habit-streak {
  color: #9ca3af;
}

:root.dark .foot {
  color: #6b7280;
}

:root.dark body {
  background-color: #12223b;
  color: #e5e7eb;
}
</style>
