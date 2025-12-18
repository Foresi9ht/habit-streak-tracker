import { ref, onMounted } from "vue";

export function useTheme() {
  const darkMode = ref(false);

  function toggleTheme() {
    darkMode.value = !darkMode.value;
    document.documentElement.classList.toggle("dark", darkMode.value);
    localStorage.setItem("theme", darkMode.value ? "dark" : "light");
  }

  onMounted(() => {
    darkMode.value = localStorage.getItem("theme") === "dark";
    if (darkMode.value) document.documentElement.classList.add("dark");
  });

  return { darkMode, toggleTheme };
}
