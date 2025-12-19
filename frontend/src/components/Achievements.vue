<script setup>
defineProps({
  achievements: Array,
});
</script>

<template>
  <section class="achievements">
    <h2>Achievements</h2>

    <div class="grid">
      <div
        v-for="a in achievements"
        :key="a.code"
        class="achv"
        :class="{ 'achv--on': a.unlocked }"
      >
        <div class="achv__emoji">{{ a.emoji }}</div>
        <div class="achv__title">{{ a.title }}</div>
        <div class="achv__desc">{{ a.desc }}</div>
        <div class="achv__status">
          {{ a.unlocked ? "Unlocked" : "Locked" }}
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap");

body {
  font-family: "Oswald", sans-serif;
  overflow-x: hidden;
}

.achievements {
  margin-top: 32px;
}
.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}
.achv {
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
  padding: 12px;
  background: #fafafa;
  text-align: center;
  transition: 0.2s;
}
.achv--on {
  background: #fff;
  border: 1px solid #d1fae5;
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.12);
}
.achv__emoji {
  font-size: 28px;
}
.achv__title {
  font-weight: 700;
  margin-top: 6px;
}
.achv__desc {
  color: #6b7280;
  font-size: 12px;
  margin-top: 2px;
}
.achv__status {
  margin-top: 8px;
  font-size: 12px;
  color: #059669;
  font-weight: 700;
}

.foot {
  text-align: center;
  color: #9ca3af;
  margin-top: 36px;
}
</style>
