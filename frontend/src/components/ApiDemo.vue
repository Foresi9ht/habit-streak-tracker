<script setup>
import { ref, onMounted } from "vue";

const data = ref([]);
const loading = ref(false);
const error = ref(null);

async function fetchApi() {
  loading.value = true;
  try {
    const res = await fetch(
      "https://jsonplaceholder.typicode.com/todos?_limit=5"
    );
    data.value = await res.json();
  } catch (e) {
    error.value = "Failed to load";
  } finally {
    loading.value = false;
  }
}

onMounted(fetchApi);
</script>

<template>
  <h2>API Demo</h2>
  <p v-if="loading">Loading...</p>
  <p v-if="error">{{ error }}</p>

  <ul>
    <li v-for="item in data" :key="item.id">
      {{ item.title }}
    </li>
  </ul>
</template>
