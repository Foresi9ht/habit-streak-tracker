<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import HabitQuest from "./components/HabitQuest.vue";
import MyHabit from "./components/MyHabit.vue";
import Achievements from "./components/Achievements.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useHabitStore } from "./stores/habitStore";
import { useTheme } from "./composables/useTheme";
import { useRoute } from "vue-router";

const { darkMode, toggleTheme } = useTheme();
const habitStore = useHabitStore();
const route = useRoute();

const modalVisible = ref(false);
const selectedIcon = ref(null);
const newHabitTitle = ref("");

watch(modalVisible, (newValue) => {
  console.log("🔴 MODAL VISIBILITY CHANGED TO:", newValue);
});

const habitIcons = [
  {
    id: "book",
    svg: "<path d='M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'/>",
  },
  {
    id: "call",
    svg: "<path d='M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z'/>",
  },
  {
    id: "camera",
    svg: "<path d='M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z'/><path d='M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39z'/>",
  },
];

onMounted(() => {
  console.log("🟢 App mounted, initial modalVisible:", modalVisible.value);
  habitStore.loadFromStorage();
  console.log("🟢 After load, modalVisible:", modalVisible.value);
});

const circularHabits = computed(() =>
  habitStore.habits.map((habit) => ({
    ...habit,
    completed: habit.lastChecked === new Date().toISOString().slice(0, 10),
  }))
);

const allAchievements = computed(() => habitStore.achievements);
const unlockedCount = computed(
  () => allAchievements.value.filter((a) => a.unlocked).length
);

const level = computed(() => habitStore.level);
const nextLevelAt = computed(() => habitStore.nextLevelAt);
const progressToNext = computed(() => habitStore.progressToNext);
const isOnHabitsRoute = computed(() => route.path.startsWith("/habits"));

function openModal() {
  console.log("🟡 openModal() called");
  modalVisible.value = true;
}

function closeModal() {
  console.log("🟡 closeModal() called");
  modalVisible.value = false;
  newHabitTitle.value = "";
  selectedIcon.value = null;
}

function selectIcon(iconId) {
  selectedIcon.value = iconId;
}

function addCircularHabit() {
  const title = newHabitTitle.value.trim();
  const icon = habitIcons.find((i) => i.id === selectedIcon.value);
  if (!title || !icon) {
    console.log("❌ Cannot add habit: missing title or icon");
    return;
  }

  console.log("➕ Adding new habit:", title);

  habitStore.addHabit({
    id: crypto.randomUUID(),
    name: title,
    streak: 0,
    lastChecked: null,
    total: 0,
    createdAt: new Date().toISOString(),
    icon: icon.svg,
  });

  closeModal();
}

function toggleHabitCompletion(habit) {
  console.log("🔄 Toggling habit:", habit.name);
  habitStore.toggleHabit(habit.id);
}

function removeHabit(id) {
  console.log("🗑️ Removing habit ID:", id);
  habitStore.removeHabit(id);
}
</script>

<template>
  <div class="app">
    <div
      v-if="false"
      style="
        position: fixed;
        top: 10px;
        left: 10px;
        z-index: 9999;
        background: white;
        padding: 10px;
        border: 2px solid red;
      "
    >
      <p>Debug Panel</p>
      <p>Modal: {{ modalVisible }}</p>
      <p>Points: {{ habitStore.points }}</p>
      <p>Level: {{ level }}</p>
      <p>Current Route: {{ route.path }}</p>
      <button @click="modalVisible = false">Force Close</button>
      <button @click="modalVisible = !modalVisible">Toggle</button>
    </div>

    <Header />
    <main class="main-content">
      <router-view />
    </main>

    <div v-if="!isOnHabitsRoute">
      <HabitQuest
        :points="habitStore.points"
        :level="level"
        :progress="progressToNext"
        :nextLevelAt="nextLevelAt"
        :unlockedCount="unlockedCount"
        :totalAchievements="allAchievements.length"
        :darkMode="darkMode"
        @toggle-theme="toggleTheme"
      />

      <MyHabit
        :habits="circularHabits"
        :habitIcons="habitIcons"
        :modalVisible="modalVisible"
        :newHabitTitle="newHabitTitle"
        :selectedIcon="selectedIcon"
        @toggle-habit="toggleHabitCompletion"
        @remove-habit="removeHabit"
        @open-modal="openModal"
        @close-modal="closeModal"
        @select-icon="selectIcon"
        @add-habit="addCircularHabit"
        @update:title="newHabitTitle = $event"
      />

      <Achievements :achievements="allAchievements" />
    </div>

    <Footer />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>
